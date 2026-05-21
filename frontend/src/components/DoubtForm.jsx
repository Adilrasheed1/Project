import { InputCompo } from "./InputCompo";
import { ButtonComp } from "./ButtonComp";
import { useState } from "react";
import { useEffect } from "react";
import { VideoComponent } from "./VideoComponent";
import { useRef } from "react";

export function DoubtForm({setInCall}){
 const pcRef = useRef(null);
    const [showVideo, setShowVideo] = useState(false);
     const videoRef = useRef(null);
     const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
const [remoteStream, setRemoteStream] = useState(null);
   
  const [socket, setSocket] = useState(null);

    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const[image,setImage]=useState("")
      useEffect(() => {
    const ws = new WebSocket("wss://project-3-7kx1.onrender.com");

    ws.onopen = () => {
      console.log("connected as student");
      ws.send(JSON.stringify({ type: "student" }));
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      // 🔥 tutor accepted
      if (msg.type === "accepted") {
        console.log("request Accepted")
         
         await startWebRTC(ws);
         setShowVideo(true);
        
        
      }

      // 🔥 answer from tutor
      if (msg.type === "answer") {
        await pcRef.current?.setRemoteDescription(msg.sdp);
        console.log("answer:",msg.sdp)
      }

      // 🔥 ICE
      if (msg.type === "iceCandidate") {
        await  pcRef.current?.addIceCandidate(msg.candidate);
        console.log("ice:",msg.candidate)
      }
    };

    setSocket(ws);
  }, []);
  useEffect(() => {

  if (videoRef.current && localStream) {

    console.log(videoRef.current);
    console.log("local stream:", localStream);

    videoRef.current.srcObject = localStream;

    console.log("local stream attached");
  }

}, [localStream, showVideo]);

useEffect(() => {

  if (remoteVideoRef.current && remoteStream) {


    remoteVideoRef.current.srcObject = remoteStream;

    console.log("remote stream attached");
  }

}, [remoteStream, showVideo]);
  
  async function startWebRTC(socket) {
    const pc = new RTCPeerConnection({
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "turn:192.158.29.39:3478?transport=udp",
      username: "28224511:1379330808",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
    },
  ],
});
    pcRef.current = pc; 
    
  
    
    setInCall(true);
   
  
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
    console.log("got local stream",stream);
   
      setLocalStream(stream);
  
    // send video
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });
    
     console.log("start receiving")
    // receive tutor video
  pc.ontrack = (event) => {
  console.log("TRACK RECEIVED 🔥", event.streams);
  setRemoteStream(event.streams[0]);
  };
  
    // create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  
    socket.send(JSON.stringify({
      type: "offer",
      sdp: offer
    }));
    
  
    // ICE
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.send(JSON.stringify({
          type: "iceCandidate",
          candidate: e.candidate
        }));
      }
    };
  }
    return (
    <>
    {!showVideo && (
     <div className="h-130 sm:h-120 bg-gray-100 w-80  sm:w-full mx-5 my-5  mt-10 rounded-lg border-1 border-gray-200 pt-5 pl-5 ">
    
         
        <>
        <InputCompo label="Doubt" Type="text"  className="w-80 h-10 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg  mb-5 " Placeholder="write the name of doubt" value={title} onchangemail={function(e){
            
                setTitle(e.target.value)

            }}/>
        <InputCompo label="Detailed Description" Type="text" className="w-80 h-20 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg " Placeholder="Explain your doubt in detail....." value={description} onchangemail={function(e){
                setDescription(e.target.value)
            }} />
           
            <h3 className="mt-5">select subject:</h3>
          
              <select className="w-80 h-10 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg  mb-5 " >
        <option value="">--Choose--</option>
        <option value="Dsa">DSA</option>
        <option value="FullStack">Fullstack</option>
        <option value="Other">other</option>
      </select>
     
        <InputCompo label="Attachments" Type="file" className="w-80 h-20 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg " Placeholder="choose image"value={image} onchangemail={function(e){
                setImage(e.target.value)
            }}/>
        <ButtonComp   click={ ()=>{
         fetch("https://project-3-7kx1.onrender.com/doubts/DoubtSection", {
          method: "POST",
           headers: {
           "Content-Type": "application/json"
      },
          body: JSON.stringify({
         title,
         description,
         image
      })
    })
       .then(async function(res) {
       const json=await res.json();
     
  if (!res.ok) {
      alert(json.msg || "doubt failed");
      return;
    }
  })
     socket.send(JSON.stringify({
      type: "request_tutor",
      title,
      description,
      image
    }));

   

    alert("Finding tutor...");
    }} title="Connect To Tutor" className={"bg-gray-200  text-gray-700 border-1 border-gray-200 mt-5 sm:ml-3 hover:bg-blue-500 hover:text-white"} />
    </>
 
         
    </div>
    )}
    {showVideo && (
   
        <div className="fixed inset-0 flex flex-col justify-center items-center  bg-white z-50">
           <div className="bg-gray-200 h-screen w-screen flex flex-col items-center justify-center rounded-sm">
           <video
             ref={videoRef}
             autoPlay
             muted={false}
             playsInline
             className="absolute
       top-80
       right-0
       sm:top-0
       sm:right-50
       w-40
       sm:w-52
       md:w-64
       aspect-video
       object-cover
       rounded-xl
       border-2
       border-white
       shadow-2xl
       z-50
       "
           
           />
           <video
             ref={remoteVideoRef}
             autoPlay
             muted={false}
             playsInline
             className="w-full h-screen bg-black rounded-xl shadow-lg"
           
           />
          
           </div>
         </div>
       )}
          

</>
    )
}