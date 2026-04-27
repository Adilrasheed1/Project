
import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";


import { useState } from "react";

export function StudentDashboard(){
   const socket=new WebSocket('ws://localhost:8000')
   const [section, setSection] = useState("home");
   let pc;

async function startCall() {
  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });
  socket.onopen=()=>{
  socket.send(JSON.stringify({type:'student'}))
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  });

  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  socket.send(JSON.stringify({
    type: "offer",
    sdp: offer
  }));
console.log('sending')

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.send(JSON.stringify({
        type: "candidate",
        candidate: e.candidate
      }));
    }
  };
}
socket.onmessage = async (event) => {
  const msg = JSON.parse(event.data);
  console.log(msg.type)

  if (msg.type === "accepted") {
    startCall(); // 🔥 start WebRTC
  }

  if (msg.type === "answer") {
    await pc.setRemoteDescription(msg.sdp);
  }

  if (msg.type === "candidate") {
    await pc.addIceCandidate(msg.candidate);
  }
};


    return <div className="grid grid-cols-5 bg-[#fcedf2] h-screen   ">
  <SideMenu title1="Home" title2='DoubtSection' title3="Courses" title4='Tests' title5='Progress' classHome={section==='home' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" } onClickHome={()=> setSection("home")} onClickDoubts={() => setSection("doubts")} className="col-span-1 w-40 mt-8  ml-8 " classDoubts={section==='doubts' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" }/>
  
<CentralContent section={section}/>
   
       
    

  <ProfileSection/>
    </div>
}