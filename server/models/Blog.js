const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  authorName: { type: String, required: true },
  date: {
    type: String,
    default: Date.now(),
  },
  userid: { type: mongoose.SchemaTypes.ObjectId, required: true },
});

const Blog = new mongoose.model("Blog", BlogSchema);

module.exports = Blog;
