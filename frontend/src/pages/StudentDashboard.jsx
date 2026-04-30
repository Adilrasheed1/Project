import { useState ,useRef, useEffect} from "react";
import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";
import { Home, HelpCircle, FileText, BarChart } from "lucide-react";
import Exam from "../pages/exam";

export function StudentDashboard() {
const pcRef = useRef(null);
const [socket,setSocket]=useState();
  // ================================
  // ADIL'S 
  // ================================
 


  async function startCall(ws) {
   const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
      pcRef.current = pc;
      
 const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    ws.send(JSON.stringify({
      type: "offer",
      sdp: offer
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

      useEffect(()=>{
    const ws = new WebSocket('ws://localhost:8000');
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'student' }));
    };

   
  ws.onmessage = async (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === "accepted") startCall(ws);
    if (msg.type === "answer") await pcRef.current.setRemoteDescription(msg.sdp);
    if (msg.type === "iceCandidate") await pcRef.current.addIceCandidate(msg.candidate);
  }
   setSocket(ws);
  },[])

  // ================================
  // FOR STATE CHANGE
  // ================================
  const [section, setSection] = useState("home");
  const [selectedExam, setSelectedExam] = useState(null);

  // ================================
  //  EXAM FLOW
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
  // STUDENT DASHBOARD UI
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

      {/* MOBILE NAV */}
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