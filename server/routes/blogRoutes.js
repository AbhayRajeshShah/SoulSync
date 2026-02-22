const express = require("express");
const app = express.Router();

const User = require("../models/User");
const Blog = require("../models/Blog");

app.post("/new", async (req, res) => {
  try {
    const { title, body, uid, category } = req.body;
    let image = req.body.image || "";
    let user = await User.findById(uid);
    if (title && body) {
      let blog = new Blog({
        title: title,
        body: body,
        userid: uid,
        authorName: user.name,
        image: image,
        category: category,
      });
      blog.save();
      res.status(300).json({ message: "Added Blog Successfully" });
    }
  } catch (e) {
    res.status(400).json({ message: "Error", body: e });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(300).json({ message: "Deleted Blog Successfully" });
  } catch (e) {
    res.status(404).json({ message: "Failed to delete", body: e });
  }
});

app.get("/getBlog/:id", async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ message: "Blog not Found" });
    } else {
      res.status(300).json({ message: "Blog Found!", body: blog });
    }
  } catch (e) {
    res.status(404).json({ message: "Blog not Found" });
  }
});

// GET all blogs
app.get("/allBlogs", async (req, res) => {
  try {
    let blogs = await Blog.find().sort({ date: -1 });
    res.status(200).json(blogs);
  } catch (e) {
    res.status(500).json({ message: "Error fetching blogs", body: e });
  }
});

module.exports = app;
