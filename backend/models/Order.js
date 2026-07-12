const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  paymentStatus: {
    type: String,
    default: "Completed",
  },

  purchasedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);