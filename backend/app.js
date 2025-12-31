//const { scrapeAndSaveData } = require("./seirvise/fetchdata");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const AdminRoute = require('./routes/admin');
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const { checkRole } = require("./midelwear/restrict");
const checkForAuthenticationCookie = require("./midelwear/autho");
const { server, io, app } = require('./server');
const chatRoute = require('./routes/Chat');
require('dotenv').config();

const logger = require("./seirvise/logger");
const httpLogger = require("./midelwear/logMiddleware");

app.use(httpLogger);

//const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT; // Use your specified port
app.use(express.json());
app.use(cookieParser());
// Connect to MongoDB
mongoose.connect(process.env.MDB_conection_String, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware setup
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options('*', cors())

//));



//app.use(checkForAuthenticationCookie);
app.use('/admin', checkForAuthenticationCookie, AdminRoute);

app.use('/public', express.static(path.join(__dirname, 'public')))
// Routes
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/chat', chatRoute);
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});



app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: "Internal Server Error" });
});


// Start server
server.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
