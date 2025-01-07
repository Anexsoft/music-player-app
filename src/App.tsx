import React, { useState } from "react";

import { setCurrentAudioIndex, useGlobalContext } from "./Context";
import { AudioFile } from "./Context.types";

import AppPlayList from "./components/AppPlayList/AppPlayList";
import AppPlayer from "./components/AppPlayer/AppPlayer";

const App: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { audioFiles, setAudioFiles } = useGlobalContext();

  const updateTrackList = (newAudioFiles: AudioFile[]) => {
    setAudioFiles((prev) => {
      const updatedFiles = [...prev, ...newAudioFiles];

      const firstAudioFile = newAudioFiles[0];
      const firstAudioFileIndex = updatedFiles.indexOf(firstAudioFile);

      setCurrentAudioIndex(firstAudioFileIndex);

      return updatedFiles;
    });
  };

  window.electron?.onFileOpened(({ name, blob }) => {
    const audio = new Audio(
      URL.createObjectURL(
        new Blob([Uint8Array.from(atob(blob), (char) => char.charCodeAt(0))], {
          type: "audio/mpeg",
        })
      )
    );

    audio.addEventListener("loadedmetadata", () => {
      const newAudioFile: AudioFile = {
        name,
        path: audio.src,
        duration: audio.duration,
      };

      updateTrackList([newAudioFile]);
    });
  });

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files).filter(
      (file) =>
        file.type.startsWith("audio/") &&
        !audioFiles.some((audio) => audio.name === file.name)
    );

    if (!droppedFiles.length) {
      return;
    }

    const newAudioFiles: AudioFile[] = await Promise.all(
      droppedFiles.map(
        (file) =>
          new Promise<AudioFile>((resolve) => {
            const audio = new Audio(URL.createObjectURL(file as Blob));
            audio.addEventListener("loadedmetadata", () => {
              resolve({
                name: file.name,
                path: audio.src,
                duration: audio.duration,
              });
            });
          })
      )
    );

    updateTrackList(newAudioFiles);
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

      {audioFiles.length > 0 && <AppPlayList />}
    </div>
  );
};

export default App;
