export async function ShareScreen(pcRef, localVideoRef) {

  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });

  const screenTrack = screenStream.getVideoTracks()[0];

  const sender = pcRef.current
    .getSenders()
    .find(sender =>
      sender.track && sender.track.kind === "video"
    );

  if (sender) {
    await sender.replaceTrack(screenTrack);
  }

  if (localVideoRef.current) {
    localVideoRef.current.srcObject = screenStream;
  }

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