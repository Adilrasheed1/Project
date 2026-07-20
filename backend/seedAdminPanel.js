// Run once: node seedAdminPanel.js
// Creates the first admin account. Edit the email/password below before running.
// Delete or stop using this script after your admin account is created.

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("node:dns");

// Same DNS fix used in index.js — required for MongoDB Atlas SRV lookups
// to resolve correctly on this network/machine.
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const AdminUser = require("./models/AdminUser");

const ADMIN_EMAIL = "admin@tc.com"; // change this
const ADMIN_PASSWORD = "224523@Mu"; // change this before running
const ADMIN_NAME = "Super Admin";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  });

  const existing = await AdminUser.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    console.log("Admin already exists with this email:", ADMIN_EMAIL);
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = new AdminUser({
    email: ADMIN_EMAIL,
    password: hashedPassword,
    name: ADMIN_NAME,
  });

  await admin.save();

  console.log("✅ Admin account created:");
  console.log("   Email:", ADMIN_EMAIL);
  console.log("   Password:", ADMIN_PASSWORD, "(change this after first login if you add a change-password feature)");

  process.exit();
}

seed().catch((err) => {
  console.error("❌ Failed to seed admin:", err);
  process.exit(1);
});