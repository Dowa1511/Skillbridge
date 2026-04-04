const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middleware/errorMiddleware");

const app = express();

// ================= GLOBAL MIDDLEWARE =================
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Implement CORS
app.use(cors());

// ================= DATABASE =================
connectDB();

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const workerRoutes = require("./routes/workerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const whatsappWebhook = require("./routes/whatsappWebhook");

// 🔐 Auth
app.use("/api/auth", authRoutes);

// 👷 Worker
app.use("/api/worker", workerRoutes);

// 📦 Bookings
app.use("/api/bookings", bookingRoutes);

// ⭐ Reviews
app.use("/api/reviews", reviewRoutes);

// 💬 WhatsApp webhook
app.use("/api/webhooks/whatsapp", whatsappWebhook);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("SkillBridge Backend Running 🚀");
});

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});