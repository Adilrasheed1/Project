const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const upload = require("../upload");

router.post("/student/register", async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dob,
      gender,
      grade,
      board,
      school,
      city,
      state,
    } = req.body;

    const existing = await Student.findOne({ email });

    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      grade,
      board,
      school,
      city,
      state,
      password: hashedPassword,
    });

    await student.save();

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Student registered successfully",
      token,
      user: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role: "student",
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post(
  "/teacher/register",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        city,
        state,
        qualification,
        subject,
        experience,
        bio,
        accountName,
        accountNumber,
        ifsc,
        upi,
      } = req.body;

      const existing = await Teacher.findOne({ email });

      if (existing)
        return res.status(400).json({
          message: "Email already registered",
        });

      const hashedPassword = await bcrypt.hash(password, 10);

      const teacher = new Teacher({
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        city,
        state,
        qualification,
        subject,
        experience,
        bio,
        accountName,
        accountNumber,
        ifsc,
        upi,
        resumeUrl: req.files?.resume?.[0]?.path || "",
        aadharUrl: req.files?.aadhar?.[0]?.path || "",
        marksheetUrl: req.files?.marksheet?.[0]?.path || "",
        password: hashedPassword,
        // status defaults to "Pending" via schema
      });

      await teacher.save();

      // NOTE: No token issued here anymore for teachers — they must wait for
      // admin approval before they can log in. See /login below.
      res.status(201).json({
        message:
          "Registration submitted successfully. Your account is under review — you'll be able to log in once an admin approves it.",
        status: "Pending",
        user: {
          id: teacher._id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          role: "teacher",
        },
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user =
      role === "student"
        ? await Student.findOne({ email })
        : await Teacher.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: "Invalid email or password",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        message: "Invalid email or password",
      });

    // Block teacher login until admin approval
    if (role === "teacher") {
      if (user.status === "Pending") {
        return res.status(403).json({
          message:
            "Your account is under review. You'll be able to log in once an admin approves your registration.",
          status: "Pending",
        });
      }

      if (user.status === "Rejected") {
        return res.status(403).json({
          message: user.rejectionReason
            ? `Your teacher account was not approved. Reason: ${user.rejectionReason}`
            : "Your teacher account was not approved.",
          status: "Rejected",
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;