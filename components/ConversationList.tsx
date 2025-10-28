import React, { useState } from 'react';
import { Conversation } from '../types';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId: number;
    onSelectConversation: (id: number) => void;
    onRenameConversation: (id: number, newName: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    onRenameConversation,
}) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');

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
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <ChatBubbleIcon />
                Conversations
            </h2>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {conversations.map(convo => (
                    <button
                        key={convo.id}
                        onClick={() => onSelectConversation(convo.id)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                            convo.id === activeConversationId
                                ? 'bg-blue-500/20 text-blue-200'
                                : 'hover:bg-gray-700/50'
                        }`}
                    >
                        {editingId === convo.id ? (
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onBlur={handleSaveRename}
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                                className="w-full bg-gray-600 text-white p-0 rounded border-none font-medium truncate focus:ring-1 focus:ring-blue-500"
                            />
                        ) : (
                            <p 
                                className="font-medium truncate"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartEditing(convo.id, convo.name);
                                }}
                            >
                                {convo.name}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 truncate mt-1">
                            {convo.history.length > 0 ? convo.history[0].clientMessage : 'No messages yet'}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};