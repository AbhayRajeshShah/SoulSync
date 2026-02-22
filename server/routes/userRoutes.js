// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  isAuthenticated,
  getUserProfile,
  getStudents,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/is-auth", isAuthenticated);
router.get("/profile/:userId", getUserProfile);
router.get("/students", getStudents);

module.exports = router;
