import React, { FC, Dispatch, useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { LinkedinShareButton, LinkedinIcon } from "react-share";

interface Props {
  fileCheck: boolean;
  selectedFile: any | null;
  setFileCheck: Dispatch<React.SetStateAction<boolean>>;
  videoFile: boolean;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props: any) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const CustomizedDialogs: FC<Props> = ({
  fileCheck,
  selectedFile,
  setFileCheck,
  videoFile,
}) => {
  const [open, setOpen] = useState(fileCheck);
  const handleClose = () => {
    setOpen(false);
    setFileCheck(false);
  };
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Share the File
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {selectedFile ? (
            videoFile ? (
              <video
                style={{
                  height: "233px",
                  width: "350px",
                }}
                src={selectedFile}
                controls
                autoPlay
              />
            ) : (
              <Box
                component="img"
                sx={{
                  height: 233,
                  width: 350,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt="feedback"
                src={selectedFile}
              />
            )
          ) : (
            <h2>No File Available!</h2>
          )}
        </DialogContent>
        <DialogActions>
          <div className="share-btns">
            <LinkedinShareButton url={selectedFile}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default CustomizedDialogs;
