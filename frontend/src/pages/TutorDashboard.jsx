import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";



import { useEffect, useRef, useState } from "react";
import { TutorCentralContent } from "../components/TutorCentralContent";
import { ButtonComp } from "../components/ButtonComp";
import { ShareScreen } from "../components/ShareScreen";
export function TutorDashboard(){
  const localVideoRef=useRef(null)
  const remoteVideoRef=useRef(null)
   const [socket, setSocket] = useState(null);
    const pcRef = useRef(null);
    const [section, setSection] = useState("home");
const [request , setRequest]=useState(null)
  const [incomingCall, setIncomingCall] = useState(false);
  const [inCall,setInCall]=useState(false);
  
  useEffect(()=>{
     const ws=new WebSocket('wss://project-3-7kx1.onrender.com')
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
     setIncomingCall(true)

  }
  if (msg.type === "iceCandidate") {
  if (pcRef.current) {
    await pcRef.current.addIceCandidate(msg.candidate);
  }
}
   if (msg.type === "offer") {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });
  pcRef.current=pc;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = stream;
  }

  stream.getTracks().forEach(track => pc.addTrack(track, stream));

 

  

   pc.ontrack = (event) => {
  console.log("REMOTE STREAM RECEIVED");

  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = event.streams[0];
  }
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
  setInCall(true)
 
}
   

  

const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 1024);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

return (
  <div className="bg-[#fcedf2] min-h-screen relative">


    <SideMenu
      section={section}
      isMobile={isMobile}
      onClickHome={() => setSection("home")}
      onClickDoubts={() => setSection("doubts")}
      onClickCourses={() => setSection("courses")}
      onClickTest={() => setSection("Test")}
      onClickProgress={() => setSection("Progress")}
    />


    <div className={`flex flex-col lg:flex-row transition-all duration-200
      ${isMobile ? "pb-16" : "ml-44"}`}>


      <div className="flex-1">
        <TutorCentralContent section={section} />
      </div>

  
      <div className="hidden lg:block w-64 shrink-0">
        <ProfileSection />
      </div>
    </div>


    {incomingCall && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center mx-4 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Incoming Call</h2>
          <button onClick={() => accept()} className="bg-green-500 text-white px-6 py-2 rounded mr-2">
            Accept
          </button>
          <button onClick={() => setIncomingCall(false)} className="bg-red-500 text-white px-6 py-2 rounded">
            Reject
          </button>
        </div>
      </div>
    )}


    {inCall && (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50 p-4">
        <div className="bg-gray-200 w-full max-w-3xl flex flex-col items-center rounded-lg p-4 gap-4">
          <video
            ref={localVideoRef}
            autoPlay muted={false} playsInline
            className="absolute top-4 right-4 sm:top-8 sm:right-8
              w-24 sm:w-36 md:w-48
              aspect-video object-cover
              rounded-xl border-2 border-white shadow-2xl z-50"
          />
          <video
            ref={remoteVideoRef}
            autoPlay muted={false} playsInline
            className="w-full max-w-2xl aspect-video bg-black rounded-xl shadow-lg"
          />
          <div className="w-full flex flex-row justify-evenly mt-2">
            <ButtonComp title="Share Screen" className="bg-gray-300" click={ShareScreen} />
            <ButtonComp click={() => setInCall(false)} title="End Call" className="bg-red-400 text-white" />
          </div>
        </div>
      </div>
    )}

  </div>
) }