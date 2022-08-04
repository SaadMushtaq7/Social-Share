import React, { FC, useState, Dispatch } from "react";
import "../Timer.css";

interface Props {
  setSeconds: Dispatch<React.SetStateAction<number>>;
}

const TimerControl: FC<Props> = ({ setSeconds }) => {
  const [intervalId, setIntervalId] = useState<any>();

  const handleOnStart = () => {
    let interval: any = setInterval(() => {
      setSeconds((prevState: number) => prevState + 1);
    }, 1000);
    setIntervalId(interval);
  };

  const handleOnStop = () => {
    clearInterval(intervalId);
  };

  const handleOnReset = () => {
    clearInterval(intervalId);
    setSeconds(0);
  };
  return (
    <div className="stopwatch-controls-container">
      <button onClick={handleOnStart} type="button">
        Start
      </button>
      <button onClick={handleOnStop} type="button">
        Stop
      </button>
      <button onClick={handleOnReset} type="button">
        Reset
      </button>
    </div>
  );
};

export default TimerControl;
