const Booking = require("../models/Booking");
const Worker = require("../models/Worker");
const User = require("../models/User");
const sendWhatsApp = require("../utils/sendWhatsApp");

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
      .populate("worker", "profession hourlyRate location experience")
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

    const allowedStatuses = ["accepted", "rejected", "completed"];
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

    // verify booking time has already passed before marking completed
    if (status === "completed") {
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
      if (!bookingDateTime || isNaN(bookingDateTime.getTime())) {
        return res.status(400).json({ message: "Invalid booking date/time format" });
      }
      const now = new Date();
      if (now < bookingDateTime) {
        return res.status(400).json({ message: "Cannot complete booking before scheduled time" });
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
    let message = "";

    if (status === "accepted") {
      message = `✅ *Booking Accepted*

👷 ${booking.worker.profession}
📅 ${booking.date} | ${booking.time}

The worker will arrive as scheduled.`;
    }

    if (status === "rejected") {
      message = `❌ *Booking Rejected*

👷 ${booking.worker.profession}
📅 ${booking.date} | ${booking.time}

Please try another worker.`;
    }

    if (status === "completed") {
      message = `🎉 *Job Completed*

👷 ${booking.worker.profession}
📅 ${booking.date}

Please open SkillBridge and rate the worker ⭐`;
    }

    if (message) {
      await sendWhatsApp(booking.customer.phone, message);
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