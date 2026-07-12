const { WebSocketServer, WebSocket } = require("ws");


module.exports = function (server) {
  const wss = new WebSocketServer({ server });

  // All connected tutors and students
  const tutors = new Set();
  const students = new Set();

  // Student <-> Tutor mapping for WebRTC signaling
  const activeCalls = new Map();

  // Only one pending request (current version)
  let currentRequest = {
    accepted: false,
    student: null,
    tutor: null,
  };

  wss.on("connection", (ws) => {
     console.log("New websocket connection");

    // Remove disconnected sockets
    ws.on("close", () => {
      if (ws.role === "student") students.delete(ws);
      if (ws.role === "tutor") tutors.delete(ws);

      activeCalls.delete(ws);
    });

    ws.on("message", (data) => {

      const msg = JSON.parse(data);

      // Register Student
      if (msg.type === "student") {
        students.add(ws);
        ws.role = "student";
        return;
      }

      // Register Tutor
      if (msg.type === "tutor") {
        tutors.add(ws);
        ws.role = "tutor";
        console.log("Tutor connected");
    console.log("Total tutors:", tutors.size);
        return;
      }

      // ===========================
      // Student requests tutor
      // ===========================
      if (msg.type === "request_tutor") {
         console.log("Broadcasting to", tutors.size, "tutors");

        currentRequest = {
          accepted: false,
          student: ws,
          tutor: null,
        };

        tutors.forEach((tutorSocket) => {
           console.log("Sending request to tutor");

          if (tutorSocket.readyState === WebSocket.OPEN) {

            tutorSocket.send(
              JSON.stringify({
                type: "incoming_request",
                title: msg.title,
                description: msg.description,
              })
            );

          }

        });

        return;
      }

      // ===========================
      // Tutor accepts
      // ===========================
      if (msg.type === "accept") {

        if (currentRequest.accepted) {

          ws.send(
            JSON.stringify({
              type: "alreadyAccepted",
            })
          );

          return;
        }

        currentRequest.accepted = true;
        currentRequest.tutor = ws;

        // Save Student <-> Tutor mapping
        activeCalls.set(currentRequest.student, ws);
        activeCalls.set(ws, currentRequest.student);

        currentRequest.student.send(
          JSON.stringify({
            type: "accepted",
          })
        );

        // Tell remaining tutors to hide popup
        tutors.forEach((tutorSocket) => {

          if (
            tutorSocket !== ws &&
            tutorSocket.readyState === WebSocket.OPEN
          ) {

            tutorSocket.send(
              JSON.stringify({
                type: "request_taken",
              })
            );

          }

        });

        return;
      }

      // ===========================
      // WebRTC Signaling
      // ===========================
      if (
        msg.type === "offer" ||
        msg.type === "answer" ||
        msg.type === "iceCandidate"
      ) {

        const peer = activeCalls.get(ws);

        if (peer && peer.readyState === WebSocket.OPEN) {

          peer.send(JSON.stringify(msg));

        }

      }

    });

  });

};