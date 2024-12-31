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
  setVolume(value);

  if (currentAudioFile) {
    currentAudioFile.volume = value / 100;
  }
};
