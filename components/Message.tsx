import React, { useCallback } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import SpeakerIcon from './icons/SpeakerIcon';
import { useTypingEffect } from './useTypingEffect';

interface MessageProps {
  message: ChatMessage;
  onPlayAudio: (text: string) => void;
  isLastMessage: boolean;
  isLoading: boolean;
}

const Message: React.FC<MessageProps> = ({ message, onPlayAudio, isLastMessage, isLoading }) => {
  const isAI = message.author === MessageAuthor.AI;

  const handlePlayClick = () => {
    onPlayAudio(message.text);
  };
  
  const onAnimationComplete = useCallback(() => {
    onPlayAudio(message.text);
  }, [onPlayAudio, message.text]);

  // Animate if it's the last message from the AI and we are not waiting for a response.
  const shouldAnimate = isAI && isLastMessage && !isLoading;

  const { displayedText, isComplete } = useTypingEffect(
    shouldAnimate ? message.text : '',
    30,
    onAnimationComplete
  );

  const textToRender = shouldAnimate ? displayedText : message.text;
  const showListenButton = isAI && (shouldAnimate ? isComplete : true);

  return (
    <div className={`flex items-start gap-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
            <BotIcon />
        </div>
      )}
      
      <div className={`max-w-md lg:max-w-lg p-4 rounded-2xl shadow-lg ${isAI ? 'bg-gray-700 rounded-tl-none' : 'bg-purple-600 text-white rounded-br-none'}`}>
        <p className="text-base whitespace-pre-wrap min-h-[1em]">{textToRender}</p>
        {showListenButton && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handlePlayClick}
              className="flex items-center space-x-2 text-indigo-300 hover:text-indigo-200 transition-colors duration-200 text-sm focus:outline-none"
              aria-label="Play audio response"
            >
              <SpeakerIcon />
              <span>Listen</span>
            </button>
          </div>
        )}
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center shadow-md">
            <UserIcon />
        </div>
      )}
    </div>
  );
};

export default Message;