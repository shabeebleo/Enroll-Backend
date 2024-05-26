const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authMiddleware");
const connectDB = require("./Config/database");
const authRoute=require("./routes/authRoute")
const adminRoute=require("./routes/adminRoute")
const studentRoute=require("./routes/studentRoute")

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Connect to the database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ data: "hai" });
});

// Server port
const PORT = process.env.PORT || 8080;

// Routes

//auth Route
app.use('/auth', authRoute);

//admin Route
app.use("/admin",adminRoute)

//student Route
app.use("/student",studentRoute)


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
