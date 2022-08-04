import React, { FC, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useReactMediaRecorder } from "react-media-recorder";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useStopwatch } from "react-timer-hook";
import Button from "@mui/material/Button";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SyncIcon from "@mui/icons-material/Sync";
import CircularProgress from "@mui/material/CircularProgress";
import { storage } from "../firebase";
import CustomizedDialogs from "../components/CustomizedDialogs";
import "../App.css";

const HEIGHT = 498;
const WIDTH = 498;

const VideoRecorder: FC = () => {
  const [startRecorder, setStartRecorder] = useState<boolean>(false);
  const [stopRecorder, setStopRecorder] = useState<boolean>(false);
  const [previewVideo, setPreviewVideo] = useState<boolean>(false);
  const [videoCheck, setVideoCheck] = useState<boolean>(false);
  const [havePermissions, setHavePermissions] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const videoRef = useRef() as React.MutableRefObject<Webcam>;

  const {
    seconds,
    minutes,
    start: startTimer,
    pause: stopTimer,
    reset: resetTimer,
  } = useStopwatch({ autoStart: false });

  const handleStopRecording = async (blobUrl: string) => {
    setStopRecorder(true);
    stopTimer();

    let video = videoRef.current.video?.srcObject as MediaStream;
    video.getTracks()[0].stop();

    const videoBlob = await fetch(blobUrl).then((r) => r.blob());

    const videoFile = new File([videoBlob], `${v4()}.${"mp4"}`, {
      type: "video/mp4",
    });

    setSelectedFile(videoFile);
  };

  //reuseable

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: true,
      onStop: (blobUrl) => {
        handleStopRecording(blobUrl);
      },
    });

  const handleStartRecording = () => {
    startRecording();
    startTimer();

    setStartRecorder(true);
  };

  const uploadToFirebase = async () => {
    setStartRecorder(false);
    setStopRecorder(false);
    resetTimer(undefined, false);
    setUploading(true);

    const videoRef = ref(storage, `videos/${selectedFile.name}`);

    await uploadBytes(videoRef, selectedFile)
      .then(() => {
        console.log("file uploaded successfully");
      })
      .catch(() => console.log("File failed to upload!"));

    await getDownloadURL(videoRef)
      .then((url) => {
        setVideoUrl(url);
      })
      .catch(() => console.log("failed to get url!"));

    setUploading(false);
    setVideoCheck(true);
  };

  const renderSwitch = (status: string) => {
    switch (status) {
      case "idle":
        return (
          <>
            <p>Recording not Started!</p>
            <NotStartedIcon color="action" />
          </>
        );
      case "recording":
        return (
          <>
            <p>Recording!</p>
            <StopCircleIcon color="success" />
          </>
        );
      case "stopped":
        return (
          <>
            <p>Stopped!</p>
            <PlayCircleIcon color="secondary" />
          </>
        );
      case "acquiring_media":
        return (
          <>
            <p>Starting!</p>
            <SyncIcon color="primary" />
          </>
        );
      default:
        return "";
    }
  };

  useEffect(() => {
    const temp = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    temp
      .then(() => {
        console.log("Permissions given!");
        setHavePermissions(true);
      })
      .catch(() => {
        console.log("Permissions not given!");
        setHavePermissions(false);
      });
  }, []);

  return (
    <div className="app">
      {renderSwitch(status)}
      <div style={{ fontSize: "20px" }}>
        <span>{`${minutes} m `}</span>:<span>{` ${seconds} s`}</span>
      </div>
      {uploading ? (
        <CircularProgress />
      ) : (
        <>
          <div className="app-container">
            {previewVideo ? (
              <video
                className="app-video-feed"
                height={HEIGHT}
                width={WIDTH}
                src={mediaBlobUrl}
                controls
              />
            ) : (
              <Webcam
                className="app-video-feed"
                width={WIDTH}
                height={HEIGHT}
                ref={videoRef}
              />
            )}
          </div>
          <div className="app-input">
            {startRecorder ? (
              stopRecorder ? (
                previewVideo ? (
                  <Button
                    className="button-btn"
                    variant="contained"
                    onClick={() => {
                      setStartRecorder(false);
                      setPreviewVideo(false);
                      setStopRecorder(false);
                      resetTimer(undefined, false);
                    }}
                  >
                    Record Again?
                  </Button>
                ) : (
                  <Button
                    className="button-btn"
                    variant="contained"
                    onClick={() => {
                      setPreviewVideo(true);
                    }}
                  >
                    Preview
                  </Button>
                )
              ) : (
                <Button
                  className="button-btn"
                  variant="contained"
                  onClick={stopRecording}
                >
                  Stop
                </Button>
              )
            ) : (
              <Button
                className="button-btn"
                variant="contained"
                disabled={!havePermissions}
                onClick={handleStartRecording}
              >
                Start
              </Button>
            )}
          </div>
          <span>
            <Button
              className="button-btn"
              variant="contained"
              disabled={!stopRecorder}
              onClick={uploadToFirebase}
            >
              Share
            </Button>
          </span>
        </>
      )}
      {videoCheck && !uploading && (
        <CustomizedDialogs
          fileCheck={videoCheck}
          selectedFile={videoUrl}
          setFileCheck={setVideoCheck}
          isVideo={true}
        />
      )}
    </div>
  );
};

export default VideoRecorder;
