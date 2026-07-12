const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstName:      { type: String, required: true },
  lastName:       { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  phone:          { type: String },
  dob:            { type: String },
  gender:         { type: String },
  city:           { type: String },
  state:          { type: String },
  qualification:  { type: String },
  subject:        { type: String },
  experience:     { type: String },
  bio:            { type: String },
  accountName:    { type: String },
  accountNumber:  { type: String },
  ifsc:           { type: String },
  upi:            { type: String },
  aadharUrl:      { type: String },
  resumeUrl:      { type: String },
  marksheetUrl:   { type: String },
  password:       { type: String, required: true },
  role:           { type: String, default: "teacher" },
  isVerified:     { type: Boolean, default: false },
  createdAt:      { type: Date, default: Date.now },
});

module.exports = mongoose.model("Teacher", teacherSchema);