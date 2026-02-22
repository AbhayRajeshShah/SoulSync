// routes/journalRoutes.js
const express = require("express");
const router = express.Router();
const {
  createJournal,
  getUserJournals,
  getHeatmapData,
  getUserStats,
  bulkUploadJournals,
  getJournalById,
  getRecentJournals,
} = require("../controllers/journalController");

router.post("/", createJournal);
router.get("/getJournal/:userId/:journalId", getJournalById);
router.get("/user/:userId", getUserJournals);
router.get("/heatmap/:userId", getHeatmapData);
router.get("/stats/:userId", getUserStats);
router.get("/getRecentJournals/:userId", getRecentJournals);
// router.get("/bulkUpload", bulkUploadJournals);

module.exports = router;
