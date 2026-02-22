// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const journalRoutes = require("./routes/journalRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
connectDB();

// middleware
app.use(
  cors({
    origin: "http://localhost:3000", // ❗ MUST NOT be "*"
    credentials: true, // allow cookies/credentials
  })
);
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res.send("Student Wellness API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
