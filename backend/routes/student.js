const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students allowed",
      });
    }

    const student = await Student.findById(req.user.id)
      .select("-password")
      .populate("enrolledCourses.course");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const hasOrphans = student.enrolledCourses.some((c) => !c.course);
    if (hasOrphans) {
      student.enrolledCourses = student.enrolledCourses.filter((c) => c.course);
      await student.save();
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students allowed",
      });
    }

    const student = await Student.findById(req.user.id)
      .populate("enrolledCourses.course");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const dashboard = {
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },

      stats: {
        courses: student.enrolledCourses.length,
        completedCourses: student.enrolledCourses.filter(
          c => c.progress === 100
        ).length,
      },

      myCourses: student.enrolledCourses,
    };

    res.json(dashboard);

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students allowed",
      });
    }

    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    student.firstName = req.body.firstName;
    student.lastName = req.body.lastName;
    student.email = req.body.email;
    student.phone = req.body.phone;
    student.dob = req.body.dob;
    student.gender = req.body.gender;
    student.grade = req.body.grade;
    student.board = req.body.board;
    student.school = req.body.school;
    student.city = req.body.city;
    student.state = req.body.state;

    // Change password only if requested
    if (
      req.body.currentPassword &&
      req.body.newPassword &&
      req.body.confirmPassword
    ) {
      const match = await bcrypt.compare(
        req.body.currentPassword,
        student.password
      );

      if (!match) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({
          message: "New passwords do not match",
        });
      }

      student.password = await bcrypt.hash(req.body.newPassword, 10);
    }

    await student.save();

    const updated = await Student.findById(student._id)
      .select("-password")
      .populate("enrolledCourses.course");

    res.json({
      message: "Profile updated successfully",
      student: updated,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;