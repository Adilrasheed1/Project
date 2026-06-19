import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";
import { useEffect, useRef, useState } from "react";
import { TutorCentralContent } from "../components/TutorCentralContent";
import { ButtonComp } from "../components/ButtonComp";
import { ShareScreen } from "../components/ShareScreen";
import SessionCalendar from "../components/SessionCalendar";
import { PendingDoubts } from "../components/PendingDoubts";

export function TutorDashboard() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const pcRef = useRef(null);
  const [section, setSection] = useState("home");
  const [request, setRequest] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [inCall, setInCall] = useState(false);
  const pendingCandidates = useRef([]);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('wss://project-3-7kx1.onrender.com');
    console.log("connecting to wss");

    ws.onopen = () => { ws.send(JSON.stringify({ type: 'tutor' })); };
    console.log("connected");

    ws.onmessage = async (event) => {
      console.log("MESSAGE RECEIVED:", event.data);
      const msg = JSON.parse(event.data);
      console.log(msg);

      if (msg.type === "incoming_request") { setIncomingCall(true); }

      if (msg.type === "iceCandidate" && msg.candidate) {
        if (pcRef.current && pcRef.current.remoteDescription) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
            console.log("ICE candidate added");
          } catch (err) { console.error("ICE ERROR:", err); }
        } else {
          console.log("Queueing ICE candidate");
          pendingCandidates.current.push(msg.candidate);
        }
      }

      if (msg.type === "offer") {
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
            {
              urls: ["turn:192.158.29.39:3478?transport=udp", "turn:192.158.29.39:3478?transport=tcp"],
              username: "28224511:1379330808",
              credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
            },
          ],
        });
        pcRef.current = pc;

        pc.onicecandidate = (e) => {
          if (e.candidate) { ws.send(JSON.stringify({ type: "iceCandidate", candidate: e.candidate })); }
        };

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) { localVideoRef.current.srcObject = stream; }
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          console.log("REMOTE STREAM RECEIVED");
          if (remoteVideoRef.current) { remoteVideoRef.current.srcObject = event.streams[0]; }
        };

        await pc.setRemoteDescription(msg.sdp);
        for (const candidate of pendingCandidates.current) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("Queued ICE added");
          } catch (err) { console.error("Queued ICE error:", err); }
        }
        pendingCandidates.current = [];
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: "answer", sdp: answer }));
      }
    };

    setSocket(ws);
  }, []);

 
  useEffect(() => {
    if (inCall) {
      setCallDuration(0);
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [inCall]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  function accept() {
    console.log("Accepted request:", request);
    socket?.send(JSON.stringify({ type: "accept" }));
    setRequest(null);
    setInCall(true);
  }

  function toggleMute() {
    if (localVideoRef.current?.srcObject) {
      const track = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (track) { track.enabled = !track.enabled; setMuted(m => !m); }
    }
  }

  function toggleCam() {
    if (localVideoRef.current?.srcObject) {
      const track = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (track) { track.enabled = !track.enabled; setCamOff(c => !c); }
    }
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen relative">

      <SideMenu
        section={section}
        isMobile={isMobile}
        onClickHome={() => setSection("home")}
        onClickDoubts={() => setSection("doubts")}
        onClickCourses={() => setSection("courses")}
        onClickTest={() => setSection("Test")}
        onClickProgress={() => setSection("Progress")}
      />

      <div className={`flex flex-col lg:flex-row transition-all duration-200 ${isMobile ? "pb-16" : "ml-44"}`}>
        <div className="flex-1 min-w-0">
          <TutorCentralContent section={section} />
        </div>
        <div className="hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto w-64 bg-white border-l border-gray-200 shrink-0">
          <SessionCalendar />
          <PendingDoubts />
        </div>
      </div>

      
      {incomingCall && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <h2 className="text-base font-medium text-gray-800 mb-1">Incoming doubt session</h2>
            <p className="text-sm text-gray-500 mb-6">A student is requesting help right now</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIncomingCall(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Reject
              </button>
              <button
                onClick={() => { accept(); setIncomingCall(false); }}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 text-sm text-white font-medium hover:bg-orange-600 transition"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

    {inCall && (
  <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">

  
    <div className="flex-none flex items-center justify-between px-4 py-3 bg-[#1a1a1a]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium">
          ST
        </div>
        <div>
          <p className="text-sm font-medium text-gray-100">Doubt session</p>
          <p className="text-xs text-gray-400">DSA · Quicksort</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950 border border-red-800 rounded-md px-2 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
          Live
        </span>
        <span className="text-sm text-gray-400 tabular-nums">{formatTime(callDuration)}</span>
      </div>
    </div>


    <div className="relative flex-1 min-h-0 bg-[#111]">
      
     
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg z-10">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
        </svg>
        Student
      </div>

    
      <div className="absolute top-3 right-3 z-20 rounded-xl overflow-hidden border-2 border-gray-600 w-24 sm:w-32 md:w-40 shadow-xl">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full aspect-video object-cover bg-gray-800 block"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-white text-[10px] py-0.5">
          You
        </div>
      </div>
    </div>

  
    <div className="flex-none bg-[#1a1a1a] px-6 py-4 flex items-center justify-center gap-4">
      
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={toggleMute}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition
            ${muted ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#2a2a2a] border-gray-600 text-gray-300 hover:border-gray-400'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {muted
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
              : <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
            }
          </svg>
        </button>
        <span className="text-[10px] text-gray-500">{muted ? 'Unmute' : 'Mute'}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          onClick={toggleCam}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition
            ${camOff ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#2a2a2a] border-gray-600 text-gray-300 hover:border-gray-400'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </button>
        <span className="text-[10px] text-gray-500">Camera</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => ShareScreen(pcRef, localVideoRef)}
          className="w-11 h-11 rounded-full bg-[#2a2a2a] border border-gray-600 text-gray-300 hover:border-gray-400 flex items-center justify-center transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </button>
        <span className="text-[10px] text-gray-500">Share</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setInCall(false)}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a16.003 16.003 0 0114 0 1 1 0 01.188 1.384l-2.76 3.612a1 1 0 01-1.21.29l-2.833-1.416a11.042 11.042 0 00-4.77 4.77l-1.416 2.834a1 1 0 01-.29 1.21L2.616 18.81A1 1 0 011.23 18.62 16.003 16.003 0 015 3z"/>
          </svg>
        </button>
        <span className="text-[10px] text-red-400">End call</span>
      </div>

    </div>
  </div>
)}

    </div>
  );
}