import React, { useState, useEffect } from 'react';
import { translations } from '../lib/translations';
import { ProfileData } from '../types';

const ThinkingIcon: React.FC = () => (
    <div className="relative h-16 w-16">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.871 14.755c2.193-1.113 3.69-3.41 3.69-6.088 0-3.75-2.7-6.817-6.188-6.817a6.43 6.43 0 00-1.63 12.38M19.129 14.755c-2.193-1.113-3.69-3.41-3.69-6.088 0-3.75 2.7-6.817 6.188-6.817a6.43 6.43 0 011.63 12.38M12 16a3 3 0 100-6 3 3 0 000 6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.01 9.01 0 008.83-6.17M12 21a9.01 9.01 0 01-8.83-6.17" />
        </svg>

        <div className="absolute top-0 left-0 h-full w-full animate-spin-slow">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute top-0 left-1/2 -translate-x-1/2 text-violet-500 animate-pulse-fast" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        </div>
    </div>
);


interface LoadingIndicatorProps {
    profile: ProfileData;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ profile }) => {
    const t = translations[profile.language];
    const messages = t.generatingMessages || [t.generating];
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        // Reset index when language changes
        setMessageIndex(0);
    }, [profile.language]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[var(--color-surface)]/50 rounded-lg border border-dashed border-[var(--color-border)] my-4 animate-fade-in">
            <ThinkingIcon />
            <div className="mt-4 text-lg font-semibold text-[var(--color-text-primary)] text-center overflow-hidden h-7">
                <p key={messageIndex} className="animate-slide-in-up">{messages[messageIndex]}</p>
            </div>
        </div>
    );
};
