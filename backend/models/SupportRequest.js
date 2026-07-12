const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SupportRequest", supportRequestSchema);