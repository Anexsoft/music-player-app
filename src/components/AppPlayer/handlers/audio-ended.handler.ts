interface AudioEndedHandlerProps {
  isShuffle: boolean;
  currentAudioIndex: number;
  setCurrentAudioIndex: React.Dispatch<React.SetStateAction<number>>;
  playListLength: number;
}

export const handleAudioEnded = ({
  isShuffle,
  currentAudioIndex,
  setCurrentAudioIndex,
  playListLength,
}: AudioEndedHandlerProps) => {
  if (isShuffle) {
    const randomIndex = Math.floor(Math.random() * playListLength);
    setCurrentAudioIndex(randomIndex);
  } else {
    if (currentAudioIndex < playListLength - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
    } else {
      setCurrentAudioIndex(-1);
    }
  }
};
