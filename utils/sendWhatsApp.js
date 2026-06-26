const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = async (phone, message) => {
  try {
    let to = String(phone || "").trim();

    // normalize phone
    if (!to.startsWith("whatsapp:")) {
      to = "whatsapp:+" + to.replace(/\D/g, "");
    }

    console.log("📤 Sending WhatsApp");
    console.log("FROM:", "whatsapp:" + process.env.TWILIO_WHATSAPP_NUMBER);
    console.log("TO:", to);

    const result = await client.messages.create({
      from: "whatsapp:" + process.env.TWILIO_WHATSAPP_NUMBER,
      to,
      body: message,
    });

    console.log("SID:", result.sid);
    console.log("STATUS:", result.status);

    return result;
  } catch (err) {
    console.log("❌ WhatsApp Error");
    console.log(err);
  }
};

module.exports = sendWhatsApp;