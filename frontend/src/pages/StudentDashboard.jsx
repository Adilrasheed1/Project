import { useState } from "react";
import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";
import { Home, HelpCircle, FileText, BarChart } from "lucide-react";
import Exam from "../pages/exam";

export function StudentDashboard() {

  // ================================
  // ADIL'S (DO NOT TOUCH)
  // ================================
  const socket = new WebSocket('ws://localhost:8000');
  let pc;

  async function startCall() {
    pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'student' }));
    };

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

    if (msg.type === "accepted") startCall();
    if (msg.type === "answer") await pc.setRemoteDescription(msg.sdp);
    if (msg.type === "candidate") await pc.addIceCandidate(msg.candidate);
  };

  // ================================
  // YOUR STATE
  // ================================
  const [section, setSection] = useState("home");
  const [selectedExam, setSelectedExam] = useState(null);

  // ================================
  // YOUR EXAM FLOW
  // ================================
  if (selectedExam) {
    return (
      <div className="h-screen w-full bg-white">
        <Exam
          exam={selectedExam}
          onBack={() => setSelectedExam(null)}
        />
      </div>
    );
  }

  // ================================
  // YOUR UI
  // ================================
  return (
    <div className="h-screen w-full bg-white flex overflow-hidden">

      {/* SIDEBAR */}
      <div className="hidden md:flex w-[120px]">
        <SideMenu
          section={section}
          onClickHome={() => setSection("home")}
          onClickDoubts={() => setSection("doubts")}
          onClickCourses={() => setSection("Courses")}
          onClickTest={() => setSection("Test")}
          onClickProgress={() => setSection("Progress")}
        />
      </div>

      {/* MAIN */}
      <CentralContent
        section={section}
        setSelectedExam={setSelectedExam}
        className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden px-3 sm:px-6 md:px-8"
      />

      {/* RIGHT */}
      <div className="hidden lg:flex w-[260px] justify-center items-center">
        <ProfileSection />
      </div>

      {/* MOBILE NAV (YOUR VERSION KEPT) */}
      <div className="fixed bottom-2 w-full flex justify-center md:hidden">
        <div className="bg-[#eeeff1] rounded-2xl w-[92%] py-3 px-2 flex justify-evenly shadow-xl">

          <button onClick={() => setSection("home")} className="flex flex-col items-center gap-1">
            <div className={`h-12 w-12 flex items-center justify-center rounded-full shadow-md ${
              section === "home" ? "bg-[#F64515] text-white" : "bg-white"
            }`}>
              <Home size={20} />
            </div>
            <span className={`text-xs ${section === "home" ? "text-[#F64515]" : ""}`}>Home</span>
          </button>

          <button onClick={() => setSection("doubts")} className="flex flex-col items-center gap-1">
            <div className={`h-12 w-12 flex items-center justify-center rounded-full shadow-md ${
              section === "doubts" ? "bg-[#F64515] text-white" : "bg-white"
            }`}>
              <HelpCircle size={20} />
            </div>
            <span className={`text-xs ${section === "doubts" ? "text-[#F64515]" : ""}`}>Doubts</span>
          </button>

          <button onClick={() => setSection("Test")} className="flex flex-col items-center gap-1">
            <div className={`h-12 w-12 flex items-center justify-center rounded-full shadow-md ${
              section === "Test" ? "bg-[#F64515] text-white" : "bg-white"
            }`}>
              <FileText size={20} />
            </div>
            <span className={`text-xs ${section === "Test" ? "text-[#F64515]" : ""}`}>Tests</span>
          </button>

          <button onClick={() => setSection("Progress")} className="flex flex-col items-center gap-1">
            <div className={`h-12 w-12 flex items-center justify-center rounded-full shadow-md ${
              section === "Progress" ? "bg-[#F64515] text-white" : "bg-white"
            }`}>
              <BarChart size={20} />
            </div>
            <span className={`text-xs ${section === "Progress" ? "text-[#F64515]" : ""}`}>Progress</span>
          </button>

        </div>
      </div>

    </div>
  );
}