interface SeekChangeHandlerProps {
  value: number;
  setCurrentAudioSeek: React.Dispatch<React.SetStateAction<number>>;
  currentAudioFile: HTMLAudioElement | null;
}

export const handleSeekChangeHandler = ({
  value,
  currentAudioFile,
  setCurrentAudioSeek,
}: SeekChangeHandlerProps) => {
  setCurrentAudioSeek(value);

  if (currentAudioFile) {
    currentAudioFile.currentTime = (value / 100) * currentAudioFile.duration;
  }
};
