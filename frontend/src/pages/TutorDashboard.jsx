import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";


import { useEffect, useState } from "react";
import { TutorCentralContent } from "../components/TutorCentralContent";
export function TutorDashboard(){
   const [socket, setSocket] = useState(null);
  
    const [section, setSection] = useState("home");

  const [request, setRequest] = useState(null);
  
  useEffect(()=>{
     const ws=new WebSocket('ws://localhost:8000')
    console.log("connecting to wss")
  
   ws.onopen=()=>{
      ws.send(JSON.stringify({type:'tutor'}))
   }
   console.log("connected")

   ws.onmessage =async (event) => {
   console.log("MESSAGE RECEIVED:", event.data); 
  const msg = JSON.parse(event.data);
  console.log(msg)

  if (msg.type === "incoming_request") {
    alert("incoming request")
    setRequest(msg); // show popup
  }
   if (msg.type === "offer") {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  });

  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  pc.ontrack = (event) => {
    video.srcObject = event.streams[0];
  };

  await pc.setRemoteDescription(msg.sdp);

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  ws.send(JSON.stringify({
    type: "answer",
    sdp: answer
  }));

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      ws.send(JSON.stringify({
        type: "iceCandidate",
        candidate: e.candidate
      }));
    }
  };
}

};
setSocket(ws)
   },[])
    function  accept() {
  console.log("Accepted request:", request);
   socket?.send(JSON.stringify({ type: "accept" }));
  setRequest(null); 
 
}
   

       return <div className="grid grid-cols-5 bg-[#fcedf2] h-screen   ">
     <SideMenu title1='Home' title2="Sessions" title3="Courses" title4="MyStudents" title5="Tests"  classHome={section==='home' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" } onClickHome={()=> setSection("home")} onClickDoubts={() => setSection("doubts")} className="col-span-1 w-40 mt-8  ml-8 " classDoubts={section==='doubts' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" } onClickCourses={() => setSection("courses")} className="col-span-1 w-40 mt-8  ml-8 " classCourses={section==='courses' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" }/>
     
   <TutorCentralContent section={section}/>
      
          
       
   
     <ProfileSection/>
     {request && (
  <div>
    <h3>{request.title}</h3>
    <button onClick={accept}>Accept</button>
  </div>
)}
       </div>
}