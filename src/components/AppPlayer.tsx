import React, { useEffect, useState } from "react";
import { FaCirclePause, FaCirclePlay, FaCircleStop } from "react-icons/fa6";

import { currentAudioFile } from "../Context";
import { pauseAudio, playAudio, stopAudio } from "../common";

const AppPlayer: React.FC = () => {
  const [currentAudioSeek, setCurrentAudioSeek] = useState(0);

  const handlePause = () => {
    pauseAudio();
  };

  const handleStop = () => {
    stopAudio();
  };

  const handlePlay = () => {
    playAudio();
  };

  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setCurrentAudioSeek(value);

    if (currentAudioFile) {
      currentAudioFile.currentTime = (value / 100) * currentAudioFile.duration;
    }
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (currentAudioFile) {
        setCurrentAudioSeek(
          (currentAudioFile.currentTime / currentAudioFile.duration) * 100 || 0
        );
      }
    };

    currentAudioFile?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      currentAudioFile?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [setCurrentAudioSeek]);

  return (
    <div className="audio-player">
      <div className="controls">
        <FaCirclePlay onClick={handlePlay} />
        <FaCirclePause onClick={handlePause} />
        <FaCircleStop onClick={handleStop} />
      </div>

      <div className="seek-container">
        <input
          type="range"
          value={currentAudioSeek}
          min="0"
          max="100"
          step="1"
          onChange={handleSeekChange}
          aria-label="Seek bar"
        />
      </div>
    </div>
  );
};

export default AppPlayer;
