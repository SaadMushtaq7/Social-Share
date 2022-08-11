import React, { FC } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Camera from "./screens/Camera";
import VideoRecorder from "./screens/VideoRecorder";
import "./App.css";

//import Timer from "./components/Timer";

const App: FC = () => {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Camera />} />
        <Route path="/videoRecorder" element={<VideoRecorder />} />
      </Routes>
      {/*<Timer />*/}
    </div>
  );
};

export default App;
