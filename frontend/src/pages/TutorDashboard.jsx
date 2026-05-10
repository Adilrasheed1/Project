import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";



import { useEffect, useRef, useState } from "react";
import { TutorCentralContent } from "../components/TutorCentralContent";
import { ButtonComp } from "../components/ButtonComp";
import { ShareScreen } from "../components/ShareScreen";
export function TutorDashboard(){
  const remoteVideoRef=useRef(null)
   const [socket, setSocket] = useState(null);
    const pcRef = useRef(null);
    const [section, setSection] = useState("home");
const [request , setRequest]=useState(null)
  const [incomingCall, setIncomingCall] = useState(false);
  const [inCall,setInCall]=useState(false);
  
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
   

       return <div className="grid grid-cols-5 bg-[#fcedf2] h-full relative  ">
     <SideMenu title1='Home' title2="Sessions" title3="Courses" title4="MyStudents" title5="Tests"  classHome={section==='home' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" } onClickHome={()=> setSection("home")} onClickDoubts={() => setSection("doubts")} className="col-span-1 fixed w-40 mt-8  ml-8 " classDoubts={section==='doubts' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" } onClickCourses={() => setSection("courses")} className="col-span-1 w-40 mt-8  ml-8 " classCourses={section==='courses' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" } onClickTest={()=>setSection("Test")}/>
     
   <TutorCentralContent section={section}/>
      
          
       
   
     <ProfileSection />
   {incomingCall && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <h2 className="text-lg font-semibold mb-4">Incoming Call</h2>
      
      <button
        onClick={() => accept()}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Accept
      </button>

      <button
        onClick={() => setIncomingCall(false)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Reject
      </button>
    </div>
  </div>
)}
{inCall && (
  <div className="fixed inset-0 flex flex-col justify-center items-center  bg-white z-50">
    <div className="bg-gray-200 h-120 w-180 flex flex-col items-center justify-center rounded-sm">
    <video
      ref={remoteVideoRef}
      autoPlay
      muted={false}
      playsInline
      className="w-[600px] h-[400px] bg-black rounded-xl shadow-lg"
    
    />
    <div className=" w-180 flex flex-row mt-2 justify-evenly">
      <ButtonComp title="share Screen" className="bg-gray-300 sm:w-10  " click={ShareScreen}/>
    <ButtonComp  click={() => setInCall(false)} title="End Call" className="bg-red-400 text-white " />
    </div>
    </div>
  </div>
)}
   
       </div>
}