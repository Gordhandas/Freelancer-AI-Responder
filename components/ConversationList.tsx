
import React, { useState } from 'react';
import { Conversation, ProfileData } from '../types';
import { translations } from '../lib/translations';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId: number;
    onSelectConversation: (id: number) => void;
    onRenameConversation: (id: number, newName: string) => void;
    profile: ProfileData;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    onRenameConversation,
    profile
}) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');
    const t = translations[profile.language];

    const handleStartEditing = (id: number, name: string) => {
        setEditingId(id);
        setEditingName(name);
    };

    const handleSaveRename = () => {
        if (editingId && editingName.trim()) {
            onRenameConversation(editingId, editingName.trim());
        }
        setEditingId(null);
        setEditingName('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveRename();
        } else if (e.key === 'Escape') {
            setEditingId(null);
            setEditingName('');
        }
    };

    return (
        <div className="bg-slate-800/40 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                <ChatBubbleIcon />
                {t.conversations}
            </h2>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                {conversations.map(convo => (
                    <button
                        key={convo.id}
                        onClick={() => onSelectConversation(convo.id)}
                        className={`relative w-full text-left p-3 rounded-lg transition-all duration-200 overflow-hidden ${
                            convo.id === activeConversationId
                                ? 'bg-slate-700/50 text-white'
                                : 'hover:bg-slate-700/30 text-slate-300'
                        }`}
                    >
                        {convo.id === activeConversationId && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-violet-500 rounded-r-full"></span>
                        )}
                        {editingId === convo.id ? (
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onBlur={handleSaveRename}
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                                className="w-full bg-slate-600 text-white p-1 rounded border-none font-medium truncate focus:ring-1 focus:ring-violet-500"
                            />
                        ) : (
                            <p 
                                className="font-semibold truncate"
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    handleStartEditing(convo.id, convo.name);
                                }}
                            >
                                {convo.name}
                            </p>
                        )}
                        <p className="text-xs text-slate-400 truncate mt-1">
                            {convo.history.length > 0 ? convo.history[0].clientMessage : t.noMessagesYet}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};