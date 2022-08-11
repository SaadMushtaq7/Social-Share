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

const sendFileToSlack = async (localFilePath, message, channelId, isVideo) => {
  const client = new WebClient(process.env.REACT_APP_SLACK_SHARE_TOKEN, {
    logLevel: LogLevel.DEBUG,
  });

  if (isVideo === "true") {
    ffmpeg("downloads/videos/download.mp4")
      .output("downloads/videos/downloadNew.mp4")
      .videoCodec("libx264")
      .size("1920x1080")
      .on("progress", (progress) => {
        console.log("...progress frame: ", progress.frames);
      })
      .on("error", (err) => {
        console.log("error converting file: ", err);
        return err;
      })
      .on("end", async () => {
        await client.files
          .upload({
            channels: channelId,
            initial_comment: message,
            file: fs.createReadStream("downloads/videos/downloadNew.mp4"),
            filename: "downloadNew",
          })
          .then((res) => {
            console.log("file sent successfully!");

            return res;
          })
          .catch((err) => {
            console.log("failed to send");
            return err;
          })
          .finally(() => {
            fs.unlinkSync("downloads/vide/download.mp4");
            fs.unlinkSync("downloads/videos/downloadNew.mp4");
          });
      })
      .run();
  } else {
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
  }
};

//delete file and loader after sending and look at full flow
app.get("/getFile", async (req, res) => {
  let localFilePath;

  if (req.query.isVideo === "true") {
    localFilePath = path.resolve(__dirname, "downloads/videos", "download.mp4");
  } else if (req.query.isVideo === "false") {
    localFilePath = path.resolve(__dirname, "downloads/photos", "download.jpg");
  }
  ffmpeg("downloads/videos/download.mp4")
    .output("downloads/videos/downloadNew.mov")
    .videoCodec("libx264")
    .size("1920x1080")
    .on("progress", (progress) => {
      console.log("...progress frame: ", progress.frames);
    })
    .on("error", (err) => {
      console.log("error converting file: ", err);
    })
    .on("end", (res) => {
      console.log("conversion ended: ", res);
    })
    .run();

  await axios({
    url: req.query.fileUrl,
    method: "GET",
    responseType: "stream",
  })
    .then((response) => {
      const url = response.data.pipe(fs.createWriteStream(localFilePath));
      url.on("finish", () => {
        console.log("file downloaded successfully!");
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
