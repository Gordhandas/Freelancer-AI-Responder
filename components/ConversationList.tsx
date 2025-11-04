
import React, { useState, useRef } from 'react';
import { Conversation, ProfileData } from '../types';
import { translations } from '../lib/translations';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId: number;
    onSelectConversation: (id: number) => void;
    onRenameConversation: (id: number, newName: string) => void;
    onImportConversations: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onExportConversations: () => void;
    onShareConversation: () => void;
    profile: ProfileData;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    onRenameConversation,
    onImportConversations,
    onExportConversations,
    onShareConversation,
    profile
}) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');
    const [linkCopied, setLinkCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleShareClick = () => {
        onShareConversation();
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2500);
    };


    return (
        <div className="bg-[var(--color-surface-secondary)]/60 p-6 rounded-2xl shadow-lg border border-[var(--color-border)]">
            <input
                type="file"
                ref={fileInputRef}
                onChange={onImportConversations}
                accept=".json"
                className="hidden"
                aria-hidden="true"
            />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                    <ChatBubbleIcon />
                    {t.conversations}
                </h2>
                <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                    <button
                        onClick={handleShareClick}
                        title={linkCopied ? t.linkCopied : t.tooltips.shareConversation}
                        className="p-2 rounded-lg hover:bg-[var(--color-interactive)] hover:text-[var(--color-text-primary)] transition-colors"
                        aria-label={t.share}
                    >
                        {linkCopied ? <CheckIcon /> : <ShareIcon />}
                    </button>
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        title={t.tooltips.importConversations} 
                        className="p-2 rounded-lg hover:bg-[var(--color-interactive)] hover:text-[var(--color-text-primary)] transition-colors"
                        aria-label={t.importConversations}
                    >
                        <UploadIcon />
                    </button>
                    <button 
                        onClick={onExportConversations} 
                        title={t.tooltips.exportConversations} 
                        className="p-2 rounded-lg hover:bg-[var(--color-interactive)] hover:text-[var(--color-text-primary)] transition-colors"
                        aria-label={t.exportConversations}
                    >
                        <DownloadIcon />
                    </button>
                </div>
            </div>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                {conversations.map(convo => (
                    <button
                        key={convo.id}
                        onClick={() => onSelectConversation(convo.id)}
                        className={`relative w-full text-left p-3 rounded-lg transition-all duration-200 overflow-hidden ${
                            convo.id === activeConversationId
                                ? 'bg-[var(--color-interactive)]/50 text-[var(--color-text-primary)]'
                                : 'hover:bg-[var(--color-interactive)]/30 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                        title={t.tooltips.selectConversation}
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
                                className="w-full bg-[var(--color-interactive-hover)] text-[var(--color-text-primary)] p-1 rounded border-none font-medium truncate focus:ring-1 focus:ring-violet-500"
                            />
                        ) : (
                            <p 
                                className="font-semibold truncate"
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    handleStartEditing(convo.id, convo.name);
                                }}
                                title={t.tooltips.renameConversation}
                            >
                                {convo.name}
                            </p>
                        )}
                        <p className="text-xs text-[var(--color-text-secondary)] truncate mt-1">
                            {convo.history.length > 0 ? convo.history[0].clientMessage : t.noMessagesYet}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};
