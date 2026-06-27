const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Mock Twilio BEFORE loading whatsappController
const mockTwilio = function() {
  return {
    messages: {
      create: async function(options) {
        console.log("📱 [MOCK WHATSAPP OUTGOING]");
        console.log(`   TO: ${options.to}`);
        console.log(`   BODY:\n${options.body.split("\n").map(l => "     " + l).join("\n")}`);
        console.log("-----------------------------------------");
        return { sid: "mock_sid_" + Math.random(), status: "queued" };
      }
    }
  };
};
require.cache[require.resolve("twilio")] = {
  id: require.resolve("twilio"),
  filename: require.resolve("twilio"),
  loaded: true,
  exports: mockTwilio
};

const User = require("../models/User");
const Customer = require("../models/Customer");
const Worker = require("../models/Worker");
const WhatsAppSession = require("../models/WhatsAppSession");
const whatsappController = require("../controllers/whatsappController");

require("dotenv").config();

async function runTests() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillbridge");
    console.log("Connected successfully!");

    const phoneNum = "9999999999";
    
    // Find or create test customer user
    let customerUser = await User.findOne({ phone: phoneNum });
    if (!customerUser) {
      customerUser = await User.create({
        name: "Test Customer",
        phone: phoneNum,
        password: await bcrypt.hash("password123", 10),
        role: "customer"
      });
    }

    let customer = await Customer.findOne({ phone: phoneNum });
    if (!customer) {
      customer = await Customer.create({
        name: "Test Customer",
        phone: phoneNum,
        location: {
          type: "Point",
          coordinates: [73.8567, 18.5204] // Default Pune coords
        }
      });
    } else {
      customer.location = {
        type: "Point",
        coordinates: [73.8567, 18.5204]
      };
      await customer.save();
    }

    // Reset session
    await WhatsAppSession.deleteMany({ phone: `whatsapp:+${phoneNum}` });
    console.log("Test customer and session reset completed.");

    const makeRequest = async (bodyText, latitude = null, longitude = null) => {
      console.log(`\n📥 [INCOMING MESSAGE]: "${bodyText}" ${latitude ? `(Location: ${latitude}, ${longitude})` : ""}`);
      const req = {
        body: {
          From: `whatsapp:+${phoneNum}`,
          Body: bodyText,
          Latitude: latitude,
          Longitude: longitude
        }
      };
      let resolved = false;
      const res = {
        status(code) {
          return {
            end() {
              resolved = true;
            }
          };
        }
      };
      await whatsappController.handleIncomingMessage(req, res);
    };

    // Step 1: Send "Hi"
    await makeRequest("Hi");
    let session = await WhatsAppSession.findOne({ phone: `whatsapp:+${phoneNum}` });
    console.log("Current Stage after 'Hi':", session.stage);
    if (session.stage === "WAITING_SERVICE") {
      console.log("✅ Step 1 Passed: Transitioned to WAITING_SERVICE");
    } else {
      console.error("❌ Step 1 Failed");
    }

    // Step 2: Send "Other"
    await makeRequest("Other");
    session = await WhatsAppSession.findOne({ phone: `whatsapp:+${phoneNum}` });
    console.log("Current Stage after 'Other':", session.stage);
    if (session.stage === "WAITING_CUSTOM_SERVICE") {
      console.log("✅ Step 2 Passed: Transitioned to WAITING_CUSTOM_SERVICE");
    } else {
      console.error("❌ Step 2 Failed");
    }

    // Step 3: Send custom service "Plumber". Should trigger location prompt since coordinates match Pune default.
    await makeRequest("Plumber");
    session = await WhatsAppSession.findOne({ phone: `whatsapp:+${phoneNum}` });
    console.log("Current Stage after 'Plumber':", session.stage);
    if (session.stage === "WAITING_LOCATION") {
      console.log("✅ Step 3 Passed: Detected default coordinates and transitioned to WAITING_LOCATION");
    } else {
      console.error("❌ Step 3 Failed");
    }

    // Step 4: Share location (e.g. 18.5205, 73.8568)
    await makeRequest("", 18.5205, 73.8568);
    session = await WhatsAppSession.findOne({ phone: `whatsapp:+${phoneNum}` });
    customer = await Customer.findOne({ phone: phoneNum });
    console.log("Updated Customer Coordinates in DB:", customer.location.coordinates);
    console.log("Current Stage after location shared:", session.stage);
    if (
      customer.location.coordinates[0] === 73.8568 &&
      customer.location.coordinates[1] === 18.5205 &&
      session.stage === "SHOWING_WORKERS"
    ) {
      console.log("✅ Step 4 Passed: Coordinates saved, searched workers, stage updated to SHOWING_WORKERS");
    } else {
      console.error("❌ Step 4 Failed");
    }

    // Step 5: Test location update command
    console.log("\n--- Testing 'Update Location' Command ---");
    await makeRequest("Update Location");
    session = await WhatsAppSession.findOne({ phone: `whatsapp:+${phoneNum}` });
    console.log("Current Stage after 'Update Location':", session.stage);
    if (session.stage === "WAITING_LOCATION") {
      console.log("✅ Step 5 Passed: Command transitioned stage to WAITING_LOCATION");
    } else {
      console.error("❌ Step 5 Failed");
    }

    // Step 6: Overwrite coordinates via location message without active service
    session.selectedSkill = ""; // Clear selected skill to simulate standalone location update
    await session.save();

    await makeRequest("", 18.5300, 73.8600);
    session = await WhatsAppSession.findOne({ phone: `whatsapp:+${phoneNum}` });
    customer = await Customer.findOne({ phone: phoneNum });
    console.log("Overwritten Coordinates in DB:", customer.location.coordinates);
    console.log("Current Stage after standalone update:", session.stage);
    if (
      customer.location.coordinates[0] === 73.8600 &&
      customer.location.coordinates[1] === 18.5300 &&
      session.stage === "idle"
    ) {
      console.log("✅ Step 6 Passed: Location overwritten standalone successfully and stage returned to idle");
    } else {
      console.error("❌ Step 6 Failed");
    }

    // Cleanup and exit
    console.log("\nDisconnecting...");
    await mongoose.disconnect();
    console.log("Done.");
  } catch (err) {
    console.error("Test failed:", err);
    await mongoose.disconnect();
  }
}

runTests();
