import { InputCompo } from "./InputCompo";
import { ButtonComp } from "./ButtonComp";
import { useState, useEffect, useRef } from "react";

export function DoubtForm({ setInCall }) {
  const pcRef = useRef(null);
  const pendingCandidates = useRef([]);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [socket, setSocket] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [finding, setFinding] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("wss://project-3-7kx1.onrender.com");
    ws.onopen = () => {
      console.log("connected as student");
      ws.send(JSON.stringify({ type: "student" }));
    };
    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "accepted") {
        console.log("request Accepted");
        await startWebRTC(ws);
        setShowVideo(true);
        setFinding(false);
      }
      if (msg.type === "answer") {
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        for (const candidate of pendingCandidates.current) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) { console.error("Queued ICE error:", err); }
        }
        pendingCandidates.current = [];
      }
      if (msg.type === "iceCandidate" && msg.candidate) {
        if (pcRef.current && pcRef.current.remoteDescription) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch (err) { console.error("ICE ERROR:", err); }
        } else {
          pendingCandidates.current.push(msg.candidate);
        }
      }
    };
    setSocket(ws);
  }, []);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream, showVideo]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, showVideo]);

  // call timer
  useEffect(() => {
    if (showVideo) {
      setCallDuration(0);
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [showVideo]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  function toggleMute() {
    if (videoRef.current?.srcObject) {
      const track = videoRef.current.srcObject.getAudioTracks()[0];
      if (track) { track.enabled = !track.enabled; setMuted(m => !m); }
    }
  }

  function toggleCam() {
    if (videoRef.current?.srcObject) {
      const track = videoRef.current.srcObject.getVideoTracks()[0];
      if (track) { track.enabled = !track.enabled; setCamOff(c => !c); }
    }
  }

  async function startWebRTC(socket) {
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
      if (e.candidate) {
        socket.send(JSON.stringify({ type: "iceCandidate", candidate: e.candidate }));
      }
    };
    setInCall(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    console.log("got local stream", stream);
    setLocalStream(stream);
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    pc.ontrack = (event) => {
      console.log("TRACK RECEIVED", event.streams);
      setRemoteStream(event.streams[0]);
    };
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: "offer", sdp: offer }));
  }

  return (
    <>
      {/* ── Doubt form ── */}
      {!showVideo && (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center px-4 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-lg p-6 shadow-sm">

            <h2 className="text-base font-medium text-gray-800 mb-1">Ask a doubt</h2>
            <p className="text-sm text-gray-400 mb-6">Fill in the details and connect to a tutor instantly</p>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Doubt title</label>
              <input
                type="text"
                placeholder="e.g. Quicksort with duplicate elements"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full h-10 px-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Detailed description</label>
              <textarea
                placeholder="Explain your doubt in detail..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-orange-400 focus:bg-white transition"
              />
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Subject</label>
              <select className="w-full h-10 px-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 appearance-none transition">
                <option value="">-- Choose subject --</option>
                <option value="Dsa">DSA</option>
                <option value="FullStack">Fullstack</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Attachment */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Attachment (optional)</label>
              <input
                type="file"
                value={image}
                onChange={e => setImage(e.target.value)}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition"
              />
            </div>

            {/* Submit */}
            <button
              onClick={() => {
                fetch("https://project-3-7kx1.onrender.com/doubts/DoubtSection", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title, description, image }),
                })
                  .then(async res => {
                    const json = await res.json();
                    if (!res.ok) { alert(json.msg || "doubt failed"); return; }
                  });
                socket.send(JSON.stringify({ type: "request_tutor", title, description, image }));
                setFinding(true);
              }}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              {finding ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Finding tutor...
                </>
              ) : (
                'Connect to tutor'
              )}
            </button>

          </div>
        </div>
      )}

      {/* ── Video call UI ── */}
      {showVideo && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">

          {/* Top bar */}
          <div className="flex-none flex items-center justify-between px-4 py-3 bg-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium">
                TU
              </div>
              <div>
                <p className="text-sm font-medium text-gray-100">Doubt session</p>
                <p className="text-xs text-gray-400">{title || 'DSA · Quicksort'}</p>
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

          {/* Video area */}
          <div className="relative flex-1 min-h-0 bg-[#111]">

            {/* Remote (tutor) video — fills container */}
            <video
              ref={remoteVideoRef}
              autoPlay
              muted={false}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Tutor name tag */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg z-10">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
              </svg>
              Tutor
            </div>

            {/* Self (local) video — PiP */}
            <div className="absolute top-3 right-3 z-20 rounded-xl overflow-hidden border-2 border-gray-600 w-24 sm:w-32 md:w-40 shadow-xl">
              <video
                ref={videoRef}
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

          {/* Controls */}
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
                onClick={() => { setShowVideo(false); setInCall(false); }}
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
    </>
  );
}