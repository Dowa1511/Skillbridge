const Booking = require("../models/Booking");
const Worker = require("../models/Worker");
const User = require("../models/User");
const sendWhatsApp = require("../utils/sendWhatsApp");
const WhatsAppSession = require("../models/WhatsAppSession");
const bcrypt = require("bcryptjs");

// ===============================
// CREATE BOOKING (CUSTOMER)
// ===============================
exports.createBooking = async (req, res) => {
  try {
    const { workerId, date, time, address, description } = req.body;

    if (!workerId || !date || !time || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate date format and ensure it's not past or today
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate <= today) {
      return res.status(400).json({ message: "Cannot book for today or past dates" });
    }

    // Validate time format (24-hour or 12-hour AM/PM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])(?:\s*(?:AM|PM|am|pm))?$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ message: "Invalid time format. Use HH:MM or HH:MM AM/PM" });
    }

    const worker = await Worker.findById(workerId).populate("user");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (worker.user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot book yourself" });
    }

    const durationHrs = req.body.duration || 1;
    const price = worker.hourlyRate ? worker.hourlyRate * durationHrs : 0;

    const booking = await Booking.create({
      worker: worker._id,
      customer: req.user._id,
      profession: worker.profession || "Other",
      date,
      time,
      address,
      description,
      price,
      paymentStatus: "pending",
      status: "pending",
    });

    // 🔔 WhatsApp → Worker
    await sendWhatsApp(
      worker.phone,
      `📢 *New Job Request*

👤 Customer: ${req.user.name || "Customer"}
📅 Date: ${date}
⏰ Time: ${time}
📍 Address: ${address}

Worker action required:
- Accept: PUT /api/bookings/${booking._id}/accept
- Reject: PUT /api/bookings/${booking._id}/reject`
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};

// ===============================
// GET BOOKINGS FOR LOGGED-IN WORKER
// ===============================
exports.getWorkerBookings = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const { status } = req.query;
    const query = { worker: worker._id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });

    // for convenience, a dedicated pending endpoint can point here
    // if not specified status in query, it returns all bookings for worker

    res.status(200).json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ===============================
// GET PENDING BOOKINGS FOR WORKER
// ===============================
exports.getWorkerPendingBookings = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const bookings = await Booking.find({ worker: worker._id, status: "pending" })
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending bookings" });
  }
};

// ===============================
// GET BOOKINGS FOR LOGGED-IN CUSTOMER
// ===============================
exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate({
        path: "worker",
        populate: { path: "user", select: "name" },
        select: "profession hourlyRate location experience _id user",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ===============================
// UPDATE BOOKING STATUS (WORKER)
// ===============================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (status === "completed") {
      return res.status(400).json({ message: "Completion is only possible through OTP verification." });
    }

    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId)
      .populate("customer")
      .populate("worker");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if ((status === "accepted" || status === "rejected") && booking.status !== "pending") {
      return res.status(400).json({ message: "Booking already responded" });
    }

    if (status === "completed" && booking.status !== "accepted") {
      return res.status(400).json({ message: "Only accepted bookings can be completed" });
    }

    // verify booking time has already passed before marking completed (only for customers)
    if (status === "completed" && req.user.role === "customer") {
      const parseBookingDateTime = (date, time) => {
        const [year, month, day] = date.split("-").map(Number);
        if (!year || !month || !day) return null;

        let timeString = time.trim().toLowerCase();
        const ampmMatch = timeString.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
        let hours, minutes;

        if (ampmMatch) {
          hours = Number(ampmMatch[1]);
          minutes = Number(ampmMatch[2]);
          const suffix = ampmMatch[3];
          if (suffix === "pm" && hours !== 12) hours += 12;
          if (suffix === "am" && hours === 12) hours = 0;
        } else {
          const hms = timeString.match(/^(\d{1,2}):(\d{2})$/);
          if (!hms) return null;
          hours = Number(hms[1]);
          minutes = Number(hms[2]);
        }
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
        return new Date(year, month - 1, day, hours, minutes, 0, 0);
      };

      const bookingDateTime = parseBookingDateTime(booking.date, booking.time);
      if (bookingDateTime && !isNaN(bookingDateTime.getTime())) {
        const now = new Date();
        if (now < bookingDateTime) {
          return res.status(400).json({ message: "Cannot complete booking before scheduled time" });
        }
      }
    }

    // 🔐 SECURITY: authorization checks
    if (status === "accepted" || status === "rejected") {
      const worker = await Worker.findOne({ user: req.user._id });
      if (!worker || booking.worker._id.toString() !== worker._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
    } else if (status === "completed") {
      let isAuthorized = false;

      if (booking.customer._id.toString() === req.user._id.toString()) {
        isAuthorized = true;
      }

      if (!isAuthorized && req.user.role === "worker") {
        const worker = await Worker.findOne({ user: req.user._id });
        if (worker && booking.worker._id.toString() === worker._id.toString()) {
          isAuthorized = true;
        }
      }

      if (!isAuthorized) {
        return res.status(403).json({ message: "Not authorized to complete this booking" });
      }
    }

    booking.status = status;
    await booking.save();

    // ===============================
    // WHATSAPP NOTIFICATIONS
    // ===============================
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    if (status === "accepted") {
      await sendWhatsApp(
        booking.customer.phone,
        `✅ *Booking Accepted!*\n\n` +
        `👷 *${booking.worker.profession}*\n` +
        `📅 Date: ${booking.date}\n` +
        `⏰ Time: ${booking.time}\n\n` +
        `Your worker will arrive as scheduled. You can track your booking here:\n` +
        `${FRONTEND_URL}/customer/dashboard`
      );
    }

    if (status === "rejected") {
      await sendWhatsApp(
        booking.customer.phone,
        `❌ *Booking Rejected*\n\n` +
        `👷 ${booking.worker.profession}\n` +
        `📅 ${booking.date} | ${booking.time}\n\n` +
        `The worker is unavailable. Please try booking another worker:\n` +
        `${FRONTEND_URL}/customer/dashboard`
      );
    }

    if (status === "completed") {
      const workerProfileUrl = `${FRONTEND_URL}/workers/${booking.worker._id}`;
      const dashboardUrl = `${FRONTEND_URL}/customer/dashboard`;

      // Update customer's WhatsApp session to WAITING_REVIEW
      await WhatsAppSession.findOneAndUpdate(
        { userId: booking.customer._id },
        {
          stage: "WAITING_REVIEW",
          currentBookingId: booking._id
        },
        { upsert: true }
      );

      // 📲 Notify customer with review link
      await sendWhatsApp(
        booking.customer.phone,
        `🎉 *Job Completed!*\n\n` +
        `Your ${booking.worker.profession} has completed the job on ${booking.date}.\n\n` +
        `⭐ *Please leave a review!*\n\n` +
        `🔗 View worker profile & review on website:\n${workerProfileUrl}\n\n` +
        `Or reply with a rating *1–5* right here on WhatsApp!\n\n` +
        `1 ⭐ | 2 ⭐⭐ | 3 ⭐⭐⭐ | 4 ⭐⭐⭐⭐ | 5 ⭐⭐⭐⭐⭐`
      );

      // 📲 Also notify the worker
      await sendWhatsApp(
        booking.worker.phone,
        `✅ *Job Marked as Completed!*\n\n` +
        `📅 Date: ${booking.date}\n` +
        `👤 Customer: ${booking.customer.name}\n\n` +
        `The customer has been notified and asked to leave a review. 🌟\n\n` +
        `View your dashboard:\n${FRONTEND_URL}/worker/dashboard`
      );
    }

    res.status(200).json({
      success: true,
      message: `Booking marked as ${status}`,
      booking,
    });
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
};

// ===============================
// CANCEL BOOKING (CUSTOMER)
// ===============================
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("worker");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Notify worker via WhatsApp
    await sendWhatsApp(
      booking.worker.phone,
      `❌ *Booking Cancelled*

👤 Customer: ${req.user.name || "Customer"}
📅 Date: ${booking.date}
⏰ Time: ${booking.time}

The booking has been cancelled by the customer.`
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

// ===============================
// GENERATE OTP (WORKER)
// ===============================
exports.generateOTP = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const booking = await Booking.findById(bookingId)
      .populate("customer")
      .populate("worker");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify worker ownership
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker || booking.worker._id.toString() !== worker._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this booking" });
    }

    // Validation: OTP must be active only if under 24 hours
    const now = new Date();
    if (booking.status === "waiting_for_otp") {
      const otpAgeMs = now - new Date(booking.otpGeneratedAt);
      if (otpAgeMs < 24 * 60 * 60 * 1000) {
        return res.status(400).json({ message: "Worker cannot generate another OTP if one is already active" });
      }
    }

    // Booking must be accepted to generate OTP (or waiting_for_otp if expired)
    if (booking.status !== "accepted" && booking.status !== "waiting_for_otp") {
      return res.status(400).json({ message: "Booking must be accepted to generate OTP" });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP using bcrypt
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save fields
    booking.completionOTP = hashedOTP;
    booking.otpGeneratedAt = now;
    booking.status = "waiting_for_otp";
    await booking.save();

    // 📲 Send OTP to customer via WhatsApp
    const message = `🔐 *SkillBridge*\n\nYour service completion OTP is:\n*${otp}*\n\nShare this OTP ONLY after your work has been completed.\nNever share it before the service is finished.`;
    await sendWhatsApp(booking.customer.phone, message);

    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      booking: {
        _id: booking._id,
        status: booking.status,
        otpGeneratedAt: booking.otpGeneratedAt,
      },
    });
  } catch (err) {
    console.error("Generate OTP error:", err);
    res.status(500).json({ message: "Failed to generate OTP" });
  }
};

// ===============================
// VERIFY OTP (WORKER)
// ===============================
exports.verifyOTP = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;

    if (!bookingId || !otp) {
      return res.status(400).json({ message: "Booking ID and OTP are required" });
    }

    // Validate OTP is exactly 6 digits
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return res.status(400).json({ message: "OTP must be exactly 6 digits" });
    }

    const booking = await Booking.findById(bookingId)
      .populate("customer")
      .populate("worker");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify worker ownership
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker || booking.worker._id.toString() !== worker._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this booking" });
    }

    // Status check
    if (booking.status !== "waiting_for_otp") {
      return res.status(400).json({ message: "Booking is not waiting for OTP verification" });
    }

    // Check OTP expiration (24 hours)
    const now = new Date();
    const otpAgeMs = now - new Date(booking.otpGeneratedAt);
    if (otpAgeMs > 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Compare the OTP
    const isMatch = await bcrypt.compare(otp, booking.completionOTP);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Save success fields
    booking.status = "completed";
    booking.otpVerified = true;
    booking.completionOTP = null; // Delete hashed OTP
    booking.completedAt = now;
    await booking.save();

    // Update customer WhatsAppSession stage to WAITING_REVIEW and currentBookingId
    let customerPhone = String(booking.customer.phone || "").trim();
    const normalizedCustomerPhone = customerPhone.startsWith("whatsapp:")
      ? customerPhone
      : `whatsapp:+${customerPhone.replace(/\D/g, "")}`;

    await WhatsAppSession.findOneAndUpdate(
      { userId: booking.customer._id },
      {
        phone: normalizedCustomerPhone,
        stage: "WAITING_REVIEW",
        currentBookingId: booking._id,
      },
      { upsert: true }
    );

    // Send customer WhatsApp review prompt
    const customerMsg = `✅ Booking completed successfully.

Please rate your worker.

1⭐
2⭐
3⭐
4⭐
5⭐`;
    await sendWhatsApp(booking.customer.phone, customerMsg);

    // Send worker WhatsApp completion notification
    const workerMsg = `Customer has verified completion.

Booking marked as completed.`;
    await sendWhatsApp(booking.worker.phone, workerMsg);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. Booking marked as completed.",
      booking: {
        _id: booking._id,
        status: booking.status,
        otpVerified: booking.otpVerified,
        completedAt: booking.completedAt,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};