interface PlaybackRateChangeHandlerProps {
  rate: number;
  setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
  currentAudioFile: HTMLAudioElement | null;
}

export const playbackRateChangeHandler = ({
  rate,
  currentAudioFile,
  setPlaybackRate,
}: PlaybackRateChangeHandlerProps) => {
  setPlaybackRate(rate);
  if (currentAudioFile) {
    currentAudioFile.playbackRate = rate;
  }
};
