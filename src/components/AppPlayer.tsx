import React, { useEffect, useState } from "react";
import { FaCirclePause, FaCirclePlay, FaCircleStop } from "react-icons/fa6";

import { currentAudioFile } from "../Context";
import { pauseAudio, playAudio, stopAudio } from "../common";
import { useGlobalContext } from "../Context";

const AppPlayer: React.FC = () => {
  const { audioFiles, currentAudioIndex } = useGlobalContext();
  const [currentAudioSeek, setCurrentAudioSeek] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

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
        const formatTime = (time: number) => {
          const minutes = Math.floor(time / 60);
          const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
          return `${minutes}:${seconds}`;
        };

        setCurrentTime(formatTime(currentAudioFile.currentTime));
        setDuration(formatTime(currentAudioFile.duration || 0));
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

  const trackTitle =
    currentAudioIndex !== -1
      ? audioFiles[currentAudioIndex]?.name
      : "Player is empty";

  return (
    <div className="audio-player">
      <div className="track-info">
        <span className="track-title">{trackTitle}</span>
        <span className="track-time">
          {currentAudioIndex !== -1 ? `${currentTime} / ${duration}` : ""}
        </span>
      </div>

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
