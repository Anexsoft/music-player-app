import React from "react";
import { FaDeleteLeft } from "react-icons/fa6";

import { useGlobalContext } from "../../Context";

import { formatDuration } from "../../shared/style";
import { removeAudio } from "../../shared/player";

const AppPlayList: React.FC = () => {
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

  const handleDeleteAudio = (index: number) => {
    setAudioFiles(audioFiles.filter((_, i) => i !== index));

    if (currentAudioIndex === index) {
      removeAudio();
      setCurrentAudioIndex(-1);
    } else if (currentAudioIndex > index) {
      setCurrentAudioIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="play-list">
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
            className={index === currentAudioIndex ? "selected" : ""}
          >
            <div className="file-container" onClick={() => handlePlay(index)}>
              <span className="file-name">{file.name}</span>
              <span className="file-duration">
                ({formatDuration(file.duration)})
              </span>
            </div>
            <div className="file-actions">
              <FaDeleteLeft
                className="button delete"
                onClick={(e) => handleDeleteAudio(index)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppPlayList;
