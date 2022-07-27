import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../firebase";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedDialogs from "../components/CustomizedDialogs";

const Camera = () => {
  const webRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [photoCheck, setPhotoCheck] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);

  const showImage = async () => {
    setUploadLoader(true);
    const imageRef = ref(storage, `photos/${v4()}.jpg`);

    await uploadString(
      imageRef,
      webRef.current.getScreenshot(),
      "data_url"
    ).then((res) => {
      console.log("file uploaded to firebase!");
      getDownloadURL(imageRef)
        .then((url) => setImageUrl(url))
        .finally(() => {
          setUploadLoader(false);
          setPhotoCheck(true);
        });
    });
  };

  return (
    <div className="cam">
      {uploadLoader ? (
        <CircularProgress />
      ) : (
        <>
          <Webcam
            ref={webRef}
            className="camera"
            audio={false}
            height={500}
            screenshotFormat="image/jpeg"
            width={500}
          />
          <CameraAltIcon
            className="camera-icon"
            onClick={showImage}
            color="primary"
          />
        </>
      )}

      {photoCheck && !uploadLoader && (
        <CustomizedDialogs
          fileCheck={photoCheck}
          selectedFile={imageUrl}
          setFileCheck={setPhotoCheck}
          videoFile={false}
        />
      )}
    </div>
  );
};

export default Camera;
