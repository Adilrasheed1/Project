import { useRef } from "react";

export function VideoComponent() {
  const videoRef = useRef(null);

  async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }

  return (
    <div>
      <button onClick={startVideo}>Start Video</button>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-64 h-40 bg-black"
      />
    </div>
  );
}