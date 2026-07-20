const express = require("express");
const { Doubts } = require("../models/Doubts");
const router = express.Router();


router.post("/DoubtSection", async (req, res) => {
  try {
    const { title, description, subject, image } = req.body;

    if (!title || !description || !subject) {
      return res.status(400).json({ message: "title, description and subject are required" });
    }

    const doubt = await Doubts.create({ title, description, subject, image });
    res.status(201).json({ message: "doubt created successfully", doubt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create doubt", error: err.message });
  }
});


router.get("/DoubtSection", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.subject) filter.subject = req.query.subject;

    const doubts = await Doubts.find(filter).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch("/DoubtSection/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "resolved"].includes(status)) {
      return res.status(400).json({ message: "status must be 'pending' or 'resolved'" });
    }

    const doubt = await Doubts.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    res.json(doubt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete-many", async (req, res) => {
  try {
    const result = await Doubts.deleteMany({
      title: req.body.title, 
    });
    res.json({
      message: "Deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;