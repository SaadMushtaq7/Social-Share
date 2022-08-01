import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "../App.css";

const NavBar: FC = () => {
  const [selectedButton, setSelectedButton] = useState<string>("camera");
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Post It!
          </Typography>

          <Link
            style={{
              textDecoration: "none",
              color: "#fff",
              marginRight: "40px",
            }}
            to="/"
          >
            <Button
              variant={selectedButton === "camera" ? "contained" : "text"}
              color={selectedButton === "camera" ? "primary" : "inherit"}
              onClick={() => setSelectedButton("camera")}
            >
              Camera
            </Button>
          </Link>
          <Link
            style={{
              textDecoration: "none",
              color: "#fff",
              marginRight: "100px",
              width: "300px",
            }}
            to="/videoRecorder"
          >
            <Button
              variant={selectedButton === "video" ? "contained" : "text"}
              color={selectedButton === "video" ? "primary" : "inherit"}
              onClick={() => setSelectedButton("video")}
            >
              Video Recorder
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
