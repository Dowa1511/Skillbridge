const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Worker = require("../models/Worker");
const WhatsAppSession = require("../models/WhatsAppSession");

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/skillbridge")
  .then(() => console.log("MongoDB connected for seeding Ravet/Akurdi dummy workers"))
  .catch((err) => console.error(err));

const occupations = ["Plumber", "Electrician", "Carpenter", "Mechanic"];
const names = [
  "Rahul Patil", "Sandip More", "Vijay Shinde", "Aniket Deshmukh",
  "Ganesh Pawar", "Santosh Kadam", "Amol Sawant", "Sachin Jagtap",
  "Nitin Gawade", "Prasad Bhosale", "Tushar Naik", "Abhijit Salunkhe",
  "Swapnil Mane", "Kiran Thorat", "Akshay Tambe", "Chetan Ghadge",
  "Mayur Shelar", "Prathamesh Kale", "Siddharth Kamble", "Ajinkya Yadav"
];

const areas = [
  "Ravet Sector 29", "Ravet Sector 110", "PCCOER Campus Area", "Akurdi Station Rd",
  "Ravet Corner", "Pradhikaran Akurdi", "Ravet Shinde Vasti", "Akurdi Chowk",
  "D-Mart Ravet", "Ravet Bhalekar Vasti", "Ravet Mukai Chowk", "Akurdi Gurudwara",
  "Ravet Adarsh Nagar", "Ravet Shinde Corner", "Ravet Sector 32", "Akurdi Ganga Nagar",
  "Ravet Mamurdi Road", "PCET Ravet Campus", "Akurdi Sambhaji Chowk", "Ravet Police Chowki"
];

async function seed() {
  try {
    const dummyPhonePrefix = "9177777";
    
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
    
    console.log("Cleaned up existing Ravet/Akurdi dummy workers/users.");

    const hashedPassword = await bcrypt.hash("Test@1234", 10);
    const createdWorkers = [];

    // PCCOER Center: Lat 18.647, Lng 73.738
    const baseLat = 18.647;
    const baseLng = 73.738;

    for (let i = 0; i < 20; i++) {
      const name = names[i];
      const phone = `${dummyPhonePrefix}${String(i).padStart(5, "0")}`;
      const profession = occupations[i % occupations.length];
      const area = areas[i % areas.length];
      
      // Create user
      const user = await User.create({
        name,
        phone,
        password: hashedPassword,
        role: "worker",
      });

      // Slightly randomize coordinates around PCCOER: [73.738, 18.647]
      // 0.01 degree is approx 1.1 km
      const deltaLng = (Math.random() - 0.5) * 0.03; // within ~1.5 km
      const deltaLat = (Math.random() - 0.5) * 0.03; // within ~1.5 km
      const lng = baseLng + deltaLng;
      const lat = baseLat + deltaLat;

      const worker = await Worker.create({
        user: user._id,
        phone,
        profession,
        experience: Math.floor(Math.random() * 8) + 2,
        hourlyRate: (Math.floor(Math.random() * 4) + 3) * 100, // 300 to 600
        location: {
          type: "Point",
          coordinates: [lng, lat],
          city: "Pimpri Chinchwad",
          area: area,
        },
        availability: true,
        averageRating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
        totalReviews: Math.floor(Math.random() * 15) + 3,
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

      createdWorkers.push(`${name} (${profession}) at ${area}`);
    }

    console.log(`Successfully created ${createdWorkers.length} dummy workers near Ravet/Akurdi (PCCOER).`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
