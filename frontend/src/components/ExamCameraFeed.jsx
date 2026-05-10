import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function ExamCameraFeed({ onViolation }) {

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  // ─── GRACE PERIOD COUNTERS ────────────────────────
  // Only deduct after 2 consecutive failed checks
  const noFaceCount = useRef(0);
  const multiFaceCount = useRef(0);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState(null);

  // ─── LOAD MODEL + START CAMERA ────────────────────
  useEffect(() => {

    const init = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        setModelLoaded(true);

        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: "user",
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }

      } catch (err) {
        console.error("Camera or model error:", err);
        setError("Camera access denied or model failed to load.");
      }
    };

    init();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

  }, []);

  // ─── DETECTION LOOP ───────────────────────────────
  useEffect(() => {
    if (!modelLoaded) return;

    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;

      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        // ── NO FACE ──────────────────────────────────
        if (detections.length === 0) {
          noFaceCount.current++;
          multiFaceCount.current = 0; // reset other counter

          if (noFaceCount.current >= 2) {
            onViolation("No Face Detected", 5);
            noFaceCount.current = 0; // reset after deducting
          }

        // ── MULTIPLE FACES ────────────────────────────
        } else if (detections.length > 1) {
          multiFaceCount.current++;
          noFaceCount.current = 0; // reset other counter

          if (multiFaceCount.current >= 2) {
            onViolation("Multiple Faces Detected", 5);
            multiFaceCount.current = 0; // reset after deducting
          }

        // ── NORMAL — one face ─────────────────────────
        } else {
          // everything fine, reset both counters
          noFaceCount.current = 0;
          multiFaceCount.current = 0;
        }

      } catch (err) {
        console.error("Detection error:", err);
      }

    }, 3000);

    return () => clearInterval(intervalRef.current);

  }, [modelLoaded]);

  // ─── UI ───────────────────────────────────────────
  return (
    <div className="relative">

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-40 object-cover rounded-xl bg-black"
      />

      {!modelLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-xl">
          <p className="text-white text-xs">Loading camera...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-xl">
          <p className="text-red-400 text-xs text-center px-2">{error}</p>
        </div>
      )}

    </div>
  );
}

export default ExamCameraFeed;