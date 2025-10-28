
import React from 'react';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
    onAddNewConversation: () => void;
    isSidebarVisible: boolean;
    onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddNewConversation, isSidebarVisible, onToggleSidebar }) => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">Freelancer AI Responder</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleSidebar}
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition"
                            aria-label={isSidebarVisible ? "Hide conversations sidebar" : "Show conversations sidebar"}
                        >
                            <ChatBubbleIcon />
                            <span className="hidden sm:inline">{isSidebarVisible ? 'Hide Conversations' : 'Show Conversations'}</span>
                        </button>
                         <button
                            onClick={onAddNewConversation}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition"
                            aria-label="Start new conversation"
                        >
                            <PlusIcon />
                            <span className="hidden sm:inline">New Chat</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
