const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");

// ─── CREATE EXAM ───────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, subject, type, duration, color, questions } = req.body;

    const exam = await Exam.create({
      name, subject, type, duration, color, questions
    });

    res.json({
      message: "Exam created successfully",
      examId: exam._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET ALL EXAMS ─────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET SINGLE EXAM ───────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── UPDATE EXAM ───────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const { name, subject, type, duration, color, questions } = req.body;

    const updated = await Exam.findByIdAndUpdate(
      req.params.id,
      { name, subject, type, duration, color, questions },
      { new: true }
    );

    res.json({ message: "Exam updated successfully", exam: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE EXAM ───────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;