const Worker = require("../models/Worker");
const WhatsAppSession = require("../models/WhatsAppSession");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


exports.verifyWebhook = (req, res) => {
  res.sendStatus(200);
};


exports.handleIncomingMessage = async (req, res) => {
  try {
    const from = req.body.From; // whatsapp:+91xxxx
    const text = req.body.Body?.toLowerCase();

    console.log("📩 From:", from);
    console.log("💬 Message:", text);

    res.sendStatus(200); // fast ACK to Twilio

    // ---- WORKER ONLINE ----
    if (text === "online") {
      const worker = await Worker.findOneAndUpdate(
        { phone: from.replace("whatsapp:+", "") },
        { availability: "online" },
        { new: true }
      );

      if (worker) {
        await send(from, "🟢 You are now ONLINE and visible to customers.");
      } else {
        await send(from, "❌ Worker profile not found.");
      }
      return;
    }

    // ---- WORKER OFFLINE ----
    if (text === "offline") {
      await Worker.findOneAndUpdate(
        { phone: from.replace("whatsapp:+", "") },
        { availability: "offline" }
      );

      await send(from, "🔴 You are now OFFLINE.");
      return;
    }

    // ---- CUSTOMER HI ----
    if (text === "hi") {
      await send(
        from,
        "👋 Welcome to SkillBridge\n\nType a service:\nplumber, electrician, carpenter"
      );
      return;
    }

    // ---- SKILL SEARCH ----
    const workers = await Worker.find({
      skill: text,
      availability: "online",
      isVerified: true,
    }).limit(3);

    if (workers.length === 0) {
      await send(from, `❌ No online ${text}s found nearby.`);
      return;
    }

    let reply = `🛠 Available ${text}s:\n\n`;
    workers.forEach((w, i) => {
      reply += `${i + 1}. ${w.name} ⭐${w.rating}\n`;
    });

    reply += `\nReply: book 1`;

    await send(from, reply);

    await WhatsAppSession.findOneAndUpdate(
      { phone: from },
      {
        stage: "showing_workers",
        selectedSkill: text,
        lastWorkerList: workers.map(w => w._id),
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("WhatsApp Error:", err);
  }
};

// ---------------- SEND MESSAGE ----------------
const send = async (to, body) => {
  await client.messages.create({
    from: "whatsapp:+14155238886",
    to,
    body,
  });
};
