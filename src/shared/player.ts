import { currentAudioFile, currentAudioIndex, audioFiles } from "../Context";

export const playAudio = (updateAudioRef = false): void => {
  const audioFile = audioFiles[currentAudioIndex];

  if (!audioFile) return;
  if (!currentAudioFile) return;
  if (currentAudioIndex === -1) return;

  if (updateAudioRef) {
    if (audioFile) {
      currentAudioFile.src = audioFile.path;
    } else {
      console.error("Invalid audio file or path");
      return;
    }
  }

  if (currentAudioFile.paused) {
    currentAudioFile.play();
  }
};

export const pauseAudio = (): void => {
  const audioFile = audioFiles[currentAudioIndex];

  if (!audioFile) return;
  if (!currentAudioFile) return;
  if (currentAudioIndex === -1) return;

  currentAudioFile.pause();
};

export const stopAudio = (): void => {
  const audioFile = audioFiles[currentAudioIndex];

  if (!audioFile) return;
  if (!currentAudioFile) return;
  if (currentAudioIndex === -1) return;

  currentAudioFile.pause();
  currentAudioFile.currentTime = 0;
};

export const removeAudio = (): void => {
  if (!currentAudioFile) return;
  if (currentAudioIndex === -1) return;

  currentAudioFile.pause();
  currentAudioFile.src = "";
  currentAudioFile.currentTime = 0;
};
