import React from 'react';
import BotIcon from './icons/BotIcon';
import SparklesIcon from './icons/SparklesIcon';

interface WelcomeMessageProps {
  onPromptClick: (prompt: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onPromptClick }) => {
  const prompts = [
    "Tell me a fun fact about the ocean",
    "Explain quantum computing in simple terms",
    "Write a short poem about space",
    "What's the weather like in Tokyo?",
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
          <BotIcon />
        </div>
        <div className="absolute -top-2 -right-2 text-yellow-400">
          <SparklesIcon />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-200 mb-2">
        AI Audio Chat Box
      </h2>
      <p className="max-w-md mb-8">
        Welcome! I'm Gemini, your conversational AI. I can answer questions, tell stories, and more. Type a message below or try one of these prompts to start.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="p-3 bg-gray-700/50 rounded-lg text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeMessage;
