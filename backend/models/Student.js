const mongoose = require("mongoose");

const enrolledCourseSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

  progress: {
    type: Number,
    default: 0,
  },

  completedLectures: [
    {
      type: Number,
    },
  ],

  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  dob: { type: String },
  gender: { type: String },
  grade: { type: String },
  board: { type: String },
  school: { type: String },
  city: { type: String },
  state: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: "student" },

  enrolledCourses: [enrolledCourseSchema],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", studentSchema);