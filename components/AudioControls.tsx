
import React from 'react';
import PauseIcon from './icons/PauseIcon';
import PlayIcon from './icons/PlayIcon';
import StopIcon from './icons/StopIcon';

interface AudioControlsProps {
  isSpeaking: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isSpeaking,
  isPaused,
  onPause,
  onResume,
  onStop,
}) => {
  if (!isSpeaking) {
    return null; // Don't render anything if nothing is playing
  }

  return (
    <div className="mt-4 flex justify-center items-center space-x-4 p-2 bg-gray-700/50 rounded-full">
      {isPaused ? (
        <button
          onClick={onResume}
          className="text-white p-2 rounded-full hover:bg-indigo-500/50 transition-colors duration-200"
          aria-label="Resume audio"
        >
          <PlayIcon />
        </button>
      ) : (
        <button
          onClick={onPause}
          className="text-white p-2 rounded-full hover:bg-indigo-500/50 transition-colors duration-200"
          aria-label="Pause audio"
        >
          <PauseIcon />
        </button>
      )}
      <button
        onClick={onStop}
        className="text-white p-2 rounded-full hover:bg-red-500/50 transition-colors duration-200"
        aria-label="Stop audio"
      >
        <StopIcon />
      </button>
    </div>
  );
};

export default AudioControls;
