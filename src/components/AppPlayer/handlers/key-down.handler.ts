import { playAudio, stopAudio } from "../../../shared/player";

interface KeyDownHandlerProps {
  currentAudioFile: HTMLAudioElement | null;
}

export const handleKeyDown = ({ currentAudioFile }: KeyDownHandlerProps) => {
  return (event: KeyboardEvent) => {
    if (!currentAudioFile) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      if (currentAudioFile.paused) {
        playAudio();
      } else {
        stopAudio();
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
};
