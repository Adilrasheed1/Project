const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  name:      { type: String, default: "Admin" },
  role:      { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminUser", adminUserSchema);