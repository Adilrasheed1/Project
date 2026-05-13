const express = require("express");
const cors = require("cors");
const http = require("http"); // 👈 add this
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app); // 👈 create HTTP server from express app

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const doubtsRouter = require("./routes/doubts");
const tutorRouter = require("./routes/tutor");
const courseRouter = require('./routes/courses');

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/doubts", doubtsRouter);
app.use("/tutor", tutorRouter);
app.use("/courses", courseRouter);

// 👇 pass the server to your WebSocket setup
require('./server')(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});