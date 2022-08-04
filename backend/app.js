const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { default: axios } = require("axios");
const { WebClient, LogLevel } = require("@slack/web-api");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const sendFileToSlack = async (localFilePath) => {
  const channelId = process.env.REACT_APP_SLACK_SHARE_USER_ID;

  const client = new WebClient(process.env.REACT_APP_SLACK_SHARE_TOKEN, {
    logLevel: LogLevel.DEBUG,
  });

  await client.files
    .upload({
      channels: channelId,
      initial_comment: "Here's my file :smile:",
      file: fs.createReadStream(localFilePath),
    })
    .then((res) => {
      console.log("file sent successfully", res.file.id);
      return res;
    })
    .catch((err) => {
      console.log("failed to send");
      return err;
    });
};

app.get("/getFile", async (req, res) => {
  let localFilePath;

  if (req.query.isVideo === "true") {
    localFilePath = path.resolve(__dirname, "downloads/videos", "download.mp4");
  } else if (req.query.isVideo === "false") {
    localFilePath = path.resolve(__dirname, "downloads/photos", "download.jpg");
  }

  await axios({
    url: req.query.imageUrl,
    method: "GET",
    responseType: "stream",
  })
    .then((response) => {
      const url = response.data.pipe(fs.createWriteStream(localFilePath));
      url.on("finish", () => {
        console.log("download successfully!");
      });
    })
    .catch((err) => {
      console.log(err);
    });

  const responseFinal = await sendFileToSlack(localFilePath);

  res.json(responseFinal);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
