import { InputCompo } from "./InputCompo";
import { ButtonComp } from "./ButtonComp";
import { useState } from "react";
import { useEffect } from "react";
import { VideoComponent } from "./VideoComponent";
import { useRef } from "react";
export function DoubtForm(){
    const [inCall, setInCall] = useState(false);
    const videoRef = useRef(null);
    const pcRef = useRef(null);
    const remoteVideoRef = useRef(null);
   
  const [socket, setSocket] = useState(null);

    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const[image,setImage]=useState("")
      useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("connected as student");
      ws.send(JSON.stringify({ type: "student" }));
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      // 🔥 tutor accepted
      if (msg.type === "accepted") {
        console.log("request Accepted")
        startWebRTC(ws);
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
async function startWebRTC(socket) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });
  pcRef.current = pc; 
  

  
  setInCall(true);
  console.log(inCall)

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  });
  if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    
    

  // send video
  stream.getTracks().forEach(track => {
    pc.addTrack(track, stream);
  });
  
   console.log("start receiving")
  // receive tutor video
pc.ontrack = (event) => {
console.log("TRACK RECEIVED 🔥", event.streams);
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = event.streams[0];
  }
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
    return <div className="h-120 bg-[#d1dbd0] w-150  mx-5 my-5 rounded-lg border-1 border-gray-200 pt-5 pl-5 ">
        {!inCall &&( 
         
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
         fetch("http://localhost:3000/doubts/DoubtSection", {
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
    }} title="Connect To Tutor" className={"bg-gray-200 text-gray-700 border-1 border-gray-200 mt-5 ml-3 hover:bg-blue-500 hover:text-white"} />
    </>)}
    {inCall && (
        <div>
         <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-64 h-40 bg-black"
      />
     <video
  ref={remoteVideoRef}
  autoPlay
  playsInline
  className="w-64 h-40 object-cover"
/> </div>
    )}
    </div>

}