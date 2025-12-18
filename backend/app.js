const { scrapeAndSaveData } = require("./seirvise/fetchdata");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const {checkRole} = require("./midelwear/restrict");
const  checkForAuthenticationCookie  = require("./midelwear/autho");
const{ server, io,app} =require('./server');
const chatRoute = require('./routes/Chat');
//const app = express();
const PORT = process.env.PORT | 4000; // Use your specified port

// Connect to MongoDB
require('dotenv').config();
//mongoose.connect(process.env.MDB_conection_String, { useNewUrlParser: true, useUnifiedTopology: true })
//  .then(() => console.log("MongoDB Connected"))
  //.catch(err => console.error("MongoDB connection error:", err));

const mongodbURL=process.env.MDB_conection_String;
console.log("Mongodb URL:",mongodbURL);
const  mongoConect=async(mongodbURL)=>{
  console.log(mongodbURL);
  try {
    (await mongoose.connect(mongodbURL))
    console.log('db connection status:', mongoose.connection.readyState);

    mongoose.connection.on("error", err => {
  console.error("MongoDB runtime error:", err);
  });

    console.log("Mongodb connected");

  } catch (error) {
    console.error("Mongodb connection error",error);
  }
 

}
mongoConect(mongodbURL);

// Middleware setup
app.use(cors(
  {origin:process.env.CORS_ORIGIN,
  credentials:true,}
));
//app.options('*',cors(

//));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(checkForAuthenticationCookie);


app.use('/public',express.static(path.join(__dirname,'public')))
// Routes
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/chat',chatRoute);
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});



 
scrapeAndSaveData();

// Start server
server.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
