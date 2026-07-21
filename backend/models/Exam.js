const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String },
  options:  [String],
  answer:   { type: String }
}, { _id: false });

const examSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  subject:   { type: String },
  type:      { type: String, default: "normal" }, // "normal" or "proctored"
  duration:  { type: Number },
  color:     { type: String },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String }
});

module.exports = mongoose.model("Exam", examSchema);