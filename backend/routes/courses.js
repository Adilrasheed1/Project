const Order = require("../models/Order");
const express = require("express");
const router = express.Router();
const Course = require("../models/Courses");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// =======================================
// GET ALL COURSES
// =======================================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// =======================================
// GET STUDENT ENROLLED COURSES (Moved up to prevent route collision)
// =======================================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students allowed" });
    }

    const student = await Student.findById(req.user.id).populate(
      "enrolledCourses.course"
    );

    res.json(student.enrolledCourses);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// =======================================
// GET SINGLE COURSE
// =======================================
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// =======================================
// CREATE COURSE
// =======================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can create courses" });
    }

    const {
      title,
      subject,
      description,
      price,
      tutor,
      color,
      thumbnailUrl,
      lectures,
      notes,
    } = req.body;

    const course = new Course({
      title,
      subject,
      description,
      price,
      tutor,
      tutorId: req.user.id,
      color: color || "#4FB88A",
      thumbnailUrl,
      lectures: lectures || [],
      notes: notes || [],
    });

    await course.save();

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// =======================================
// DELETE COURSE
// =======================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await Student.updateMany(
  {},
  {
    $pull: {
      enrolledCourses: {
        course: req.params.id,
      },
    },
  }
);

    res.json({
      message: "Course deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// =======================================
// ENROLL IN COURSE
// =======================================
router.post("/:id/enroll", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can enroll" });
    }

    const student = await Student.findById(req.user.id);
    const course = await Course.findById(req.params.id);

    if (!student || !course) {
      return res
        .status(404)
        .json({ message: "Course or student not found" });
    }

    const already = student.enrolledCourses.find(
      (c) => c.course.toString() === req.params.id
    );

    if (already) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    student.enrolledCourses.push({
      course: course._id,
      progress: 0,
      completedLectures: [],
    });

    const order = new Order({
      student: student._id,
      course: course._id,
      amount: course.price,
    });

    await order.save();

    course.students += 1;

    await student.save();
    await course.save();

    res.json({
      message: "Course enrolled successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// =======================================
// UPDATE PROGRESS
// =======================================
router.put("/:id/progress", authMiddleware, async (req, res) => {
  try {
    const { lectureIndex } = req.body;

    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const enrolled = student.enrolledCourses.find(
      (c) => c.course.toString() === req.params.id
    );

    if (!enrolled) {
      return res.status(404).json({
        message: "Course not enrolled",
      });
    }

    if (!enrolled.completedLectures.includes(lectureIndex)) {
      enrolled.completedLectures.push(lectureIndex);
    }

    const course = await Course.findById(req.params.id);

    if (course.lectures.length > 0) {
      enrolled.progress = Math.round(
        (enrolled.completedLectures.length / course.lectures.length) * 100
      );
    } else {
      enrolled.progress = 100;
    }

    await student.save();

    res.json({
      message: "Progress updated",
      progress: enrolled.progress,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;