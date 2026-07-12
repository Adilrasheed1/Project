const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Course = require("../models/Courses");
const Teacher = require("../models/Teacher");
const Order = require("../models/Order");
const upload = require("../upload");

// ======================
// AUTH MIDDLEWARE
// ======================

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

// ======================
// FILE UPLOADS (Cloudinary via multer)
// Each returns { url } which the frontend attaches to the
// course payload (thumbnailUrl, or a lectures[]/notes[] entry).
// ======================

router.post("/upload/thumbnail", auth, upload.single("thumbnail"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: req.file.path });
});

router.post("/upload/video", auth, upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: req.file.path });
});

router.post("/upload/notes", auth, upload.single("notes"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: req.file.path });
});

// ======================
// TEACHER DASHBOARD (real stats, no hardcoded data)
// ======================

router.get("/dashboard", auth, async (req, res) => {
  try {
    const courses = await Course.find({ tutorId: req.user.id }).sort({ createdAt: -1 });

    const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
    const totalCourses = courses.length;
    const avgRating =
      courses.length > 0
        ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
        : "0.0";

    const courseIds = courses.map((c) => c._id);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthOrders = await Order.find({
      course: { $in: courseIds },
      purchasedAt: { $gte: startOfMonth },
      paymentStatus: "Completed",
    });
    const monthEarnings = monthOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const courseEarnings = {};
    const allCompletedOrders = await Order.find({
      course: { $in: courseIds },
      paymentStatus: "Completed",
    });
    allCompletedOrders.forEach((o) => {
      const id = o.course.toString();
      courseEarnings[id] = (courseEarnings[id] || 0) + (o.amount || 0);
    });

    const recentOrders = await Order.find({ course: { $in: courseIds } })
      .sort({ purchasedAt: -1 })
      .limit(10)
      .populate("student", "firstName lastName")
      .populate("course", "title");

    const recentStudents = recentOrders.map((o) => ({
      name: o.student ? `${o.student.firstName} ${o.student.lastName}` : "Unknown",
      course: o.course ? o.course.title : "Unknown",
      progress: o.progress || 0,
      joined: o.purchasedAt,
    }));

    res.json({
      stats: {
        totalStudents,
        totalCourses,
        monthEarnings,
        avgRating,
      },
      courses: courses.map((c) => ({
        ...c.toObject(),
        earnings: courseEarnings[c._id.toString()] || 0,
      })),
      recentStudents,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// ======================
// CREATE COURSE
// ======================

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Only teachers can upload courses",
      });
    }

    const teacher = await Teacher.findById(req.user.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const {
      title,
      subject,
      description,
      price,
      thumbnailUrl,
      color,
      lectures,
      notes,
      status,
    } = req.body;

    const course = new Course({
      title,
      subject,
      description,
      price,

      tutor: teacher.firstName + " " + teacher.lastName,
      tutorId: teacher._id,

      thumbnailUrl: thumbnailUrl || "",
      color: color || "#4FB88A",

      lectures: lectures || [],
      notes: notes || [],

      status: status || "Draft",
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course uploaded successfully",
      course,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ======================
// GET MY COURSES
// ======================

router.get("/", auth, async (req, res) => {
  try {
    const courses = await Course.find({
      tutorId: req.user.id,
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ======================
// UPDATE COURSE
// ======================

router.put("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      tutorId: req.user.id,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    Object.assign(course, req.body);

    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ======================
// DELETE COURSE
// ======================

router.delete("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      tutorId: req.user.id,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;