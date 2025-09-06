import React, { useState, useEffect, useCallback } from 'react';
import ChatInterface from './components/ChatInterface';
import AudioControls from './components/AudioControls';
import TrashIcon from './components/icons/TrashIcon';
import { 
  speak, 
  pauseSpeaking, 
  resumeSpeaking, 
  stopSpeaking 
} from './services/ttsService';

const App: React.FC = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [speechRate, setSpeechRate] = useState(1);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        // Filter for English voices for a cleaner list
        const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
        setVoices(englishVoices);
        
        // Set a default voice if one isn't already selected
        if (!selectedVoice && englishVoices.length > 0) {
          // Prefer "Google" voices as they often have higher quality
          const googleVoice = englishVoices.find(v => v.name.includes('Google')) || englishVoices[0];
          setSelectedVoice(googleVoice);
        }
      }
    };

    // Voices are loaded asynchronously. The 'voiceschanged' event fires when they are ready.
    window.speechSynthesis.onvoiceschanged = loadVoices;
    // Call it directly in case the voices are already loaded
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      // Ensure speech is stopped when the app unmounts/reloads
      stopSpeaking();
    };
  }, [selectedVoice]);

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find(v => v.name === selectedVoiceName) || null;
    setSelectedVoice(voice);
    stopSpeaking(); // Stop any current speech when voice changes
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechRate(parseFloat(event.target.value));
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the entire conversation?")) {
      stopSpeaking();
      setChatKey(prevKey => prevKey + 1);
    }
  };

  // Callbacks for the speech synthesis events
  const handleSpeakStart = useCallback(() => {
    setIsSpeaking(true);
    setIsPaused(false);
  }, []);

  const handleSpeakEnd = useCallback(() => {
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const handleSpeakPause = useCallback(() => {
    setIsPaused(true);
    setIsSpeaking(true); // Still "speaking" in a paused state
  }, []);

  const handleSpeakResume = useCallback(() => {
    setIsPaused(false);
  }, []);
  
  // Function to be passed down to initiate speech
  const playAudio = useCallback((text: string) => {
    speak(text, selectedVoice, speechRate, {
      onStart: handleSpeakStart,
      onEnd: handleSpeakEnd,
      onPause: handleSpeakPause,
      onResume: handleSpeakResume,
    });
  }, [selectedVoice, speechRate, handleSpeakStart, handleSpeakEnd, handleSpeakPause, handleSpeakResume]);
  
  // Handlers for the UI controls
  const handlePause = () => pauseSpeaking();
  const handleResume = () => resumeSpeaking();
  const handleStop = () => stopSpeaking();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl h-[90vh] flex flex-col">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            AI Audio Chat Box
          </h1>
          <p className="text-gray-400 mt-2">
            Chat with Gemini and hear its responses spoken aloud.
          </p>
          {voices.length > 0 && (
            <div className="mt-4 max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-2">
                <div className="flex-grow">
                  <label htmlFor="voice-select" className="sr-only">Choose a voice:</label>
                  <select
                    id="voice-select"
                    value={selectedVoice?.name || ''}
                    onChange={handleVoiceChange}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-center cursor-pointer"
                    aria-label="Select a voice for text-to-speech"
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {`${voice.name} (${voice.lang})`}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleClearChat}
                  className="flex-shrink-0 bg-gray-700 text-white p-2.5 rounded-full hover:bg-red-500/80 disabled:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                  aria-label="Clear conversation history"
                >
                  <TrashIcon />
                </button>
              </div>
              <div className="mt-4">
                <label htmlFor="rate-slider" className="block text-sm font-medium text-gray-400 text-center mb-2">
                  Speech Rate: {speechRate.toFixed(1)}x
                </label>
                <input
                  id="rate-slider"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={handleRateChange}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-400"
                  aria-label="Adjust speech rate"
                />
              </div>
            </div>
          )}
          <AudioControls 
            isSpeaking={isSpeaking}
            isPaused={isPaused}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
          />
        </header>
        <ChatInterface key={chatKey} playAudio={playAudio} />
      </div>
    </div>
  );
};

export default App;