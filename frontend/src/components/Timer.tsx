import React, { useEffect, useState } from "react";
import "../Timer.css";
import TimerControl from "./TimerControl";

const Timer = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [timerArray, setTimerArray] = useState<Array<number | string>>([]);

  const calculateTime = (timeInSeconds: number): Array<number | string> => {
    let hours: number = Math.floor(timeInSeconds / 3600);
    let minuts: number = Math.floor((timeInSeconds - hours * 3600) / 60);
    let secnds: number = timeInSeconds - hours * 3600 - minuts * 60;
    let hoursFormat = hours < 10 ? `0${hours}` : hours;
    let minutsFormat = minuts < 10 ? `0${minuts}` : minuts;
    let secndsFormat = secnds < 10 ? `0${secnds}` : secnds;

    return [hoursFormat, minutsFormat, secndsFormat];
  };

  useEffect(() => {
    let tempTimer: Array<number | string> = calculateTime(seconds);
    setTimerArray(tempTimer);
  }, [seconds]);

  return (
    <div className="stopwatch-container">
      <h1>Timer</h1>
      <div className="timer-display">
        <p id="hour">{timerArray[0]}</p>
        <span>:</span>
        <p id="minute">{timerArray[1]}</p>
        <span>:</span>
        <p id="second">{timerArray[2]}</p>
      </div>
      <TimerControl setSeconds={setSeconds} />
    </div>
  );
};

export default Timer;
