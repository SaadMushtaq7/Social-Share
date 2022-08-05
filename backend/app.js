const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { default: axios } = require("axios");
const { WebClient, LogLevel } = require("@slack/web-api");
const ffmpeg = require("fluent-ffmpeg");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const baseName = (str) => {
  let base = new String(str).substring(str.lastIndexOf("/") + 1);
  if (base.lastIndexOf(".") !== -1) {
    base = base.substring(0, base.lastIndexOf("."));
  }
  return base;
};

const sendFileToSlack = async (localFilePath, message, channelId) => {
  const client = new WebClient(process.env.REACT_APP_SLACK_SHARE_TOKEN, {
    logLevel: LogLevel.DEBUG,
  });

  const base = baseName(localFilePath);

  ffmpeg("download")
    .output(baseName + "New.mp4")
    .videoCodec("libx264")
    .size("1280x720");

  await client.files
    .upload({
      channels: channelId,
      initial_comment: message,
      file: fs.createReadStream(localFilePath),
    })
    .then((res) => {
      console.log("file sent successfully", res);

      return res;
    })
    .catch((err) => {
      console.log("failed to send");
      return err;
    })
    .finally(() => {
      fs.unlinkSync(localFilePath);
    });
};

//delete file and loader after sending and look at full flow
app.get("/getFile", async (req, res) => {
  let localFilePath;

  if (req.query.isVideo === "true") {
    localFilePath = path.resolve(
      __dirname,
      "downloads/videos",
      "downloadNew.mp4"
    );
  } else if (req.query.isVideo === "false") {
    localFilePath = path.resolve(__dirname, "downloads/photos", "download.jpg");
  }

  await axios({
    url: req.query.fileUrl,
    method: "GET",
    responseType: "stream",
  })
    .then((response) => {
      const url = response.data.pipe(fs.createWriteStream(localFilePath));
      url.on("finish", () => {
        console.log("download successfully!");
        const responseFinal = sendFileToSlack(
          localFilePath,
          req.query.message,
          req.query.channelId,
          req.query.isVideo
        );

        res.json(responseFinal);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
