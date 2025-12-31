const { Router } = require("express");
const User = require("../scheema/user");
const multer = require('multer');
const path = require('path');
const { validateToken } = require('../seirvise/autho');
const axios = require('axios');
const { LocalStorage } = require('node-localstorage');

const checkForAuthenticationCookie = require("../midelwear/autho");
const FeedBack = require('../scheema/fedaback');
const router = Router();
const url = process.env.STOARGE_URL;
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: 'profileIMG',                  // Folder in Cloudinary
      allowed_formats: ['jpg', 'png'],       // Allowed formats
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}` // Custom filename
    };
  },
});
const upload = multer({ storage: storage });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    const payload = await validateToken(token);

    res.status(200).json({
      token,
      role: payload.role
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});


router.post("/register", upload.single("profileImg"), async (req, res) => {
  const { fullName, email, password, role, address, M_number } = req.body;

  try {
    let profileImageURL = null;
    if (req.file) {

    }

    await User.create({
      fullName,
      email,
      password,
      role,
      address,
      M_number,
      profileImageURL: req.file.path,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({ error: error.message });
  }
});




router.get('/me', checkForAuthenticationCookie, async (req, res) => {

  const user = await User.findOne({ email: req.user.email });

  res.json(user);
});

router.patch('/profile', checkForAuthenticationCookie, upload.single('profileImage'), async (req, res) => {
  try {
    // Assuming you have a user model and assuming the user ID is obtained from authentication middleware
    //const userId = req.user.id; // Example: Assuming user ID is obtained from authentication middleware
    const { fullName, email, M_number, address } = req.body;

    // If a new profile image is uploaded, update the profile image URL
    var profileImageURL;
    if (req.file) {
      profileImageURL = req.file.path
    }; // Store the path to the uploaded image


    // Update user profile in the database
    // Example: Assuming you have a User model and using Mongoose
    const user = await User.findByIdAndUpdate(req.user._id, {
      fullName,
      email,
      M_number,
      address,
      profileImageURL
    }, { new: true });

    res.json(user); // Return the updated user object
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/sendfeedback', checkForAuthenticationCookie, async (req, res) => {
  const { message } = req.body;
  const email = req.user.email;
  const data = await FeedBack.create({
    email: email,
    message: message,
  });
  return res.json({ data });
});




module.exports = router;

