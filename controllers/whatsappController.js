const Worker = require("../models/Worker");
const Customer = require("../models/Customer");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const WhatsAppSession = require("../models/WhatsAppSession");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const WHATSAPP_WEB_URL = process.env.WHATSAPP_BASE_URL || "http://localhost:5173";

exports.verifyWebhook = (req, res) => {
  res.sendStatus(200);
};

const send = async (to, body) => {
  try {
    const destination = String(to || "").trim();

    const normalizedTo = destination.startsWith("whatsapp:")
      ? destination
      : `whatsapp:+${destination.replace(/\D/g, "")}`;


    let sender = process.env.TWILIO_WHATSAPP_NUMBER
      || "+14155238886";


    sender = sender.startsWith("whatsapp:")
      ? sender
      : `whatsapp:${sender}`;


    console.log("📤 Sending WhatsApp");
    console.log("FROM:", sender);
    console.log("TO:", normalizedTo);


    const msg = await client.messages.create({
      from: sender,
      to: normalizedTo,
      body,
    });

    console.log("✅ WhatsApp SID:", msg.sid);
    console.log("📦 STATUS:", msg.status);
    console.log("📨 BODY:", body);


    console.log("✅ WhatsApp reply sent");

  } catch (err) {

    console.error("❌ WhatsApp Error");
    console.error("CODE:", err.code);
    console.error("MESSAGE:", err.message);

  }
};

exports.handleIncomingMessage = async (req, res) => {
  try {
    const rawFrom = String(req.body.From || "");
    const from = rawFrom
      .replace(/^whatsapp:/i, "")
      .replace(/\D/g, "");
    console.log("Searching for:", from);

    const users = await User.find();

    console.log("========== USERS ==========");
    users.forEach((u) => {
      console.log(
        "DB:",
        u.phone,
        "| incoming:",
        from,
        "| equal:",
        u.phone === from
      );
    });
    console.log("===========================");

    console.log("Normalized Phone:", from);
    const normalizedTo = `whatsapp:+${from}`;
    const text = req.body.Body ? String(req.body.Body).trim() : "";

    // Webhook Geolocation payload
    const latitude = req.body.Latitude;
    const longitude = req.body.Longitude;

    console.log("📩 From:", normalizedTo);
    console.log("💬 Message/Payload:", text || `Location: ${latitude}, ${longitude}`);

    res.status(204).end(); // fast ACK to Twilio

    if (!from) {
      await send(normalizedTo, "❌ Unable to identify your WhatsApp number. Please try again.");
      return;
    }

    // const user = await User.findOne({
    //   phone: from,
    // });
    const user = users.find((u) => u.phone === from);

    console.log("FOUND:", user);

    console.log("User Found:", user);
    if (!user) {
      await send(normalizedTo, "❌ You are not registered. Please sign up on SkillBridge first.");
      return;
    }

    let session = await WhatsAppSession.findOne({ phone: normalizedTo });
    if (!session) {
      session = await WhatsAppSession.create({
        phone: normalizedTo,
        userId: user._id,
        role: user.role,
        stage: "idle",
      });
    }

    // Session expiration logic: 15 minutes of inactivity
    const SESSION_TIMEOUT = 15 * 60 * 1000;
    const now = Date.now();
    const sessionUpdatedAt = new Date(session.updatedAt).getTime();
    const lowerText = text.toLowerCase();

    if (session.stage !== "idle" && (now - sessionUpdatedAt > SESSION_TIMEOUT)) {
      session.stage = "idle";
      session.selectedSkill = "";
      session.lastWorkerResults = [];
      session.currentBookingId = null;
      await session.save();

      // If user texted "hi" or "hello", don't abort, just let the flow restart.
      // Otherwise, notify them and abort.
      if (lowerText !== "hi" && lowerText !== "hello") {
        await send(normalizedTo, "⏱️ Your session has expired due to inactivity. Reply 'Hi' to start a new search.");
        return;
      }
    }

    // ----- WORKER ONLINE/OFFLINE COMMANDS -----
    if (lowerText === "online" && user.role === "worker") {
      await Worker.findOneAndUpdate({ user: user._id }, { availability: true });
      await send(normalizedTo, "🟢 You are now ONLINE and visible to customers.");
      return;
    }

    if (lowerText === "offline" && user.role === "worker") {
      await Worker.findOneAndUpdate({ user: user._id }, { availability: false });
      await send(normalizedTo, "🔴 You are now OFFLINE.");
      return;
    }

    // ----- FLOW INITIALIZATION -----
    if (lowerText === "hi" || lowerText === "hello") {
      if (user.role === "customer") {
        session.stage = "WAITING_SERVICE";
        session.selectedSkill = "";
        session.lastWorkerResults = [];
        session.currentBookingId = null;
        await session.save();
        await send(normalizedTo, "What service do you need?\n\nPlumber\nElectrician\nCarpenter\nMechanic");
      } else {
        await send(normalizedTo, "Welcome back! Use your SkillBridge dashboard to manage bookings.");
      }
      return;
    }

    // ----- STAGE: WAITING_SERVICE -----
    if (session.stage === "WAITING_SERVICE") {
      const skill = lowerText;
      const allowedSkills = ["plumber", "electrician", "carpenter", "mechanic"];
      if (!allowedSkills.includes(skill)) {
        await send(normalizedTo, "Please choose one service from the list:\n\nPlumber\nElectrician\nCarpenter\nMechanic");
        return;
      }

      session.selectedSkill = skill;
      await session.save();

      const customer = await Customer.findOne({ phone: from });
      if (!customer || !customer.location || !Array.isArray(customer.location.coordinates) || customer.location.coordinates.length !== 2) {
        session.stage = "WAITING_LOCATION";
        await session.save();
        await send(normalizedTo, "Please share your current WhatsApp location 📍");
        return;
      }

      await searchAndSendWorkers(session, customer.location.coordinates, skill, normalizedTo);
      return;
    }

    // ----- STAGE: WAITING_LOCATION -----
    if (session.stage === "WAITING_LOCATION") {
      if (latitude && longitude) {
        const coords = [Number(longitude), Number(latitude)];

        await Customer.findOneAndUpdate(
          { phone: from },
          { location: { type: "Point", coordinates: coords } },
          { upsert: true }
        );

        if (user.role === "worker") {
          await Worker.findOneAndUpdate(
            { user: user._id },
            { location: { type: "Point", coordinates: coords } },
            { upsert: true }
          );
        }

        await searchAndSendWorkers(session, coords, session.selectedSkill, normalizedTo);
      } else {
        await send(normalizedTo, "❌ Please use the WhatsApp attachment menu to share your location 📍");
      }
      return;
    }

    // ----- STAGE: SHOWING_WORKERS -----
    if (session.stage === "SHOWING_WORKERS") {
      if (!session.lastWorkerResults || session.lastWorkerResults.length === 0) {
        session.stage = "idle";
        await session.save();
        await send(normalizedTo, "Your session expired. Reply 'Hi' to start a new search.");
        return;
      }

      const selection = parseInt(lowerText, 10);
      if (isNaN(selection) || selection < 1 || selection > session.lastWorkerResults.length) {
        await send(normalizedTo, `❌ Invalid selection. Please reply with a number between 1 and ${session.lastWorkerResults.length}.`);
        return;
      }

      const selectedWorkerData = session.lastWorkerResults.find(w => w.rank === selection);
      if (!selectedWorkerData) {
        await send(normalizedTo, "❌ That worker is no longer available. Reply 'Hi' to start again.");
        session.stage = "idle";
        await session.save();
        return;
      }

      const worker = await Worker.findById(selectedWorkerData.workerId).populate("user");
      if (!worker || !worker.availability) {
        await send(normalizedTo, "❌ Worker is no longer available. Reply 'Hi' to start again.");
        session.stage = "idle";
        await session.save();
        return;
      }

      // Create booking for tomorrow at 10:00 AM
      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 1);
      const dateStr = bookingDate.toISOString().split("T")[0];
      const customer = await Customer.findOne({ phone: from });
      const address = customer?.address || "Location shared via WhatsApp";

      const booking = await Booking.create({
        worker: worker._id,
        customer: user._id,
        profession: session.selectedSkill,
        date: dateStr,
        time: "10:00 AM",
        address,
        price: worker.hourlyRate || 0,
        status: "pending",
      });

      // Reset customer session stage to idle
      session.stage = "idle";
      session.currentBookingId = null;
      await session.save();

      // Find or create worker's WhatsApp session
      let workerSession = await WhatsAppSession.findOne({ userId: worker.user._id });
      if (!workerSession) {
        workerSession = await WhatsAppSession.create({
          phone: `whatsapp:+${worker.phone}`,
          userId: worker.user._id,
          role: "worker",
          stage: "idle",
        });
      }

      workerSession.stage = "WAITING_WORKER_RESPONSE";
      workerSession.currentBookingId = booking._id;
      await workerSession.save();

      // Notify worker
      await send(
        `whatsapp:+${worker.phone}`,
        `New job request\n\nCustomer: ${user.name}\nService: ${session.selectedSkill}\nLocation: ${address}\n\nReply:\n1 Accept\n2 Reject`
      );

      // Notify customer
      await send(normalizedTo, "⏳ Request sent to worker. Waiting for their response...");
      return;
    }

    // ----- STAGE: WAITING_WORKER_RESPONSE (WORKER) -----
    if (session.stage === "WAITING_WORKER_RESPONSE" && user.role === "worker") {
      const selection = parseInt(lowerText, 10);
      if (selection !== 1 && selection !== 2) {
        await send(normalizedTo, "❌ Invalid selection. Reply 1 to Accept or 2 to Reject.");
        return;
      }

      const booking = await Booking.findById(session.currentBookingId).populate("customer");
      if (!booking) {
        await send(normalizedTo, "❌ Booking not found or expired.");
        session.stage = "idle";
        session.currentBookingId = null;
        await session.save();
        return;
      }

      if (selection === 1) {
        booking.status = "accepted";
        await booking.save();
        await send(normalizedTo, "✅ You have accepted the booking.");
        await send(`whatsapp:+${booking.customer.phone}`, "✅ Your booking was accepted by the worker!");
      } else {
        booking.status = "rejected";
        await booking.save();
        await send(normalizedTo, "❌ You have rejected the booking.");
        await send(`whatsapp:+${booking.customer.phone}`, "❌ The worker rejected your booking. Please try booking another worker.");
      }

      // Reset worker session stage to idle
      session.stage = "idle";
      session.currentBookingId = null;
      await session.save();
      return;
    }

    // ----- STAGE: WAITING_REVIEW (CUSTOMER) -----
    if (session.stage === "WAITING_REVIEW") {
      const rating = parseInt(lowerText, 10);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        await send(normalizedTo, "❌ Invalid rating. Please reply with a number between 1 and 5.");
        return;
      }

      const booking = await Booking.findById(session.currentBookingId);
      if (!booking) {
        await send(normalizedTo, "❌ Booking not found.");
        session.stage = "idle";
        session.currentBookingId = null;
        await session.save();
        return;
      }

      const existingReview = await Review.findOne({ booking: booking._id });
      if (existingReview) {
        await send(normalizedTo, "❌ You have already reviewed this booking.");
      } else {
        await Review.create({
          booking: booking._id,
          worker: booking.worker,
          customer: user._id,
          rating,
          comment: "Rated via WhatsApp",
        });
        await send(normalizedTo, "✅ Thank you for your review!");
      }

      session.stage = "idle";
      session.currentBookingId = null;
      await session.save();
      return;
    }

    // ----- DEFAULT STATE HANDLING -----
    if (session.stage === "idle") {
      await send(normalizedTo, "I didn't understand that. Reply 'Hi' to start a new booking.");
      return;
    }

    await send(normalizedTo, "I didn't understand that action. Reply 'Hi' to continue.");
  } catch (err) {
    console.error("WhatsApp Handle Error:", err);
  }
};

// Helper for finding workers
async function searchAndSendWorkers(session, coords, skill, from) {
  console.log("Searching near:", coords);
  console.log("Skill:", skill);

  const workers = await Worker.find({
    profession: { $regex: new RegExp(`^${skill}$`, "i") },
    availability: true,
    isProfileComplete: true,
  })
    .populate("user")
    .sort({ averageRating: -1 })
    .limit(5);

  console.log("Workers:", workers);

  if (workers.length === 0) {
    await send(from, `❌ No ${skill}s found.`);
    session.stage = "idle";
    await session.save();
    return;
  }

  let reply = `Top ${skill}s near you:\n\n`;
  let results = [];

  workers.forEach((w, i) => {
    reply += `${i + 1})
${w.user.name}
⭐ ${w.averageRating || 0} (${w.totalReviews || 0} reviews)
₹${w.hourlyRate}/hr

View Profile:
${WHATSAPP_WEB_URL}/worker/${w._id}

`;

    results.push({
      workerId: w._id,
      rank: i + 1,
    });
  });

  reply += "Reply with the worker number to book.";

  session.stage = "SHOWING_WORKERS";
  session.lastWorkerResults = results;
  await session.save();

  await send(from, reply);
}
