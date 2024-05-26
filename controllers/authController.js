const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User/admin register
const userRegister = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password, "in create user");
  if (!username) {
    return res
      .status(400)
      .json({ error: true, message: "full name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "password is required" });
  }

  try {
    const isUser = await User.findOne({ email: email });

    if (isUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "student",
    });

    await user.save();
    console.log(
      user,
      "userrrr",
      process.env.ACCESS_TOKEN_SECRET,
      process.env.JWT_EXPIRES_IN,
      user._id
    );

    const token = jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.json({
      error: false,
      user,
      token,
      message: "Registration successful",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

// User/admin login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password,"email, password inlgin")
  if (!email) {
    return res.status(400).json({ error: true, message: "email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "password is required" });
  }
  try {
    const userInfo = await User.findOne({ email: email });
    console.log(userInfo, "userInfo");
    if (!userInfo) {
      return res.status(400).json({ error: true, message: "user not found" });
    }
    const passwordMatch = await bcrypt.compare(password, userInfo.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { user: userInfo },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      error: false,
      message: "login successfull",
      token,
      email,
      role: userInfo.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = { userRegister, userLogin };
