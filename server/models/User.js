// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "counselor"],
      default: "student",
    },

    // Gamification / analytics helpers
    streakCount: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    // track the last date we updated streak (for easier streak calc)
    lastJournalDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
