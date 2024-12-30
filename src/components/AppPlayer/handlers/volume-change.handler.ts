interface VolumeChangeHandlerProps {
  value: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  currentAudioFile: HTMLAudioElement | null;
}

export const handleVolumeChangeHandler = ({
  value,
  currentAudioFile,
  setVolume,
}: VolumeChangeHandlerProps) => {
  setVolume((value / 100) * 100);

  if (currentAudioFile) {
    currentAudioFile.volume = value;
  }
};
