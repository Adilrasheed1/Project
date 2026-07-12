const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http"); // 👈 add this
const bodyParser = require("body-parser");
require("dotenv").config();


const app = express();
const server = http.createServer(app); // 👈 create HTTP server from express app

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// const adminRouter = require("./routes/admin");
// const userRouter = require("./routes/user");
// const doubtsRouter = require("./routes/doubts");
// const tutorRouter = require("./routes/tutor");
// const courseRouter = require('./routes/courses');
app.use("/api/auth", require("./routes/auth"));
app.use("/api/teacher-courses", require("./routes/teacherCourses"));
//app.use("/admin", adminRouter);
//app.use("/user", userRouter);
//app.use("/doubts", doubtsRouter);
//app.use("/tutor", tutorRouter);
//app.use("/courses", courseRouter);


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

