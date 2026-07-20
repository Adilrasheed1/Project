// Run once, AFTER you've added the `status` field to Teacher.js
// and BEFORE any new teacher signs up under the new approval flow.
//
// This approves every teacher that already exists in the database,
// so only teachers who register from now on need admin approval.
//
// Usage:
//   cd backend
//   node grandfatherTeachers.js

require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("node:dns");

// Same DNS fix used in index.js — required for MongoDB Atlas SRV lookups
// to resolve correctly on this network/machine.
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const Teacher = require("./models/Teacher");

async function run() {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  });

  const result = await Teacher.updateMany(
    {}, // every existing teacher
    {
      status: "Approved",
      isVerified: true,
      reviewedAt: new Date(),
    }
  );

  console.log(`✅ Grandfathered ${result.modifiedCount} existing teacher(s) as Approved.`);
  console.log("Any teacher who signs up from now on will start as Pending and require admin approval.");

  process.exit();
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});