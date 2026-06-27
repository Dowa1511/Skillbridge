const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Worker = require("../models/Worker");
const WhatsAppSession = require("../models/WhatsAppSession");

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/skillbridge")
  .then(() => console.log("MongoDB connected for seeding dummy workers"))
  .catch((err) => console.error(err));

const occupations = ["Plumber", "Electrician", "Carpenter", "Mechanic"];
const names = [
  "Ramesh Kumar", "Suresh Sharma", "Amit Patel", "Rajesh Verma",
  "Vijay Singh", "Dinesh Yadav", "Sanjay Gupta", "Anil Mishra",
  "Sunil Joshi", "Pankaj Tiwari", "Manoj Prasad", "Vikram Rathore",
  "Ashok Gehlot", "Harish Rawat", "Satish Poonia", "Rajendra Choudhary",
  "Mahendra Dhoni", "Sachin Tendulkar", "Virat Kohli", "Rohit Sharma"
];

async function seed() {
  try {
    const dummyPhonePrefix = "9188888";
    
    // Find dummy users
    const dummyUsers = await User.find({ phone: { $regex: `^${dummyPhonePrefix}` } });
    const dummyUserIds = dummyUsers.map(u => u._id);
    
    // Delete corresponding workers, sessions, and users
    await Worker.deleteMany({ user: { $in: dummyUserIds } });
    await WhatsAppSession.deleteMany({ 
      $or: [
        { userId: { $in: dummyUserIds } },
        { phone: { $regex: `^whatsapp:\\+${dummyPhonePrefix}` } }
      ]
    });
    await User.deleteMany({ _id: { $in: dummyUserIds } });
    
    console.log("Cleaned up existing dummy workers/users.");

    const hashedPassword = await bcrypt.hash("Test@1234", 10);
    const createdWorkers = [];

    for (let i = 0; i < 20; i++) {
      const name = names[i];
      const phone = `${dummyPhonePrefix}${String(i).padStart(5, "0")}`;
      const profession = occupations[i % occupations.length];
      
      // Create user
      const user = await User.create({
        name,
        phone,
        password: hashedPassword,
        role: "worker",
      });

      // Create worker
      // Slightly randomize coordinates around Pune: [73.8567, 18.5204]
      const deltaLng = (Math.random() - 0.5) * 0.05;
      const deltaLat = (Math.random() - 0.5) * 0.05;
      const lng = 73.8567 + deltaLng;
      const lat = 18.5204 + deltaLat;

      const worker = await Worker.create({
        user: user._id,
        phone,
        profession,
        experience: Math.floor(Math.random() * 10) + 1,
        hourlyRate: (Math.floor(Math.random() * 5) + 3) * 100, // 300 to 700
        location: {
          type: "Point",
          coordinates: [lng, lat],
          city: "Pune",
          area: "Area " + (i + 1),
        },
        availability: true,
        averageRating: parseFloat((4 + Math.random()).toFixed(1)),
        totalReviews: Math.floor(Math.random() * 20) + 5,
        isVerified: true,
        isProfileComplete: true,
      });

      // Link worker to user
      user.linkedWorkerId = worker._id;
      await user.save();

      // Create whatsapp session
      await WhatsAppSession.create({
        phone: `whatsapp:+${phone}`,
        userId: user._id,
        role: "worker",
        stage: "idle",
      });

      createdWorkers.push(name + ` (${profession})`);
    }

    console.log(`Successfully created ${createdWorkers.length} dummy workers.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
