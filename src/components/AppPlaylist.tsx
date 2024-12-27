import React from "react";

import { useGlobalContext } from "../Context";

import { formatDuration } from "../common/style";
import { removeAudio } from "../common";

const AppPlaylist: React.FC = () => {
  const { audioFiles, setAudioFiles, currentAudioIndex, setCurrentAudioIndex } =
    useGlobalContext();

  const handlePlay = (index: number) => {
    setCurrentAudioIndex(index);
  };

  const handleClearPlaylist = () => {
    setAudioFiles([]);
    removeAudio();
    setCurrentAudioIndex(-1);
  };

  return (
    <div className="file-list">
      <h3>
        Current playlist{" "}
        <button onClick={handleClearPlaylist} className="clear-button">
          Clear
        </button>
      </h3>

      <ul>
        {audioFiles.map((file, index) => (
          <li
            key={index}
            onClick={() => handlePlay(index)}
            className={index === currentAudioIndex ? "selected" : ""}
          >
            <span className="file-name">{file.name}</span>
            <span className="file-duration">
              ({formatDuration(file.duration)})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppPlaylist;
