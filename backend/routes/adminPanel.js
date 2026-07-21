const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminUser = require("../models/AdminUser");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const adminPanelAuth = require("../middlewares/adminPanelAuth");


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


router.get("/teachers", adminPanelAuth, async (req, res) => {
  try {
    const { status, search } = req.query; // ?status=Approved&search=name/email/subject

    const filter = {};
    if (status && status !== "All") filter.status = status;

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { subject: regex },
      ];
    }

    const teachers = await Teacher.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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

// NOTE: this assumes the Teacher model has (or you add) an `isBlocked: { type: Boolean, default: false }`
// field, the same way it's now added to the Student model. Blocking is independent of the
// Pending/Approved/Rejected approval status — a blocked teacher should also be denied login
// server-side wherever the teacher login route checks credentials.
router.put("/teachers/:id/block", adminPanelAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.isBlocked = true;
    teacher.blockedAt = new Date();
    teacher.blockReason = req.body.reason || "";

    await teacher.save();

    res.json({ message: "Teacher blocked", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/teachers/:id/unblock", adminPanelAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.isBlocked = false;
    teacher.blockedAt = undefined;
    teacher.blockReason = "";

    await teacher.save();

    res.json({ message: "Teacher unblocked", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// STUDENTS
// =======================================

// GET /students?search=...&course=id1,id2&blocked=true|false
// - search matches firstName/lastName/email
// - course is a comma-separated list of Course IDs. A student matches if enrolled in ANY of them
//   (i.e. selecting multiple courses widens the filter to "enrolled in course A or course B").
// - blocked filters by block status
router.get("/students", adminPanelAuth, async (req, res) => {
  try {
    const { search, course, blocked } = req.query;

    const filter = {};

    if (blocked === "true") filter.isBlocked = true;
    if (blocked === "false") filter.isBlocked = { $ne: true };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
    }

    if (course && course.trim()) {
      const courseIds = course.split(",").map((c) => c.trim()).filter(Boolean);
      if (courseIds.length) {
        filter["enrolledCourses.course"] = { $in: courseIds };
      }
    }

    const students = await Student.find(filter)
      .select("-password")
      .populate("enrolledCourses.course")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/students/:id", adminPanelAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password")
      .populate("enrolledCourses.course");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/students/:id/block", adminPanelAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.isBlocked = true;
    student.blockedAt = new Date();
    student.blockReason = req.body.reason || "";

    await student.save();

    res.json({ message: "Student blocked", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/students/:id/unblock", adminPanelAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.isBlocked = false;
    student.blockedAt = undefined;
    student.blockReason = "";

    await student.save();

    res.json({ message: "Student unblocked", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /courses - lightweight list for the "filter by course" dropdown in the admin dashboard.
// Assumes a Course model exists with at least a `title` (or `name`) field — adjust the
// .select() below to match your actual Course schema if the field names differ.
router.get("/courses", adminPanelAuth, async (req, res) => {
  try {
    const Course = require("../models/Course");
    const courses = await Course.find().select("_id title name subject").sort({ title: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;