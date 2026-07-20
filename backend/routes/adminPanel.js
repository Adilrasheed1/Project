const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminUser = require("../models/AdminUser");
const Teacher = require("../models/Teacher");
const adminPanelAuth = require("../middlewares/adminPanelAuth");

// =======================================
// ADMIN LOGIN
// =======================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminUser.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// GET TEACHERS PENDING APPROVAL
// =======================================
router.get("/teachers/pending", adminPanelAuth, async (req, res) => {
  try {
    const teachers = await Teacher.find({ status: "Pending" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// GET ALL TEACHERS (directory, any status)
// =======================================
router.get("/teachers", adminPanelAuth, async (req, res) => {
  try {
    const { status } = req.query; // optional ?status=Approved filter

    const filter = status ? { status } : {};

    const teachers = await Teacher.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// GET SINGLE TEACHER DETAIL
// =======================================
router.get("/teachers/:id", adminPanelAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("-password");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// APPROVE TEACHER
// =======================================
router.put("/teachers/:id/approve", adminPanelAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.status = "Approved";
    teacher.isVerified = true;
    teacher.rejectionReason = "";
    teacher.reviewedAt = new Date();

    await teacher.save();

    res.json({ message: "Teacher approved", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// REJECT TEACHER
// =======================================
router.put("/teachers/:id/reject", adminPanelAuth, async (req, res) => {
  try {
    const { reason } = req.body;

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.status = "Rejected";
    teacher.isVerified = false;
    teacher.rejectionReason = reason || "";
    teacher.reviewedAt = new Date();

    await teacher.save();

    res.json({ message: "Teacher rejected", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;