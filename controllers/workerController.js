const Worker = require("../models/Worker");
const User = require("../models/User");
const Review = require("../models/Review"); // ⭐ NEW
const Booking = require("../models/Booking");

// ===============================
// PUBLIC WORKER PROFILE
// ===============================
exports.getPublicWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId)
      .select("profession experience hourlyRate location availability")
      .populate("user", "name");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // ⭐ Fetch ratings
    const reviews = await Review.find({ worker: worker._id });

    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) /
            reviews.length
          ).toFixed(1)
        : null;

    res.status(200).json({
      worker,
      rating: {
        avgRating,
        totalReviews: reviews.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load worker profile" });
  }
};

// ===============================
// GET LOGGED-IN WORKER PROFILE
// ===============================
exports.getMyWorkerProfile = async (req, res) => {
  try {
    let worker = await Worker.findOne({ user: req.user._id });

    if (!worker) {
      worker = await Worker.create({
        user: req.user._id,
        phone: req.user.phone,
        profession: "Other",
        hourlyRate: 0,
        experience: 0,
        isProfileComplete: false,
      });

      req.user.linkedWorkerId = worker._id;
      await req.user.save();
    }

    const pendingBookings = await Booking.find({
      worker: worker._id,
      status: "pending",
    })
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });

    const actionableFields = pendingBookings.map((booking) => ({
      _id: booking._id,
      customer: booking.customer,
      date: booking.date,
      time: booking.time,
      address: booking.address,
      description: booking.description,
      status: booking.status,
      actions: {
        accept: `/api/bookings/${booking._id}/accept`,
        reject: `/api/bookings/${booking._id}/reject`,
        complete: `/api/bookings/${booking._id}/complete`,
      },
    }));

    res.status(200).json({
      success: true,
      worker,
      pendingBookings: actionableFields,
    });
  } catch (err) {
    console.error("Get worker profile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ===============================
// UPDATE WORKER PROFILE
// ===============================
exports.updateWorkerProfile = async (req, res) => {
  try {
    const {
      profession,
      experience,
      hourlyRate,
      city,
      area,
      lat,
      lng,
      availability,
    } = req.body;

    if (!profession || !hourlyRate) {
      return res.status(400).json({
        message: "Profession and hourly rate are required",
      });
    }

    let worker = await Worker.findOne({ user: req.user._id });

    if (!worker) {
      worker = new Worker({
        user: req.user._id,
        phone: req.user.phone,
      });
    }

    worker.profession = profession;
    worker.experience = experience;
    worker.hourlyRate = hourlyRate;
    const coordinates =
      typeof lat === "number" && typeof lng === "number"
        ? [lng, lat]
        : [73.8567, 18.5204]; // Pune default

    worker.location = {
      type: "Point",
      coordinates,
      city,
      area,
    };
    worker.availability = availability;
    worker.isProfileComplete = true;

    await worker.save();

    res.status(200).json({
      success: true,
      message: "Worker profile updated successfully",
      worker,
    });
  } catch (err) {
    console.error("Update worker profile error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Profile update failed",
    });
  }
};

// ===============================
// SEARCH WORKERS + ⭐ RATINGS
// ===============================
exports.searchWorkers = async (req, res) => {
  try {
    const searchParams = req.method === "GET" ? req.query : req.body;
    const { profession, city, maxPrice, minRating, page = 1, limit = 10 } = searchParams;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const priceLimit = maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;
    const ratingLimit = minRating ? Number(minRating) : 0;

    const query = {
      availability: true,
      isProfileComplete: true,
      hourlyRate: { $lte: priceLimit },
    };

    if (profession) {
      query.profession = { $regex: new RegExp(profession, "i") };
    }
    if (city) {
      query["location.city"] = { $regex: new RegExp(city, "i") };
    }

    // 1. Fetch filtered paginated workers
    const workers = await Worker.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const workerIds = workers.map((w) => w._id);

    // 2. Fetch Aggregated Ratings
    const ratings = await Review.aggregate([
      { $match: { worker: { $in: workerIds } } },
      {
        $group: {
          _id: "$worker",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const ratingMap = {};
    ratings.forEach((r) => {
      ratingMap[r._id.toString()] = {
        avgRating: r.avgRating.toFixed(1),
        totalReviews: r.totalReviews,
      };
    });

    // 3. Attach Ratings & Post-Filter by Rating Check
    let finalWorkers = workers.map((w) => ({
      ...w,
      rating: ratingMap[w._id.toString()] || {
        avgRating: null,
        totalReviews: 0,
      },
    }));

    if (ratingLimit > 0) {
      finalWorkers = finalWorkers.filter(w => Number(w.rating.avgRating) >= ratingLimit);
    }

    const totalDocs = await Worker.countDocuments(query);

    res.status(200).json({
      success: true,
      count: finalWorkers.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalDocs / limitNum),
        totalDocuments: totalDocs
      },
      workers: finalWorkers,
    });
  } catch (err) {
    console.error("Search workers error:", err);
    res.status(500).json({
      success: false,
      message: "Worker search failed",
    });
  }
};