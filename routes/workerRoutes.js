const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getPublicWorkerProfile } = require("../controllers/workerController");

router.get("/public/:workerId", getPublicWorkerProfile);

// 🔥 IMPORT ALL CONTROLLERS YOU USE
const {
  getMyWorkerProfile,
  updateWorkerProfile,
  searchWorkers,
} = require("../controllers/workerController");

// ================= WORKER SELF PROFILE =================
router.get("/me", protect, getMyWorkerProfile);
router.put("/me", protect, updateWorkerProfile);

// ================= SEARCH WORKERS (CUSTOMER) =================
router.post("/search", protect, searchWorkers);

module.exports = router;