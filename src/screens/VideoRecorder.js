import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import Button from "@mui/material/Button";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SyncIcon from "@mui/icons-material/Sync";
import CircularProgress from "@mui/material/CircularProgress";
import { storage } from "../firebase";
import CustomizedDialogs from "../components/CustomizedDialogs";
import "../App.css";

const VideoRecorder = () => {
  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    video: {
      width: { exact: 480, ideal: 480 },
      height: { exact: 640, ideal: 640 },
      aspectRatio: { exact: 0.7500000001, ideal: 0.7500000001 },
      resizeMode: "crop-and-scale",
    },
    onStop: (blobUrl, blob) => {
      handleStopRecording(blobUrl, blob);
    },
  });

  const HEIGHT = 500;
  const WIDTH = 498;

  const [startRecorder, setStartRecorder] = useState(false);
  const [videoCheck, setVideoCheck] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploadLoader, setUploadLoader] = useState(false);

  const handleStartRecording = () => {
    startRecording();
    navigator.getUserMedia(
      {
        video: true,
      },
      (stream) => {
        let video = document.getElementsByClassName("app__videoFeed")[0];
        if (video) {
          video.srcObject = stream;
        }
      },
      (err) => console.error(err)
    );

    setStartRecorder(true);
  };

  const handleStopRecording = async (blobUrl, blob) => {
    let video = document.getElementsByClassName("app__videoFeed")[0];
    video.srcObject.getTracks()[0].stop();

    const videoBlob = await fetch(blobUrl).then((r) => r.blob());

    const videoFile = new File([videoBlob], `${v4()}.${"mp4"}`, {
      type: "video/mp4",
    });

    setSelectedFile(videoFile);
  };

  const uploadToFirebase = async () => {
    setUploadLoader(true);
    setStartRecorder(false);
    const videoRef = ref(storage, `videos/${selectedFile.name}`);

    await uploadBytes(videoRef, selectedFile).then((snapshot) => {});

    await getDownloadURL(videoRef).then((url) => {
      setVideoUrl(url);
    });
    setUploadLoader(false);
    setVideoCheck(true);
  };

  return (
    <div className="app">
      {status === "idle" && (
        <>
          <p>Recording not Started!</p>
          <NotStartedIcon color="action" />
        </>
      )}
      {status === "recording" && (
        <>
          <p>Recording!</p>
          <StopCircleIcon color="success" />
        </>
      )}
      {status === "stopped" && (
        <>
          <p>Stopped!</p>
          <PlayCircleIcon color="secondary" />
        </>
      )}
      {status === "acquiring_media" && (
        <>
          <p>Starting!</p>
          <SyncIcon color="primary" />
        </>
      )}
      {uploadLoader && <CircularProgress />}
      {!uploadLoader && (
        <>
          <div className="app__container">
            <video
              height={HEIGHT}
              width={WIDTH}
              autoPlay
              className="app__videoFeed"
            />
          </div>
          <div className="app__input">
            {startRecorder && (
              <Button
                className="button-btn"
                onClick={stopRecording}
                variant="contained"
              >
                Stop
              </Button>
            )}{" "}
            {!startRecorder && (
              <Button
                className="button-btn"
                onClick={handleStartRecording}
                variant="contained"
              >
                Start
              </Button>
            )}
          </div>
          <span>
            <Button
              disabled={!(status === "stopped")}
              className="button-btn"
              onClick={uploadToFirebase}
              variant="contained"
            >
              Share
            </Button>
          </span>
        </>
      )}
      {videoCheck && !uploadLoader && (
        <CustomizedDialogs
          fileCheck={videoCheck}
          selectedFile={videoUrl}
          setFileCheck={setVideoCheck}
          videoFile={true}
        />
      )}
    </div>
  );
};

export default VideoRecorder;
