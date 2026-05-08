import { useEffect, useRef } from "react";

function ExamCameraFeed() {

  // Reference to video element
  const videoRef = useRef(null);

  // Reference to media stream
  const streamRef = useRef(null);

  useEffect(() => {

  const startCamera = async () => {
    try {

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

    } catch (error) {
      console.log("Camera access denied:", error);
    }
  };

  console.log("Camera component mounted");

  startCamera();

 return () => {

  console.log("Camera component unmounted");

  if (streamRef.current) {

            streamRef.current.getTracks().forEach((track) => {
            track.stop();
            });

            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        };

        }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-40 object-cover rounded-xl bg-black"
    />
  );
}

export default ExamCameraFeed;