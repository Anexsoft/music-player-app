import React, { useEffect, useState } from "react";

import { setCurrentAudioIndex, useGlobalContext } from "./Context";
import { AudioFile } from "./Context.types";

import AppPlayList from "./components/AppPlayList/AppPlayList";
import AppPlayer from "./components/AppPlayer/AppPlayer";

import { playAudio } from "./common";

const App: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { audioFiles, setAudioFiles, currentAudioIndex } = useGlobalContext();

  useEffect(() => {
    if (currentAudioIndex > -1) {
      playAudio(true);
    }

    window.electron?.onFileOpened((path: string) => {
      const audio = new Audio(path);

      audio.addEventListener("loadedmetadata", () => {
        const newAudioFile: AudioFile = {
          name: path.split("/").pop() || "Unknown",
          path: audio.src,
          duration: audio.duration,
        };

        setAudioFiles((prev) => {
          const updatedFiles = [...prev, newAudioFile];
          setCurrentAudioIndex(updatedFiles.indexOf(newAudioFile));
          return updatedFiles;
        });
      });
    });
  }, [currentAudioIndex, setAudioFiles]);

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

    setAudioFiles((prev) => {
      const updatedFiles = [...prev, ...newAudioFiles];

      const firstAudioFile = newAudioFiles[0];
      const firstAudioFileIndex = updatedFiles.indexOf(firstAudioFile);

      setCurrentAudioIndex(firstAudioFileIndex);

      return updatedFiles;
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

      {audioFiles.length > 0 && <AppPlayList />}
    </div>
  );
};

export default App;
