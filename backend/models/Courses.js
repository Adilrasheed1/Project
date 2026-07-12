const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title:   { type: String },
  fileUrl: { type: String },
}, { _id: false });

const lectureSchema = new mongoose.Schema({
  title:    { type: String },
  videoUrl: { type: String },
  notes:    [noteSchema],   // <-- notes now live under their lecture
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  subject:       { type: String, required: true },
  description:   { type: String },
  price:         { type: Number, required: true },
  tutor:         { type: String, required: true },
  tutorId:       { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  thumbnailUrl:  { type: String },
  lectures:      [lectureSchema],
  rating:        { type: Number, default: 0 },
  students:      { type: Number, default: 0 },
  color:         { type: String, default: "#4FB88A" },
  createdAt:     { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);