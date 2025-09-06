import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { generateText } from '../services/geminiService';
import { stopSpeaking } from '../services/ttsService';
import Message from './Message';
import SendIcon from './icons/SendIcon';
import WelcomeMessage from './WelcomeMessage';

const AITypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2 p-4">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
);

interface ChatInterfaceProps {
  playAudio: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ playAudio }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (isLoading || !text.trim()) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      author: MessageAuthor.USER,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const aiResponseText = await generateText(text);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        author: MessageAuthor.AI,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Apologies, I'm having trouble connecting right now.",
        author: MessageAuthor.AI,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handlePlayAudio = useCallback((text: string) => {
    playAudio(text);
  }, [playAudio]);

  return (
    <div className="flex flex-col flex-1 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
      {messages.length === 0 ? (
        <WelcomeMessage onPromptClick={handleSendMessage} />
      ) : (
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((msg, index) => (
            <Message 
              key={msg.id} 
              message={msg} 
              onPlayAudio={handlePlayAudio}
              isLastMessage={index === messages.length - 1}
              isLoading={isLoading}
            />
          ))}
          {isLoading && <AITypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;