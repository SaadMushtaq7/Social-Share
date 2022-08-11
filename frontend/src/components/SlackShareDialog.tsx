import React, { useState, Dispatch, FC } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  selectedFile: string;
  isVideo: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  setFileCheck: Dispatch<React.SetStateAction<boolean>>;
  setPreviewFile: Dispatch<React.SetStateAction<boolean>>;
  slackShareOpen: boolean;
  setSlackShareOpen: Dispatch<React.SetStateAction<boolean>>;
}

const SlackShareDialog: FC<Props> = ({
  selectedFile,
  isVideo,
  setOpen,
  setFileCheck,
  setPreviewFile,
  slackShareOpen,
  setSlackShareOpen,
}) => {
  const [openSlackDialog, setOpenSlackDialog] =
    useState<boolean>(slackShareOpen);
  const [shareLoader, setShareLoader] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Here's my file :smile:");
  const [channelId, setChannelId] = useState<string>("D034XHW4Q3V");

  const handleSlackShare = async () => {
    setShareLoader(true);
    await axios
      .get("http://localhost:8080/getFile", {
        params: {
          fileUrl: selectedFile,
          isVideo,
          message,
          channelId,
        },
      })
      .then((res) => {
        console.log(res);
        setOpen(false);
        setFileCheck(false);
        isVideo ? setPreviewFile(true) : setPreviewFile(false);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setShareLoader(false);
      });

    setOpenSlackDialog(false);
    setSlackShareOpen(false);
  };

  const handleClose = () => {
    setOpenSlackDialog(false);
    setSlackShareOpen(false);
  };
  return (
    <div>
      <Dialog
        sx={{
          width: "1500px",
          height: "750px",
        }}
        open={openSlackDialog}
        onClose={handleClose}
      >
        <DialogTitle
          sx={{
            width: "500px",
            height: "130px",
          }}
          color="primary"
        >
          Share On Slack
        </DialogTitle>
        <DialogContent
          sx={{
            width: "500px",
          }}
        >
          {shareLoader ? (
            <CircularProgress
              sx={{
                marginLeft: "200px",
              }}
            />
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                id="message"
                label="Message"
                type="text"
                fullWidth
                variant="standard"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Channel Id"
                type="text"
                fullWidth
                variant="standard"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            width: "500px",
          }}
        >
          <Button disabled={shareLoader} onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={shareLoader} onClick={handleSlackShare}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SlackShareDialog;
