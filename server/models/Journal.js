// models/Journal.js
const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    calculated_score: {
      type: Number,
      default: 0,
    },
    mood_score: {
      type: Number, // 0–1 range from your Python model
      required: true,
    },
    tag: String,
    article_length: {
      type: Number, // you can store text.length or word count
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", journalSchema);
