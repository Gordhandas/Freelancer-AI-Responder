
import React from 'react';
import { translations } from '../lib/translations';
import { ProfileData } from '../types';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
    onAddNewConversation: () => void;
    isSidebarVisible: boolean;
    onToggleSidebar: () => void;
    profile: ProfileData;
}

export const Header: React.FC<HeaderProps> = ({ onAddNewConversation, isSidebarVisible, onToggleSidebar, profile }) => {
    const t = translations[profile.language];
    
    return (
        <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-20 animate-fade-in">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-cyan-500 to-violet-500 p-2.5 rounded-xl shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t.aiResponderPro}</h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={onToggleSidebar}
                            className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                            aria-label={isSidebarVisible ? `${t.hide} ${t.conversations} sidebar` : `${t.show} ${t.conversations} sidebar`}
                        >
                            <ChatBubbleIcon />
                            <span className="hidden sm:inline">{isSidebarVisible ? t.hide : t.show} {t.conversations}</span>
                        </button>
                         <button
                            onClick={onAddNewConversation}
                            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.7)]"
                            aria-label="Start new conversation"
                        >
                            <PlusIcon />
                            <span className="hidden sm:inline">{t.newChat}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};