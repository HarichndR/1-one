const { Router } = require("express");
const User = require("../scheema/user");
const multer = require('multer');
const path = require('path');
const { validateToken } = require('../seirvise/autho');
const axios = require('axios');
const {LocalStorage }=require('node-localstorage');
const localStorage =new LocalStorage('./scratch');
const  checkForAuthenticationCookie  = require("../midelwear/autho");
const FeedBack=require('../scheema/fedaback');
const router = Router();
const url='http://localhost:8001/public'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/profileIMG'));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('email:', email, 'password:', password);

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    localStorage.setItem('token', token);
    console.log('user is logged in:', token);
    const payload= await validateToken(token);
    console.log(payload);
    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 864000000,
      domain: 'localhost:3000'
    });

    // Return the token as a JSON response
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'An error occurred during login.'
    });
  }
});

router.post("/register", upload.single("profileImg"), async (req, res) => {
  const { fullName, email, password, role, address, M_number } = req.body;

  try {
    let profileImageURL = null;
    if (req.file) {
      profileImageURL = `${url}/profileIMG/${req.file.filename}`;
    }

    await User.create({
      fullName,
      email,
      password,
      role,
      address,
      M_number,
      profileImageURL: profileImageURL,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({ error: error.message });
  }
});




router.get('/me', checkForAuthenticationCookie,  async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    //.log("me", authHeader);
    
    if (!authHeader) {
      console.log("Authorization header not provided");
      return res.status(401).json({ error: 'Authorization header not provided' });
    }

    const ptoken = authHeader.split(" ")[1]; // Correctly split the Bearer token
    const token= ptoken.replace(/["]+/g,'');
    //console.log('Token:', token);
    
    if (!token) {
      console.log("Token not provided");
      return res.status(401).json({ error: 'Token not provided' });
    }

    const userPayload = await validateToken(token);
     // Corrected the typo here
    
    if (userPayload.error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const email = userPayload.email;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);

  } catch (error) {
    console.error('Profile retrieval error:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving user profile' });
  }
});
router.patch('/profile', checkForAuthenticationCookie,  upload.single('profileImage'), async (req, res) => {
  try {
    // Assuming you have a user model and assuming the user ID is obtained from authentication middleware
    //const userId = req.user.id; // Example: Assuming user ID is obtained from authentication middleware
    
    
    const { fullName, email, M_number, address } = req.body;

    // If a new profile image is uploaded, update the profile image URL
    let profileImageURL;
    if (req.file) {
      profileImageURL = `${url}/profileIMG/${req.file.filename}`; // Store the path to the uploaded image
    }
  
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

router.post('/sendfeedback',checkForAuthenticationCookie,async(req, res)=>{
const {message}= req.body;
const email=req.user.email;
const data= await FeedBack.create({
  email:email,
  message:message,
});
return res.json({data});
});




module.exports = router;

