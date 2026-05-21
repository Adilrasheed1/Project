export async function ShareScreen(pcRef, localVideoRef) {

  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });

  const screenTrack = screenStream.getVideoTracks()[0];

  // Replace video track being sent to student
  const sender = pcRef.current
    .getSenders()
    .find(sender =>
      sender.track && sender.track.kind === "video"
    );

  if (sender) {
    await sender.replaceTrack(screenTrack);
  }

  // Update local preview
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = screenStream;
  }

  // When sharing stops, return to camera
  screenTrack.onended = async () => {

    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const cameraTrack = cameraStream.getVideoTracks()[0];

    const videoSender = pcRef.current
      .getSenders()
      .find(sender =>
        sender.track && sender.track.kind === "video"
      );

    if (videoSender) {
      await videoSender.replaceTrack(cameraTrack);
    }

    localVideoRef.current.srcObject = cameraStream;
  };
}