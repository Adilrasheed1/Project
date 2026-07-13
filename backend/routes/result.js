const express = require("express");
const router = express.Router();
const Result = require("../models/Result");

// ─── SAVE RESULT ───────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      examId, examName, studentUsername,
      examScore, integrityScore, finalScore,
      totalMarks, examType, violations
    } = req.body;

    const result = await Result.create({
      examId, examName, studentUsername,
      examScore, integrityScore, finalScore,
      totalMarks, examType, violations
    });

    res.json({ message: "Result saved successfully", resultId: result._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET ALL RESULTS FOR ONE EXAM ──────────────────
router.get("/exam/:examId", async (req, res) => {
  try {
    const results = await Result.find({ examId: req.params.examId })
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET ALL RESULTS FOR ONE STUDENT ───────────────
router.get("/student/:username", async (req, res) => {
  try {
    const results = await Result.find({ studentUsername: req.params.username })
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;