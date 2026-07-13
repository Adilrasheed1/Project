const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema({
  type:      { type: String },
  time:      { type: String },
  deduction: { type: Number }
}, { _id: false });

const resultSchema = new mongoose.Schema({
  examId:          { type: String },
  examName:        { type: String },
  studentUsername: { type: String },
  examScore:       { type: Number },
  integrityScore:  { type: Number },
  finalScore:      { type: Number },
  totalMarks:      { type: Number },
  examType:        { type: String },
  violations:      [violationSchema],
  submittedAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);