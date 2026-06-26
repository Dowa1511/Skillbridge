const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Booking = require("../models/Booking");
const Worker = require("../models/Worker");
const User = require("../models/User");
const bookingController = require("../controllers/bookingController");

// Load env variables
require("dotenv").config();

async function runTests() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillbridge");
    console.log("Connected successfully!");

    // Find or create test entities
    console.log("Finding/Creating test users...");
    let customerUser = await User.findOne({ phone: "9999999999" });
    if (!customerUser) {
      customerUser = await User.create({
        name: "Test Customer",
        phone: "9999999999",
        password: await bcrypt.hash("password123", 10),
        role: "customer"
      });
    }

    let workerUser = await User.findOne({ phone: "8888888888" });
    if (!workerUser) {
      workerUser = await User.create({
        name: "Test Worker",
        phone: "8888888888",
        password: await bcrypt.hash("password123", 10),
        role: "worker"
      });
    }

    let worker = await Worker.findOne({ user: workerUser._id });
    if (!worker) {
      worker = await Worker.create({
        user: workerUser._id,
        phone: "8888888888",
        profession: "Plumber",
        isProfileComplete: true,
        availability: true
      });
    }

    console.log("Setting up a test booking...");
    // Remove any previous test bookings to keep it clean
    await Booking.deleteMany({ customer: customerUser._id });

    const booking = await Booking.create({
      customer: customerUser._id,
      worker: worker._id,
      profession: "Plumber",
      date: "2026-07-01",
      time: "10:00 AM",
      address: "123 Main St",
      status: "accepted",
      price: 100
    });

    console.log("Test booking created:", booking._id);

    // Test 1: Try direct complete (should be blocked)
    console.log("\n--- TEST 1: Blocking direct complete in updateBookingStatus ---");
    let statusResponse = null;
    const req1 = {
      params: { bookingId: booking._id.toString() },
      body: { status: "completed" },
      user: workerUser
    };
    const res1 = {
      status(code) {
        return {
          json(data) {
            statusResponse = { code, data };
          }
        };
      }
    };
    await bookingController.updateBookingStatus(req1, res1);
    console.log("Result code:", statusResponse.code);
    console.log("Result message:", statusResponse.data.message);
    if (statusResponse.code === 400 && statusResponse.data.message.toLowerCase().includes("verification")) {
      console.log("✅ TEST 1 PASSED: Direct completion blocked successfully.");
    } else {
      console.error("❌ TEST 1 FAILED");
    }

    // Test 2: Generate OTP
    console.log("\n--- TEST 2: Generate OTP ---");
    let generateResponse = null;
    const req2 = {
      body: { bookingId: booking._id.toString() },
      user: workerUser
    };
    const res2 = {
      status(code) {
        return {
          json(data) {
            generateResponse = { code, data };
          }
        };
      }
    };
    await bookingController.generateOTP(req2, res2);
    console.log("Result code:", generateResponse.code);
    console.log("Result booking:", generateResponse.data.booking);
    if (generateResponse.code === 200 && generateResponse.data.booking.status === "waiting_for_otp") {
      console.log("✅ TEST 2 PASSED: Booking is now in waiting_for_otp status.");
    } else {
      console.error("❌ TEST 2 FAILED");
    }

    // Test 3: Verify OTP is hashed in DB and not exposed in API response
    console.log("\n--- TEST 3: Verify OTP Security ---");
    const updatedBooking = await Booking.findById(booking._id);
    console.log("completionOTP in DB (hashed):", updatedBooking.completionOTP);
    console.log("OTP in generateResponse:", generateResponse.data.otp);
    if (updatedBooking.completionOTP && (updatedBooking.completionOTP.startsWith("$2a$") || updatedBooking.completionOTP.startsWith("$2b$")) && !generateResponse.data.otp) {
      console.log("✅ TEST 3 PASSED: OTP is hashed in DB and not exposed in API response.");
    } else {
      console.error("❌ TEST 3 FAILED");
    }

    // Test 4: Cannot generate another OTP if one is active
    console.log("\n--- TEST 4: Block regeneration of active OTP ---");
    let regenResponse = null;
    await bookingController.generateOTP(req2, {
      status(code) {
        return {
          json(data) {
            regenResponse = { code, data };
          }
        };
      }
    });
    console.log("Result code:", regenResponse.code);
    console.log("Result message:", regenResponse.data.message);
    if (regenResponse.code === 400) {
      console.log("✅ TEST 4 PASSED: Prevented generating another active OTP.");
    } else {
      console.error("❌ TEST 4 FAILED");
    }

    // Test 5: Verify with incorrect OTP
    console.log("\n--- TEST 5: Verify with incorrect OTP ---");
    let verifyResponse = null;
    const req5 = {
      body: { bookingId: booking._id.toString(), otp: "000000" },
      user: workerUser
    };
    await bookingController.verifyOTP(req5, {
      status(code) {
        return {
          json(data) {
            verifyResponse = { code, data };
          }
        };
      }
    });
    console.log("Result code:", verifyResponse.code);
    console.log("Result message:", verifyResponse.data.message);
    if (verifyResponse.code === 400 && verifyResponse.data.message === "Invalid OTP") {
      console.log("✅ TEST 5 PASSED: Invalid OTP rejected successfully.");
    } else {
      console.error("❌ TEST 5 FAILED");
    }

    // Test 6: Verify with correct OTP
    console.log("\n--- TEST 6: Verify with correct OTP ---");
    // Since OTP is sent via WhatsApp and we don't have Twilio output programmatically easily here,
    // let's retrieve the code by hashing matching locally, wait we can't easily decrypt bcrypt.
    // Instead, let's just generate a known OTP by stubbing or checking values. Or wait, let's generate a 6-digit loop to find the match, since it's 6 digits, we can find it in a few seconds, or we can just mock Math.random to return a specific OTP during test generation.
    // Let's modify the booking record with a known bcrypt hash of '123456' for verification test.
    updatedBooking.completionOTP = await bcrypt.hash("123456", 10);
    await updatedBooking.save();

    let successVerifyResponse = null;
    const req6 = {
      body: { bookingId: booking._id.toString(), otp: "123456" },
      user: workerUser
    };
    await bookingController.verifyOTP(req6, {
      status(code) {
        return {
          json(data) {
            successVerifyResponse = { code, data };
          }
        };
      }
    });
    console.log("Result code:", successVerifyResponse.code);
    console.log("Result booking:", successVerifyResponse.data.booking);

    const finalBooking = await Booking.findById(booking._id);
    console.log("Final booking status:", finalBooking.status);
    console.log("Final completionOTP:", finalBooking.completionOTP);
    console.log("Final otpVerified:", finalBooking.otpVerified);

    if (
      successVerifyResponse.code === 200 &&
      finalBooking.status === "completed" &&
      finalBooking.otpVerified === true &&
      finalBooking.completionOTP === null
    ) {
      console.log("✅ TEST 6 PASSED: Correct OTP verified, booking completed, hashed OTP deleted.");
    } else {
      console.error("❌ TEST 6 FAILED");
    }

    // Clean up
    console.log("Cleaning up test records...");
    await Booking.deleteOne({ _id: booking._id });
    await mongoose.disconnect();
    console.log("Disconnected.");

  } catch (error) {
    console.error("Test execution failed:", error);
    await mongoose.disconnect();
  }
}

runTests();
