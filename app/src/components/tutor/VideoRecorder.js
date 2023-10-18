import React, { useState, useEffect, useRef } from "react";

const VideoRecorder = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    // Acquire media stream with audio and video
    if ("MediaRecorder" in window) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          setMediaStream(stream);
          videoRef.current.srcObject = stream;
        })
        .catch((error) =>
          console.error("Error accessing media devices:", error)
        );
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  }, []);

  const startRecording = () => {
    if (mediaStream) {
      const recorder = new MediaRecorder(mediaStream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks([...recordedChunks, event.data]);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const videoURL = URL.createObjectURL(blob);
        videoRef.current.src = videoURL;
        setMediaRecorder(null);
        setRecordedChunks([]);
      };
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h2>Video Recorder with Audio</h2>
      <video
        ref={videoRef}
        autoPlay
        controls
        muted
        playsInline
        style={{ maxWidth: "100%" }}
      />
      {isRecording ? (
        <button type="button" onClick={stopRecording}>
          Stop Recording
        </button>
      ) : (
        <button type="button" onClick={startRecording}>
          Start Recording
        </button>
      )}
    </div>
  );
};

export default VideoRecorder;
