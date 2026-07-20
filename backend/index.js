const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require("body-parser");
require("dotenv").config();

const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/teacher-courses", require("./routes/teacherCourses"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/student", require("./routes/student"));
app.use("/api/orders", require("./routes/orders"));
// app.use("/api/doubts", require("./routes/doubts"));
app.use("/api/support", require("./routes/support"));
app.use("/api/admin-panel", require("./routes/adminPanel"));
// app.use("/api/admin", require("./routes/admin"));
// app.use("/api/tutor", require("./routes/tutor"));
// app.use("/api/user", require("./routes/user"));
app.use("/api/exam", require("./routes/exam"));
app.use("/api/result", require("./routes/result"));
app.use("/api/doubts", require("./routes/doubts"));

require('./server')(server);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");

    server.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err);
  });