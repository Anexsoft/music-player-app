import React, { useEffect, useState } from "react";
import {
  FaCirclePause,
  FaCirclePlay,
  FaCircleStop,
  FaVolumeLow,
  FaVolumeXmark,
  FaVolumeHigh,
} from "react-icons/fa6";

import { pauseAudio, playAudio, stopAudio } from "../common";
import { useGlobalContext } from "../Context";

const AppPlayer: React.FC = () => {
  const {
    audioFiles,
    currentAudioIndex,
    setCurrentAudioIndex,
    currentAudioFile,
  } = useGlobalContext();

  const [currentAudioSeek, setCurrentAudioSeek] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const [volume, setVolume] = useState(
    currentAudioFile ? currentAudioFile.volume * 100 : 100
  );
  const [previousVolume, setPreviousVolume] = useState(volume);

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

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) / 100;
    setVolume(value * 100);

    if (currentAudioFile) {
      currentAudioFile.volume = value;
    }
  };

  const handleMuteToggle = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
      if (currentAudioFile) {
        currentAudioFile.volume = 0;
      }
    } else {
      setVolume(previousVolume);
      if (currentAudioFile) {
        currentAudioFile.volume = previousVolume / 100;
      }
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) {
      return (
        <FaVolumeXmark
          className="volume-icon"
          onClick={handleMuteToggle}
          title="Unmute"
        />
      );
    }

    if (volume > 0 && volume <= 50) {
      return (
        <FaVolumeLow
          className="volume-icon"
          onClick={handleMuteToggle}
          title="Mute"
        />
      );
    }

    return (
      <FaVolumeHigh
        className="volume-icon"
        onClick={handleMuteToggle}
        title="Mute"
      />
    );
  };

  useEffect(() => {
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    };

    const handleTimeUpdate = () => {
      if (currentAudioFile) {
        setCurrentTime(formatTime(currentAudioFile.currentTime));
        setDuration(formatTime(currentAudioFile.duration || 0));
        setCurrentAudioSeek(
          (currentAudioFile.currentTime / currentAudioFile.duration) * 100 || 0
        );
      }
    };

    const handleAudioEnded = () => {
      if (currentAudioIndex < audioFiles.length - 1) {
        setCurrentAudioIndex(currentAudioIndex + 1);
      } else {
        setCurrentAudioIndex(-1);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (currentAudioFile?.paused) {
          handlePlay();
        } else {
          handlePause();
        }
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        if (currentAudioFile) {
          currentAudioFile.currentTime = Math.min(
            currentAudioFile.currentTime + 3,
            currentAudioFile.duration
          );
        }
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        if (currentAudioFile) {
          currentAudioFile.currentTime = Math.max(
            currentAudioFile.currentTime - 3,
            0
          );
        }
      }
    };

    currentAudioFile?.addEventListener("timeupdate", handleTimeUpdate);
    currentAudioFile?.addEventListener("ended", handleAudioEnded);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      currentAudioFile?.removeEventListener("timeupdate", handleTimeUpdate);
      currentAudioFile?.removeEventListener("ended", handleAudioEnded);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentAudioIndex, audioFiles, setCurrentAudioIndex, currentAudioFile]);

  const trackTitle =
    currentAudioIndex !== -1
      ? audioFiles[currentAudioIndex]?.name
      : "No audio selected";

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

      <div className="seek-volume-container">
        <input
          type="range"
          value={currentAudioSeek}
          min="0"
          max="100"
          step="1"
          onChange={handleSeekChange}
          aria-label="Seek bar"
          className="seek-bar"
        />
        <div className="volume-control">
          {getVolumeIcon()}
          <input
            type="range"
            value={volume}
            min="0"
            max="100"
            step="1"
            onChange={handleVolumeChange}
            aria-label="Volume control"
            className="volume-bar"
          />
        </div>
      </div>
    </div>
  );
};

export default AppPlayer;
