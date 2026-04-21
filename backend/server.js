const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8000 });

let student = null;
let tutor = null;

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const msg = JSON.parse(data);

    if (msg.type === "student") student = ws;
    if (msg.type === "tutor") tutor = ws;

    // 🔥 Student requests tutor
    if (msg.type === "request_tutor") {
      tutor?.send(JSON.stringify({
        type: "incoming_request",
        title: msg.title,
        description: msg.description
      }));
    }

    // 🔥 Tutor accepts
    if (msg.type === "accept") {
      student?.send(JSON.stringify({ type: "accepted" }));
    }

    // 🔥 WebRTC signaling
    if (msg.type === "offer") tutor?.send(JSON.stringify(msg));
    if (msg.type === "answer") student?.send(JSON.stringify(msg));
    if (msg.type === "candidate") {
      if (ws === student) tutor?.send(JSON.stringify(msg));
      else student?.send(JSON.stringify(msg));
    }
  });
});