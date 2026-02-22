// controllers/journalController.js
const Journal = require("../models/Journal");
const User = require("../models/User");
const mongoose = require("mongoose");
const data = require("../data.json");
const fetch = global.fetch;

// helper to normalize date to midnight (for streak/heatmap)
function toDateOnly(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// difference in days between two dates (date-only)
function diffInDays(d1, d2) {
  const ms = toDateOnly(d1) - toDateOnly(d2);
  return ms / (1000 * 60 * 60 * 24);
}

// POST /api/journals
// expects: { userId, text, mood_score }
exports.createJournal = async (req, res) => {
  try {
    const { userId, text, mood_score, tags } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const article_length = text.length; // or compute word count instead
    let resu;
    try {
      resu = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })
        .then((d) => d.json())
        .then((d) => {
          console.log(d);
          return d;
        });
    } catch (err) {
      console.error("Fetch error:", err);
    }
    const journal = await Journal.create({
      user: user._id,
      text,
      calculated_score: resu ? resu.mood_score * 100 : 0,
      mood_score,
      article_length,
      tag: tags,
      timestamp: new Date(),
    });

    // --- Update streak + points ---
    const today = toDateOnly(new Date());

    if (!user.lastJournalDate) {
      // first ever entry
      user.streakCount = 1;
    } else {
      const diff = diffInDays(today, user.lastJournalDate);

      if (diff === 0) {
        // already logged today — don't change streak
      } else if (diff === 1) {
        // consecutive day
        user.streakCount += 1;
      } else if (diff > 1) {
        // streak broken
        user.streakCount = 1;
      }
    }

    user.lastJournalDate = today;

    // simple point system: 10 pts per journal
    user.points += 10;

    await user.save();

    res.status(201).json({
      message: "Journal created",
      journal,
      streakCount: user.streakCount,
      points: user.points,
    });
  } catch (err) {
    console.error("createJournal error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRecentJournals = async (req, res) => {
  // get journals that were created within the last 7 days
  try {
    const { userId } = req.params;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const journals = await Journal.find({
      user: userId,
      timestamp: { $gte: sevenDaysAgo },
    })
      .sort({ timestamp: -1 })
      .lean();
    res.json(journals);
  } catch (err) {
    console.error("getRecentJournals error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJournalById = async (req, res) => {
  try {
    const { userId, journalId } = req.params;
    const journal = await Journal.findOne({
      _id: journalId,
      user: userId,
    }).lean();
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    res.json(journal);
  } catch (err) {
    console.error("getJournalById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/journals/user/:userId
exports.getUserJournals = async (req, res) => {
  try {
    const { userId } = req.params;

    const journals = await Journal.find({ user: userId })
      .sort({ timestamp: -1 })
      .lean();

    res.json(journals);
  } catch (err) {
    console.error("getUserJournals error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/journals/heatmap/:userId
// returns array of { date: 'YYYY-MM-DD', avgMoodScore }
exports.getHeatmapData = async (req, res) => {
  try {
    const { userId } = req.params;

    const aggregate = await Journal.aggregate([
      { $match: { user: require("mongoose").Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          avgMoodScore: { $avg: "$mood_score" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = aggregate.map((item) => ({
      date: item._id,
      avgMoodScore: item.avgMoodScore,
      count: item.count,
    }));

    res.json(result);
  } catch (err) {
    console.error("getHeatmapData error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/journals/stats/:userId
// quick helper to get streak + points + optionally last mood
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const lastJournal = await Journal.findOne({ user: userId })
      .sort({ timestamp: -1 })
      .lean();

    res.json({
      streakCount: user.streakCount,
      points: user.points,
      lastMoodScore: lastJournal ? lastJournal.mood_score : null,
      lastJournalAt: lastJournal ? lastJournal.timestamp : null,
    });
  } catch (err) {
    console.error("getUserStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.bulkUploadJournals = async (req, res) => {
  try {
    const userId = "69218ea1c277d65c37c23d7d";

    const formatted = data.map((item) => ({
      user: new mongoose.Types.ObjectId(userId),
      text: item.text,
      timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
      mood_score: Number(item.mood_score),
      article_length: Number(item.article_length),
      tag: item.tag || "",
    }));

    await Journal.insertMany(formatted);

    res.json({
      success: true,
      message: `Inserted ${formatted.length} journal entries`,
    });
  } catch (err) {
    console.error("Bulk upload failed:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
