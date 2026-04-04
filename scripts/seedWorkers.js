const mongoose = require("mongoose");
require("dotenv").config();

const Worker = require("../models/Worker");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error(err));

const workers = [
  {
    name: "Ramesh",
    skill: "plumber",
    phone: "919000000001",
    area: "Shivaji Nagar",
    available: true,
    location: {
      type: "Point",
      coordinates: [73.8567, 18.5204], // Pune (lng, lat)
    },
  },
  {
    name: "Suresh",
    skill: "plumber",
    phone: "919000000002",
    area: "Kothrud",
    available: true,
    location: {
      type: "Point",
      coordinates: [73.8077, 18.5074],
    },
  },
  {
    name: "Amit",
    skill: "electrician",
    phone: "919000000003",
    area: "Baner",
    available: true,
    location: {
      type: "Point",
      coordinates: [73.7769, 18.5590],
    },
  },
];

async function seed() {
  try {
    await Worker.deleteMany();
    await Worker.insertMany(workers);
    console.log("✅ Workers seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
