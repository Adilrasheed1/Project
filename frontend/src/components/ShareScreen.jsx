export const ShareScreen = async () => {
   try {
       
       const screenStream = await navigator.mediaDevices.getDisplayMedia({
           video: { cursor: "always" },
           audio: false
       });
      
       const screenTrack = screenStream.getVideoTracks()[0];
       const sender = peerConnection.getSenders().find(s => s.track.kind === "video");
       if (sender) sender.replaceTrack(screenTrack);
       console.log("Screen sharing started");
   } catch (error) {
       console.error("Error starting screen sharing:", error);
   }
};