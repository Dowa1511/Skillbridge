const User = require("../models/User");
const Worker = require("../models/Worker");
const WhatsAppSession = require("../models/WhatsAppSession");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
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
  const { name, phone, password, role } = req.body;

  if (!name || !phone || !password || !role) {
    return next(new AppError("Name, phone, password and role are required", 400));
  }

  if (!["customer", "worker"].includes(role)) {
    return next(new AppError("Invalid role selected", 400));
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    phone,
    password: hashedPassword,
    role,                 
    linkedWorkerId: null,
  });

  if (role === "worker") {
    const worker = await Worker.create({
      user: user._id,
      phone,
      profession: "Other",
      hourlyRate: 0,
      isProfileComplete: false,
    });

    user.linkedWorkerId = worker._id;
    await user.save();
  }

  await WhatsAppSession.findOneAndUpdate(
    { phone: `whatsapp:+${phone}` },
    { stage: "idle" },
    { upsert: true }
  );

  try {
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:+${phone}`,
      body: "👋 Welcome to *SkillBridge*!\n\nReply *HI* to find nearby workers.\nExample: plumber, electrician",
    });
  } catch (err) {
    console.warn("WhatsApp skipped:", err.code || err.message);
  }

  createSendToken(user, 201, res);
});


// ==================== LOGIN ====================
exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return next(new AppError("Please provide phone and password!", 400));
  }

  const user = await User.findOne({ phone }).select("+password");
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
    });

    user.linkedWorkerId = worker._id;
    await user.save({ validateBeforeSave: false });
  }

  createSendToken(user, 200, res);
});
