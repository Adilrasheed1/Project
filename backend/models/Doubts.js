const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    image: { type: String, default: "" }, 
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }  
);

const Doubts = mongoose.model("Doubts", doubtSchema);
module.exports = { Doubts };