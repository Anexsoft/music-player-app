import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { AudioFile, GlobalContext } from "./Context.types";

// State variables
export let currentAudioFile: HTMLAudioElement | null;
export let setCurrentAudioFile: Dispatch<HTMLAudioElement | null>;

export let audioFiles: AudioFile[];
export let setAudioFiles: Dispatch<SetStateAction<AudioFile[]>>;

export let currentAudioIndex: number;
export let setCurrentAudioIndex: Dispatch<SetStateAction<number>>;

// Context definition
export const Context = createContext<GlobalContext | undefined>(undefined);
export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [_currentAudioFile, _setCurrentAudioFile] =
    useState<HTMLAudioElement | null>(() => {
      const audio = new Audio();
      audio.volume = 0.5;

      return audio;
    });
  const [_audioFiles, _setAudioFiles] = useState<AudioFile[]>([]);
  const [_currentAudioIndex, _setCurrentAudioIndex] = useState<number>(-1);

  currentAudioFile = _currentAudioFile;
  setCurrentAudioFile = _setCurrentAudioFile;

  audioFiles = _audioFiles;
  setAudioFiles = _setAudioFiles;

  currentAudioIndex = _currentAudioIndex;
  setCurrentAudioIndex = _setCurrentAudioIndex;

  return (
    <Context.Provider
      value={{
        currentAudioFile,
        setCurrentAudioFile,
        audioFiles,
        setAudioFiles,
        currentAudioIndex,
        setCurrentAudioIndex,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useGlobalContext must be used within a ContextProvider");
  }

  return context;
};
