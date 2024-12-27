import { Dispatch, SetStateAction } from "react";

export interface AudioFile {
  name: string;
  url: string;
  duration: number;
}

export interface GlobalContext {
  currentAudioFile: HTMLAudioElement | null;
  setCurrentAudioFile: Dispatch<HTMLAudioElement | null>;

  audioFiles: AudioFile[];
  setAudioFiles: Dispatch<SetStateAction<AudioFile[]>>;

  currentAudioIndex: number;
  setCurrentAudioIndex: Dispatch<SetStateAction<number>>;
}
