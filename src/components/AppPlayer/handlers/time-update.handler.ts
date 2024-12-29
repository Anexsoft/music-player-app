import { formatDuration } from "../../../common/style";

interface TimeUpdateHandlerProps {
  currentAudioFile: HTMLAudioElement | null;
  setCurrentTime: React.Dispatch<React.SetStateAction<string>>;
  setDuration: React.Dispatch<React.SetStateAction<string>>;
  setCurrentAudioSeek: React.Dispatch<React.SetStateAction<number>>;
}

export const handleTimeUpdate = ({
  currentAudioFile,
  setCurrentTime,
  setDuration,
  setCurrentAudioSeek,
}: TimeUpdateHandlerProps) => {
  if (!currentAudioFile) {
    return;
  }

  setCurrentTime(formatDuration(currentAudioFile.currentTime));
  setDuration(formatDuration(currentAudioFile.duration || 0));
  setCurrentAudioSeek(
    (currentAudioFile.currentTime / currentAudioFile.duration) * 100 || 0
  );
};
