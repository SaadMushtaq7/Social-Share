import React, { FC, useRef, useState } from "react";
import Webcam from "react-webcam";
import { v4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import Button from "@mui/material/Button";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedDialogs from "../components/CustomizedDialogs";
import "../App.css";

const Camera: FC = () => {
  const webRef = useRef<any | null>(null);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageBlob, setImageBlob] = useState<string>("");
  const [imageClicked, setImageClicked] = useState<boolean>(false);
  const [photoCheck, setPhotoCheck] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const uploadToFirebase = async () => {
    setUploading(true);
    const imageRef = ref(storage, `photos/${v4()}.jpg`);

    await uploadString(imageRef, imageBlob, "data_url").then(() => {
      console.log("file uploaded to firebase!");
      getDownloadURL(imageRef)
        .then((url: string) => {
          setImageUrl(url);
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            const blob = xhr.response;
            console.log(blob);
          };
          //xhr.open("GET", url);
          //xhr.send();
        })
        .catch(() => {
          console.log("Error uploading file!");
        })
        .finally(() => {
          setUploading(false);
          setPhotoCheck(true);
        });
    });
  };

  return (
    <div className="cam">
      {uploading ? (
        <CircularProgress />
      ) : imageClicked ? (
        <>
          <h1>Preview</h1>
          <img
            className="camera-preview"
            width={500}
            height={500}
            alt="clicked"
            src={imageBlob}
          />
          <Button
            className="cam-button-btn"
            variant="contained"
            onClick={uploadToFirebase}
          >
            Share
          </Button>
          <Button
            className="cam-button-btn"
            variant="contained"
            onClick={() => setImageClicked(false)}
          >
            Click Again?
          </Button>
        </>
      ) : (
        <>
          <h1>Take Picture</h1>
          <Webcam
            className="camera"
            width={500}
            height={500}
            ref={webRef}
            audio={false}
            screenshotFormat="image/jpeg"
          />
          <CameraAltIcon
            className="camera-icon"
            color="primary"
            onClick={() => {
              setImageClicked(true);
              setImageBlob(webRef.current.getScreenshot());
            }}
          />
        </>
      )}

      {photoCheck && !uploading && (
        <CustomizedDialogs
          fileCheck={photoCheck}
          selectedFile={imageUrl}
          setFileCheck={setPhotoCheck}
          isVideo={false}
          setPreviewFile={setImageClicked}
        />
      )}
    </div>
  );
};

export default Camera;
