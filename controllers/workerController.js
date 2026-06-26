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
      .select("profession experience hourlyRate location availability averageRating totalReviews")
      .populate("user", "name");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({
      worker,
      rating: {
        avgRating: worker.averageRating > 0 ? worker.averageRating.toFixed(1) : null,
        totalReviews: worker.totalReviews || 0,
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
        location: {
          type: "Point",
          coordinates: [73.8567, 18.5204],
        },
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

    const activeBookings = await Booking.countDocuments({ worker: worker._id, status: { $in: ["accepted", "pending"] } });
    const completedBookings = await Booking.countDocuments({ worker: worker._id, status: "completed" });
    const canceledBookings = await Booking.countDocuments({ worker: worker._id, status: "cancelled" });

    const totalEarningsResult = await Booking.aggregate([
      { $match: { worker: worker._id, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].total || 0 : 0;

    res.status(200).json({
      success: true,
      worker,
      pendingBookings: actionableFields,
      dashboardStats: {
        activeBookings,
        completedBookings,
        canceledBookings,
        totalEarnings,
      }
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
    const { profession, city, maxPrice, minRating, page = 1, limit = 10, sort } = searchParams;

    const cacheKey = JSON.stringify(searchParams);
    if (!global.searchCache) global.searchCache = new Map();
    if (global.searchCache.has(cacheKey)) {
      return res.status(200).json(global.searchCache.get(cacheKey));
    }

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
    if (ratingLimit > 0) {
      query.averageRating = { $gte: ratingLimit };
    }

    let sortOption = { averageRating: -1, totalReviews: -1 }; // Default robust sorting
    if (sort === "priceAsc") sortOption = { hourlyRate: 1 };
    else if (sort === "priceDesc") sortOption = { hourlyRate: -1 };
    else if (sort === "ratingDesc") sortOption = { averageRating: -1, totalReviews: -1 };

    // 1. Fetch filtered paginated workers (no aggregate needed!)
    const workers = await Worker.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort(sortOption)
      .lean();

    // 2. Attach Ratings
    let finalWorkers = workers.map((w) => ({
      ...w,
      rating: {
        avgRating: w.averageRating > 0 ? w.averageRating.toFixed(1) : null,
        totalReviews: w.totalReviews || 0,
      },
    }));

    const totalDocs = await Worker.countDocuments(query);

    const responsePayload = {
      success: true,
      count: finalWorkers.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalDocs / limitNum),
        totalDocuments: totalDocs
      },
      workers: finalWorkers,
    };

    global.searchCache.set(cacheKey, responsePayload);
    setTimeout(() => { if(global.searchCache) global.searchCache.delete(cacheKey); }, 30000); // 30s manual cache

    res.status(200).json(responsePayload);
  } catch (err) {
    console.error("Search workers error:", err);
    res.status(500).json({
      success: false,
      message: "Worker search failed",
    });
  }
};