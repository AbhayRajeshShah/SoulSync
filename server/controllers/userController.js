// controllers/userController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// POST /api/users/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "student",
    });

    res.status(201).json({
      message: "User registered",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // In real app you’d return a JWT here
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        streakCount: user.streakCount,
        points: user.points,
      },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/profile/:userId
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("getUserProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json({ students });
  } catch (err) {
    console.error("getStudents error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.isAuthenticated = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        isAuthenticated: false,
        message: "userId is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        isAuthenticated: false,
        message: "Invalid user",
      });
    }

    return res.json({
      isAuthenticated: true,
      role: user.role,
      user,
    });
  } catch (err) {
    console.error("isAuthenticated error:", err);
    res.status(500).json({
      isAuthenticated: false,
      message: "Server error",
    });
  }
};
