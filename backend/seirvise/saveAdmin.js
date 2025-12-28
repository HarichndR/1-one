require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../scheema/user"); // Adjust the path based on your project structure
const { createHmac, randomBytes } = require("crypto");

// Replace with your MongoDB connection string
const MONGO_URI = process.env.MDB_conection_url;

const createAdminUser = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    

    const adminUser = new User({
      fullName: "Admin User",
      email: "myAdmin@gmail.com",
      M_number: "1234567890", // Change if needed
      address: "Admin Address",
      
      password: 'Hari@1807',
      profileImageURL: "http://localhost:8001/images/admin.png",
      role: "ADMIN",
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    mongoose.connection.close();
  }
};

createAdminUser();
