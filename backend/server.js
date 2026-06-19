const { WebSocketServer } = require("ws");

module.exports = function(server) {
  const wss = new WebSocketServer({ server });

  const tutors = new Set(); 
  let student = null;

  wss.on("connection", (ws) => {

    ws.on("message", (data) => {
      const msg = JSON.parse(data);

     
      if (msg.type === "student") student = ws;
      if (msg.type === "tutor") tutors.add(ws); 
      

      if (msg.type === "request_tutor") {
        tutors.forEach(tutorWs => {
          if (tutorWs.readyState === WebSocketServer.OPEN) {
            tutorWs.send(JSON.stringify({
              type: "incoming_request",
              title: msg.title,
              description: msg.description,
              image: msg.image
            }));
          }
        });
      }

     
      if (msg.type === "accept") {
        ws.isAcceptedTutor = true; 
        student?.send(JSON.stringify({ type: "accepted" }));
      }

     
      const acceptedTutor = [...tutors].find(t => t.isAcceptedTutor);

      if (msg.type === "offer") acceptedTutor?.send(JSON.stringify(msg));
      if (msg.type === "answer") student?.send(JSON.stringify(msg));
      if (msg.type === "iceCandidate") {
        if (ws === student) acceptedTutor?.send(JSON.stringify(msg));
        else student?.send(JSON.stringify(msg));
      }
    });

 
    ws.on("close", () => {
      tutors.delete(ws);
    });
  });
};