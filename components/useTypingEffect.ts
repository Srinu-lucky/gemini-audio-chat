import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook for creating a typing animation effect.
 * @param text The full text to be typed out.
 * @param speed The typing speed in milliseconds per character.
 * @param onComplete A callback function to execute when the typing is finished.
 * @returns An object containing the text to display and a completion status.
 */
export const useTypingEffect = (
  text: string,
  speed: number = 30,
  onComplete?: () => void
) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Use useCallback to memoize onComplete to prevent useEffect from re-running unnecessarily
  const memoizedOnComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    // Only start if there's text to type
    if (!text) {
        setDisplayedText('');
        setIsComplete(true);
        return;
    };

    setIsComplete(false);
    setDisplayedText('');

    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
        memoizedOnComplete();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, memoizedOnComplete]);

  return { displayedText, isComplete };
};
