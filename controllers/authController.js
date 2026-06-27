const User = require("../models/User");
const Worker = require("../models/Worker");
const Customer = require("../models/Customer");
const WhatsAppSession = require("../models/WhatsAppSession");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

console.log("========== TWILIO ==========");
console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN ? process.env.TWILIO_AUTH_TOKEN.substring(0, 8) : "NOT SET");
console.log("WHATSAPP:", process.env.TWILIO_WHATSAPP_NUMBER);
console.log("============================");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const JWT_SECRET = process.env.JWT_SECRET || "skillbridge-secret";

const normalizePhone = (phone) => {
  if (!phone) return "";

  let p = phone.replace(/\D/g, "");

  // If user enters 10-digit Indian number, add country code
  if (p.length === 10) {
    p = "91" + p;
  }

  return p;
};

const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        linkedWorkerId: user.linkedWorkerId,
      }
    },
  });
};

// ==================== SIGNUP ====================
exports.signup = catchAsync(async (req, res, next) => {
  const { name, phone, password, role, profession } = req.body;
  const normalizedPhone = normalizePhone(phone);
  console.log("Normalized Phone:", normalizedPhone);

  if (!name || !normalizedPhone || !password || !role) {
    return next(new AppError("Name, phone, password and role are required", 400));
  }

  if (!["customer", "worker"].includes(role)) {
    return next(new AppError("Invalid role selected", 400));
  }

  const existingUser = await User.findOne({ phone: normalizedPhone });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    phone: normalizedPhone,
    password: hashedPassword,
    role,
    linkedWorkerId: null,
  });

  if (role === "worker") {
    try {
      console.log("SIGNUP: Creating Worker document...");
      const workerData = {
        user: user._id,
        phone: normalizedPhone,
        profession: profession || "Other",
        hourlyRate: 0,
        isProfileComplete: false,
        location: {
          type: "Point",
          coordinates: [73.8567, 18.5204],
        },
      };
      const worker = await Worker.create(workerData);
      console.log("SIGNUP: Worker created:", worker._id);

      user.linkedWorkerId = worker._id;
      await user.save({ validateBeforeSave: false });
      console.log("SIGNUP: User linkedWorkerId saved");
    } catch (workerErr) {
      console.error("SIGNUP ERROR in worker block:", workerErr.name, workerErr.message, workerErr.code);
      throw workerErr;
    }
  }

  if (role === "customer") {
    await Customer.create({
      name,
      phone: normalizedPhone,
    });
  }

  await WhatsAppSession.findOneAndUpdate(
    { phone: `whatsapp:+${normalizedPhone}` },
    {
      stage: "idle",
      userId: user._id,
      role: role,
    },
    { upsert: true }
  );

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    let welcomeBody = "";

    if (role === "customer") {
      welcomeBody =
        `👋 Welcome to SkillBridge, ${name}!\n\n` +
        `Where skilled professionals meet people who need them. 🛠️\n\n` +
        `✅ You're registered as a *Customer*\n\n` +
        `Find and book trusted workers right from your dashboard:\n` +
        `${FRONTEND_URL}/customer/dashboard\n\n` +
        `Or reply *Hi* here anytime to search for workers via WhatsApp! 🔍`;
    } else if (role === "worker") {
      welcomeBody =
        `👋 Welcome to SkillBridge, ${name}!\n\n` +
        `Where your skills meet real opportunities. 💪\n\n` +
        `✅ You're registered as a *Worker*\n\n` +
        `Complete your profile to start getting booked:\n` +
        `${FRONTEND_URL}/worker/profile\n\n` +
        `Manage your jobs from your dashboard:\n` +
        `${FRONTEND_URL}/worker/dashboard\n\n` +
        `Reply *online* to go available, *offline* to pause. 🟢`;
    }

    if (welcomeBody) {
      console.log(`SIGNUP: Sending welcome message to ${normalizedPhone} (${role})`);
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER.startsWith("whatsapp:")
          ? process.env.TWILIO_WHATSAPP_NUMBER
          : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:+${normalizedPhone}`,
        body: welcomeBody,
      });
      console.log("SIGNUP: Welcome message sent successfully");
    }
  } catch (err) {
    console.warn("SIGNUP: WhatsApp welcome skipped:", err.code || err.message);
  }

  createSendToken(user, 201, res);
});


// ==================== LOGIN ====================
exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone || !password) {
    return next(new AppError("Please provide phone and password!", 400));
  }

  const user = await User.findOne({ phone: normalizedPhone }).select("+password");
  if (!user) {
    return next(new AppError("Incorrect phone or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Incorrect phone or password", 401));
  }

  if (user.role === "worker" && !user.linkedWorkerId) {
    const worker = await Worker.create({
      user: user._id,
      phone: user.phone,
      profession: "Other",
      hourlyRate: 0,
      isProfileComplete: false,
      location: {
        type: "Point",
        coordinates: [73.8567, 18.5204],
      },
    });

    user.linkedWorkerId = worker._id;
    await user.save({ validateBeforeSave: false });
  }

  createSendToken(user, 200, res);
});

exports.verify = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Unable to verify user", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        phone: req.user.phone,
        role: req.user.role,
        linkedWorkerId: req.user.linkedWorkerId,
      },
    },
  });
});

// ==================== UPDATE PROFILE ====================
exports.updateProfile = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Not authenticated", 401));
  }

  const { name, phone, email, address, city, pincode, profession, experience, hourlyRate, bio, skills } = req.body;

  // Update User document
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name: name || req.user.name },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  // Update Worker or Customer profile based on role
  if (req.user.role === 'worker') {
    await Worker.findByIdAndUpdate(
      req.user.linkedWorkerId,
      {
        profession: profession || undefined,
        experience: experience || undefined,
        hourlyRate: hourlyRate || undefined,
        bio: bio || undefined,
        skills: skills || undefined,
      },
      { new: true, runValidators: true }
    );
  } else if (req.user.role === 'customer') {
    await Customer.findOneAndUpdate(
      { phone: req.user.phone },
      {
        email: email || undefined,
        address: address || undefined,
        city: city || undefined,
        pincode: pincode || undefined,
      },
      { new: true, runValidators: true }
    );
  }

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: {
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        linkedWorkerId: updatedUser.linkedWorkerId,
      },
    },
  });
});
