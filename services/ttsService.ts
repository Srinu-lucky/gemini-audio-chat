interface SpeakCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export const speak = (
  text: string, 
  voice: SpeechSynthesisVoice | null, 
  rate: number,
  callbacks?: SpeakCallbacks
): void => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech to prevent overlap and reset state
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // Fallback language if no voice is selected
      utterance.lang = 'en-US';
    }
    utterance.rate = rate;
    utterance.pitch = 1;

    // Attach callbacks
    if (callbacks) {
      utterance.onstart = callbacks.onStart || null;
      // onend fires for both natural completion and cancellation
      utterance.onend = callbacks.onEnd || null;
      utterance.onpause = callbacks.onPause || null;
      utterance.onresume = callbacks.onResume || null;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Sorry, your browser does not support text-to-speech.");
    alert("Sorry, your browser does not support text-to-speech.");
  }
};

export const pauseSpeaking = (): void => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
    }
};

export const resumeSpeaking = (): void => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
    }
};

export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};