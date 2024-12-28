import React, { useEffect, useState } from "react";

import { setCurrentAudioIndex, useGlobalContext } from "./Context";
import { AudioFile } from "./Context.types";

import AppPlaylist from "./components/AppPlaylist";
import AppPlayer from "./components/AppPlayer";
import { playAudio } from "./common";

const App: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { audioFiles, setAudioFiles, currentAudioIndex } = useGlobalContext();

  useEffect(() => {
    if (currentAudioIndex > -1) {
      playAudio(true);
    }
  }, [currentAudioIndex]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("audio/")
    );

    const newAudioFiles: AudioFile[] = [];

    files.forEach((file) => {
      const existingFile = audioFiles.some((audio) => audio.name === file.name);

      if (!existingFile) {
        const audio = new Audio(URL.createObjectURL(file));

        audio.addEventListener("loadedmetadata", () => {
          newAudioFiles.push({
            name: file.name,
            url: audio.src,
            duration: audio.duration,
          });

          if (newAudioFiles.length === files.length) {
            setAudioFiles((prev) => {
              const updatedFiles = [...prev, ...newAudioFiles];

              const firstAudioFile = newAudioFiles[0];
              const firstAudioFileIndex = updatedFiles.indexOf(firstAudioFile);

              setCurrentAudioIndex(firstAudioFileIndex);

              return updatedFiles;
            });
          }
        });
      }
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`App drop-area ${isDragging ? "dragging" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <AppPlayer />

      {audioFiles.length > 0 && <AppPlaylist />}
    </div>
  );
};

export default App;
