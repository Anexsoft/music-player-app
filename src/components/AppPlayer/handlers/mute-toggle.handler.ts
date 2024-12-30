interface MuteToggleHandlerProps {
  volume: number;
  previousVolume: number;
  setPreviousVolume: React.Dispatch<React.SetStateAction<number>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  currentAudioFile: HTMLAudioElement | null;
}

export const handleMuteToggleHandler = ({
  volume,
  previousVolume,
  currentAudioFile,
  setVolume,
  setPreviousVolume,
}: MuteToggleHandlerProps) => {
  if (volume > 0) {
    setPreviousVolume(volume);
    setVolume(0);
    if (currentAudioFile) {
      currentAudioFile.volume = 0;
    }
  } else {
    setVolume(previousVolume);
    if (currentAudioFile) {
      currentAudioFile.volume = previousVolume / 100;
    }
  }
};
