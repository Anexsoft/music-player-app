import React, { useEffect, useState, useRef } from "react";
import {
  FaCirclePause,
  FaCirclePlay,
  FaCircleStop,
  FaVolumeLow,
  FaVolumeXmark,
  FaVolumeHigh,
} from "react-icons/fa6";

import { pauseAudio, playAudio, stopAudio } from "../../shared/player";
import { useGlobalContext } from "../../Context";

import { handleTimeUpdate } from "./handlers/time-update.handler";
import { handleAudioEnded } from "./handlers/audio-ended.handler";
import { handleKeyDown } from "./handlers/key-down.handler";
import { handleSeekChangeHandler } from "./handlers/seek-change.handler";
import { handleMuteToggleHandler } from "./handlers/mute-toggle.handler";
import { handleVolumeChangeHandler } from "./handlers/volume-change.handler";
import { playbackRateChangeHandler } from "./handlers/playback-rate-change.handler";
import { handleThemeChange } from "./handlers/theme-change.handler";
import { THEME_KEY } from "../../shared/keys";

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

  const [theme, setTheme] = useState(localStorage.getItem(THEME_KEY) ?? "dark");

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

  const getVolumeIcon = () => {
    if (volume === 0) {
      return (
        <FaVolumeXmark
          className="volume-icon"
          onClick={() =>
            handleMuteToggleHandler({
              currentAudioFile,
              previousVolume,
              setPreviousVolume,
              setVolume,
              volume,
            })
          }
          title="Unmute"
        />
      );
    }

    if (volume > 0 && volume <= 50) {
      return (
        <FaVolumeLow
          className="volume-icon"
          onClick={() =>
            handleMuteToggleHandler({
              currentAudioFile,
              previousVolume,
              setPreviousVolume,
              setVolume,
              volume,
            })
          }
          title="Mute"
        />
      );
    }

    return (
      <FaVolumeHigh
        className="volume-icon"
        onClick={() =>
          handleMuteToggleHandler({
            currentAudioFile,
            previousVolume,
            setPreviousVolume,
            setVolume,
            volume,
          })
        }
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
            onChange={(e) =>
              handleSeekChangeHandler({
                value: Number(e.target.value),
                currentAudioFile,
                setCurrentAudioSeek,
              })
            }
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
              onChange={(e) =>
                handleVolumeChangeHandler({
                  currentAudioFile,
                  setVolume,
                  value: Number(e.target.value),
                })
              }
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
                onClick={() => setIsShuffle((prev) => !prev)}
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
                    onClick={() =>
                      playbackRateChangeHandler({
                        rate,
                        currentAudioFile,
                        setPlaybackRate,
                      })
                    }
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <div className="theme-control">
              <select
                className="theme-selector"
                onChange={(e) =>
                  handleThemeChange({ value: e.target.value, setTheme })
                }
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="solaris">Solaris</option>
                <option value="neon">Neon</option>
                <option value="vscode">VSCode</option>
                <option value="forest">Forest</option>
                <option value="sunset">Sunset</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="retro">Retro</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPlayer;
