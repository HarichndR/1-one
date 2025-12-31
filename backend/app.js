const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const AdminRoute = require("./routes/admin");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const chatRoute = require("./routes/Chat");

const checkForAuthenticationCookie = require("./midelwear/autho");
const logger = require("./seirvise/logger");
const httpLogger = require("./midelwear/logMiddleware");

const { server, app } = require("./server");

const PORT = process.env.PORT || 8080;

/* ------------------ LOGGING ------------------ */
app.use(httpLogger);

/* ------------------ CORS (TOP) ------------------ */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost",
  "http://127.0.0.1",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
}));

app.options("*", cors());

/* ------------------ PARSERS ------------------ */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("trust proxy", 1);

/* ------------------ DB ------------------ */
mongoose
  .connect(process.env.MDB_conection_String)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* ------------------ ROUTES ------------------ */
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/chat", chatRoute);
app.use("/admin", checkForAuthenticationCookie, AdminRoute);

/* ------------------ ERROR HANDLING ------------------ */
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ error: err.message });
});

/* ------------------ SERVER ------------------ */
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
