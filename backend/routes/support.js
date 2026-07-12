const express = require("express");
const router = express.Router();
const SupportRequest = require("../models/SupportRequest");

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      reason,
      description,
    } = req.body;

    const request = new SupportRequest({
      name,
      email,
      phone,
      role,
      reason,
      description,
    });

    await request.save();

    res.status(201).json({
      message: "Support request submitted successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const requests = await SupportRequest.find().sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const request = await SupportRequest.findById(req.params.id);

    if (!request)
      return res.status(404).json({
        message: "Request not found",
      });

    request.status = req.body.status;

    await request.save();

    res.json({
      message: "Status updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await SupportRequest.findByIdAndDelete(req.params.id);

    res.json({
      message: "Request deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;