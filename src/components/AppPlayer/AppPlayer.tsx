import React, { useEffect, useState, useRef } from "react";
import {
  FaCirclePause,
  FaCirclePlay,
  FaCircleStop,
  FaVolumeLow,
  FaVolumeXmark,
  FaVolumeHigh,
} from "react-icons/fa6";

import { pauseAudio, playAudio, stopAudio } from "../../common";
import { useGlobalContext } from "../../Context";
import { handleTimeUpdate } from "./handlers/time-update.handler";
import { handleAudioEnded } from "./handlers/audio-ended.handler";
import { handleKeyDown } from "./handlers/key-down.handler";

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
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);

  const timeUpdateRef = useRef<() => void>();
  const audioEndedRef = useRef<() => void>();
  const loadedDataRef = useRef<() => void>();
  const keyDownRef = useRef<(event: KeyboardEvent) => void>();

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    timeUpdateRef.current = () => {
      handleTimeUpdate({
        currentAudioFile,
        setCurrentTime,
        setDuration,
        setCurrentAudioSeek,
      });
    };

    audioEndedRef.current = () => {
      handleAudioEnded({
        isShuffle,
        currentAudioIndex,
        setCurrentAudioIndex,
        playListLength: audioFiles.length,
      });
    };

    loadedDataRef.current = () => {
      if (currentAudioFile) {
        currentAudioFile.playbackRate = playbackRate;
      }
    };

    keyDownRef.current = handleKeyDown({ currentAudioFile });

    const handleTimeUpdateWrapper = () => timeUpdateRef.current?.();
    const handleAudioEndedWrapper = () => audioEndedRef.current?.();
    const handleLoadedDataWrapper = () => loadedDataRef.current?.();
    const handleKeyDownWrapper = (event: KeyboardEvent) =>
      keyDownRef.current?.(event);

    currentAudioFile?.addEventListener("timeupdate", handleTimeUpdateWrapper);
    currentAudioFile?.addEventListener("ended", handleAudioEndedWrapper);
    currentAudioFile?.addEventListener("loadeddata", handleLoadedDataWrapper);

    window.addEventListener("keydown", handleKeyDownWrapper);

    return () => {
      currentAudioFile?.removeEventListener(
        "timeupdate",
        handleTimeUpdateWrapper
      );
      currentAudioFile?.removeEventListener("ended", handleAudioEndedWrapper);
      currentAudioFile?.removeEventListener(
        "loadeddata",
        handleLoadedDataWrapper
      );
      window.removeEventListener("keydown", handleKeyDownWrapper);
    };
  }, [
    currentAudioFile,
    isShuffle,
    currentAudioIndex,
    audioFiles,
    setCurrentAudioIndex,
    playbackRate,
  ]);

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

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (currentAudioFile) {
      currentAudioFile.playbackRate = rate;
    }
  };

  const handleShuffleToggle = () => {
    setIsShuffle((prev) => !prev);
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
        <FaCirclePlay onClick={() => playAudio()} />
        <FaCirclePause onClick={pauseAudio} />
        <FaCircleStop onClick={stopAudio} />
      </div>

      <div className="action-container">
        <div className="first-row">
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

        <div className="second-row">
          <div className="controls-aligned">
            <div className="shuffle-control">
              <button
                className={`shuffle-button ${isShuffle ? "active" : ""}`}
                onClick={handleShuffleToggle}
              >
                Shuffle
              </button>
            </div>

            <div className="playback-control">
              <div className="playback-buttons">
                {[0.5, 0.75, 1, 1.25].map((rate) => (
                  <button
                    key={rate}
                    className={`playback-button ${
                      playbackRate === rate ? "active" : ""
                    }`}
                    onClick={() => handlePlaybackRateChange(rate)}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <div className="theme-control">
              <select
                className="theme-selector"
                onChange={(e) => setTheme(e.target.value)}
              >
                <option selected value="dark">
                  Dark
                </option>
                <option value="light">Light</option>
                <option value="solaris">Solaris</option>
                <option value="neon">Neon</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPlayer;
