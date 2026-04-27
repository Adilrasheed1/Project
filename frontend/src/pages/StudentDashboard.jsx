import { useState } from "react";
import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";
import { Home, HelpCircle, FileText, BarChart } from "lucide-react";
import TestDashboard from "../components/TestDashboard";
import Exam from "../pages/exam";

export function StudentDashboard() {
  const [section, setSection] = useState("home");
  const [selectedExam, setSelectedExam] = useState(null);

  // FULL SCREEN EXAM MODE
  console.log("selectedExam:", selectedExam);
  if (selectedExam) {
    return (
      <div className="h-screen w-full bg-white">
        <Exam
          examName={selectedExam}
          onBack={() => setSelectedExam(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden">

      {/* LEFT SIDEBAR */}
      <div className="hidden md:flex w-[90px] justify-center items-center">
        <SideMenu
          section={section}
          onClickTest={() => setSection("Test")}
          onClickHome={() => setSection("home")}
          onClickDoubts={() => setSection("doubts")}
        />
      </div>

      {/* MAIN CONTENT */}
      <CentralContent
        section={section}
        setSelectedExam={setSelectedExam}   
        className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden px-3 sm:px-6 md:px-8"
      />

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex w-[260px] justify-center items-center">
        <ProfileSection />
      </div>

     {/* MOBILE NAV */}
<div className="fixed bottom-2 w-full flex justify-center md:hidden">
  <div className="bg-[#eeeff1] rounded-2xl w-[92%] py-3 px-2 flex justify-evenly shadow-xl">

    {/* HOME */}
    <button onClick={() => setSection("home")} className="flex flex-col items-center gap-1">
      <div className={`h-12 w-12 flex items-center justify-center rounded-full transition shadow-md ${
        section === "home"
          ? "bg-[#F64515] text-white"
          : "bg-white text-black"
      }`}>
        <Home size={20} />
      </div>
      <span className={`text-xs ${section === "home" ? "text-[#F64515]" : ""}`}>
        Home
      </span>
    </button>

    {/* DOUBTS */}
    <button onClick={() => setSection("doubts")} className="flex flex-col items-center gap-1">
      <div className={`h-12 w-12 flex items-center justify-center rounded-full transition shadow-md ${
        section === "doubts"
          ? "bg-[#F64515] text-white"
          : "bg-white text-black"
      }`}>
        <HelpCircle size={20} />
      </div>
      <span className={`text-xs ${section === "doubts" ? "text-[#F64515]" : ""}`}>
        Doubts
      </span>
    </button>

    {/* TESTS */}
    <button onClick={() => setSection("Test")} className="flex flex-col items-center gap-1">
      <div className={`h-12 w-12 flex items-center justify-center rounded-full transition shadow-md ${
        section === "Test"
          ? "bg-[#F64515] text-white"
          : "bg-white text-black"
      }`}>
        <FileText size={20} />
      </div>
      <span className={`text-xs ${section === "Test" ? "text-[#F64515]" : ""}`}>
        Tests
      </span>
    </button>

    {/* PROGRESS */}
    <button onClick={() => setSection("Progress")} className="flex flex-col items-center gap-1">
      <div className={`h-12 w-12 flex items-center justify-center rounded-full transition shadow-md ${
        section === "Progress"
          ? "bg-[#F64515] text-white"
          : "bg-white text-black"
      }`}>
        <BarChart size={20} />
      </div>
      <span className={`text-xs ${section === "Progress" ? "text-[#F64515]" : ""}`}>
        Progress
      </span>
    </button>

  </div>
</div>


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
   
       
    

    </div>
  );
}