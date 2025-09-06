
import React from 'react';

const BotIcon: React.FC = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="w-6 h-6"
    >
        <path d="M12 8V4H8" />
        <rect x="4" y="12" width="16" height="8" rx="2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M12 12v-2" />
        <path d="M12 20v-4" />
        <path d="M4 12V8a2 2 0 0 1 2-2h4" />
        <path d="M16 6h2a2 2 0 0 1 2 2v4" />
    </svg>
);

export default BotIcon;
