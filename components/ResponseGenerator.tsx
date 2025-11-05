
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MessageIcon } from './icons/MessageIcon';
import { HistoryItem, Tone, ResponseStyle, ProfileData, ModelId } from '../types';
import { translations, TranslationSet } from '../lib/translations';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { EditIcon } from './icons/EditIcon';
import { RetryIcon } from './icons/RetryIcon';
import { ReplyIcon } from './icons/ReplyIcon';
import { BoltIcon } from './icons/BoltIcon';
import { ToneIcon } from './icons/ToneIcon';
import { StyleIcon } from './icons/StyleIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { ModeIcon } from './icons/ModeIcon';
import { WebIcon } from './icons/WebIcon';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorIcon } from './icons/ErrorIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ThumbDownIcon } from './icons/ThumbDownIcon';
import { UserIcon } from './icons/UserIcon';


interface ResponseGeneratorProps {
    clientMessage: string;
    setClientMessage: React.Dispatch<React.SetStateAction<string>>;
    onGenerate: () => void;
    response: string;
    isLoading: boolean;
    error: string | null;
    tone: Tone;
    setTone: (tone: Tone) => void;
    responseStyle: ResponseStyle;
    setResponseStyle: (style: ResponseStyle) => void;
    modelId: ModelId;
    setModelId: (mode: ModelId) => void;
    useSearch: boolean;
    setUseSearch: (use: boolean) => void;
    history: HistoryItem[];
    onClearHistory: () => void;
    profile: ProfileData;
    onFeedback: (historyItemId: number, feedback: 'good' | 'bad') => void;
}

declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
            setOptions: (options: any) => void;
        };
        hljs: any;
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const modelToDisplayName = (modelId: ModelId, t: TranslationSet) => {
    switch (modelId) {
        case 'gemini-flash-lite-latest': return t.models.flashLite.name;
        case 'gemini-2.5-flash': return t.models.flash.name;
        case 'gemini-2.5-pro': return t.models.pro.name;
        default: return modelId;
    }
};

export const ResponseGenerator: React.FC<ResponseGeneratorProps> = ({
    clientMessage,
    setClientMessage,
    onGenerate,
    response,
    isLoading,
    error,
    tone,
    setTone,
    responseStyle,
    setResponseStyle,
    modelId,
    setModelId,
    useSearch,
    setUseSearch,
    history,
    onClearHistory,
    profile,
    onFeedback,
}) => {
    const [copied, setCopied] = useState(false);
    const [conversationCopied, setConversationCopied] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editableResponse, setEditableResponse] = useState(response);
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const speechRecognition = useRef<any>(null);
    const clientMessageRef = useRef<HTMLTextAreaElement>(null);
    const responseContainerRef = useRef<HTMLDivElement>(null);
    
    const t = translations[profile.language];
    const currentPrompts = t.promptLibrary[profile.role] || t.promptLibrary['Freelancer'];
    const currentResponseHistoryItem = history.length > 0 ? history[0] : null;

    useEffect(() => {
        setEditableResponse(response);
        setIsEditing(false);
        if (response && !isLoading) {
             setTimeout(() => responseContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }, [response, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = clientMessageRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to recalculate
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height to content height
        }
    }, [clientMessage]);
    
    // Setup Speech Recognition
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setSpeechError(t.voiceInputNotSupported);
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
             setClientMessage(prev => (prev.trim() ? prev + ' ' : '') + finalTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setSpeechError(t.voiceInputError(event.error));
            setIsListening(false);
        };

        speechRecognition.current = recognition;

        return () => {
            if (speechRecognition.current) {
                speechRecognition.current.stop();
            }
        };
    }, [t]);

     const handleToggleListening = () => {
        if (!speechRecognition.current) return;

        if (isListening) {
            speechRecognition.current.stop();
            setIsListening(false);
        } else {
            setSpeechError(null);
            navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
                speechRecognition.current.start();
                setIsListening(true);
            }).catch(() => {
                 setSpeechError(t.microphoneAccessDenied);
            });
        }
    };


    useEffect(() => {
        if (window.marked && window.hljs) {
            window.marked.setOptions({
                highlight: function (code: string, lang: string) {
                    if (lang && window.hljs.getLanguage(lang)) {
                        return window.hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
                    }
                    return window.hljs.highlightAuto(code).value;
                },
                langPrefix: 'hljs language-',
                gfm: true,
                breaks: true,
            });
        }
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(editableResponse);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyConversation = () => {
        const formatted = history.slice().reverse().map(item => {
            return `Client:\n${item.clientMessage}\n\nYou (${profile.name}):\n${item.generatedResponse}`;
        }).join('\n\n---\n\n');
    
        navigator.clipboard.writeText(formatted);
        setConversationCopied(true);
        setTimeout(() => setConversationCopied(false), 2000);
    };
    
    const handleReply = (message: string) => {
        setClientMessage(message);
        clientMessageRef.current?.focus();
        clientMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const generatedHtml = useMemo(() => {
        if (window.marked && editableResponse) {
            try {
                return window.marked.parse(editableResponse);
            } catch (e) {
                return editableResponse;
            }
        }
        return editableResponse;
    }, [editableResponse]);

    const historyHtml = useMemo(() => {
        return history.map(item => ({
            ...item,
            generatedResponseHtml: window.marked ? window.marked.parse(item.generatedResponse) : item.generatedResponse
        }));
    }, [history]);

    const handleSaveEdit = () => {
        setIsEditing(false);
    }
    
    const handleCancelEdit = () => {
        setEditableResponse(response); // Revert changes to original response
        setIsEditing(false);
    };

    const handleQuickPrompt = (prompt: string) => {
        setClientMessage(prompt);
        clientMessageRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading) {
                onGenerate();
            }
        }
    };

    const modelDescription = useMemo(() => {
        return t.models[modelId.includes('pro') ? 'pro' : (modelId.includes('lite') ? 'flashLite' : 'flash')].description;
    }, [modelId, t]);


    return (
        <div className="bg-[var(--color-surface-secondary)]/60 p-6 rounded-2xl shadow-lg border border-[var(--color-border)] flex flex-col gap-6 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
            
            {/* Client Message Input */}
            <div>
                <label htmlFor="clientMessage" className="block text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                    <MessageIcon />
                    {t.clientMessage}
                </label>
                <div className="relative w-full">
                    <textarea
                        id="clientMessage"
                        ref={clientMessageRef}
                        value={clientMessage}
                        onChange={(e) => setClientMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.clientMessagePlaceholder}
                        rows={3}
                        className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg p-4 pr-12 pb-12 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition text-base placeholder:text-[var(--color-text-placeholder)] max-h-64 overflow-y-auto"
                        title={t.tooltips.clientMessage}
                    />
                     <button
                        onClick={handleToggleListening}
                        disabled={!!speechError && !isListening}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500
                            ${isListening ? 'text-cyan-300 animate-pulse-fast bg-violet-500/50' : 'bg-[var(--color-interactive)]/50 hover:bg-[var(--color-interactive-hover)] text-[var(--color-text-secondary)]'}
                            ${(!!speechError && !isListening) ? 'cursor-not-allowed bg-red-500/20 text-red-400' : ''}
                        `}
                        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                        title={isListening ? t.tooltips.voiceInputStop : (speechError ? t.tooltips.voiceInputNotSupported : t.tooltips.voiceInputStart)}
                    >
                        <MicrophoneIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setUseSearch(!useSearch)}
                        className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500
                            ${useSearch ? 'text-cyan-300 bg-violet-500/50' : 'bg-[var(--color-interactive)]/50 hover:bg-[var(--color-interactive-hover)] text-[var(--color-text-secondary)]'}
                        `}
                        aria-pressed={useSearch}
                        title={t.tooltips.toggleWebSearch}
                    >
                        <WebIcon />
                    </button>
                </div>
                {speechError && <p className="text-xs text-red-400 mt-2">{speechError}</p>}
            </div>

            {/* Prompt Library */}
            <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-[var(--color-text-secondary)] flex items-center gap-2">
                    <BoltIcon />
                    {t.promptLibraryFor(profile.role)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentPrompts.map(({ title, prompt }) => (
                        <button 
                            key={title} 
                            onClick={() => handleQuickPrompt(prompt)} 
                            className="p-3 bg-[var(--color-interactive)]/50 hover:bg-[var(--color-interactive)]/80 rounded-lg text-left transition-colors text-[var(--color-text-primary)] text-opacity-90 hover:text-opacity-100"
                            title={t.tooltips.quickPrompt(prompt)}
                        >
                            <p className="font-semibold text-sm text-[var(--color-text-primary)]">{title}</p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">{prompt}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Generation Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="model" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t.model}</label>
                    <select
                        id="model"
                        value={modelId}
                        onChange={(e) => setModelId(e.target.value as ModelId)}
                        className="w-full bg-[var(--color-surface-tertiary)] border border-[var(--color-border)] rounded-md p-2.5 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition"
                        title={t.tooltips.model}
                    >
                        <option value="gemini-flash-lite-latest">{t.models.flashLite.name}</option>
                        <option value="gemini-2.5-flash">{t.models.flash.name}</option>
                        <option value="gemini-2.5-pro">{t.models.pro.name}</option>
                    </select>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-2 h-8">{modelDescription}</p>
                </div>
                {[
                    { label: t.tone, value: tone, setter: setTone, options: ['Casual', 'Formal', 'Enthusiastic'] },
                    { label: t.style, value: responseStyle, setter: setResponseStyle, options: ['Default', 'Short & Sweet', 'Detailed Explanation'] },
                ].map(({ label, value, setter, options }) => (
                     <div key={label}>
                        <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{label}</label>
                        <select
                            id={label.toLowerCase()}
                            value={value}
                            onChange={(e) => (setter as (value: string) => void)(e.target.value)}
                            className="w-full bg-[var(--color-surface-tertiary)] border border-[var(--color-border)] rounded-md p-2.5 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition"
                            title={label === t.tone ? t.tooltips.tone : t.tooltips.style}
                        >
                            {options.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                    </div>
                ))}
            </div>
             <div className="flex items-center justify-start pt-2">
                <label htmlFor="search-toggle" className="flex items-center cursor-pointer select-none" title={t.tooltips.toggleWebSearch}>
                    <div className="relative">
                        <input type="checkbox" id="search-toggle" className="sr-only" checked={useSearch} onChange={() => setUseSearch(!useSearch)} />
                        <div className={`block w-12 h-6 rounded-full transition ${useSearch ? 'bg-violet-500' : 'bg-[var(--color-interactive)]'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useSearch ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-[var(--color-text-secondary)] font-medium text-sm">{t.searchTheWeb}</span>
                </label>
            </div>


            {/* Action Buttons */}
            <div className="flex items-stretch gap-4 pt-2">
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="relative flex-grow w-full flex items-center justify-center gap-2 bg-gradient-to-br from-violet-600 via-cyan-500 to-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:shadow-none shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]"
                    title={!isLoading ? t.tooltips.generateResponse : undefined}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t.generating}
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            {t.generateResponse}
                        </>
                    )}
                </button>
                 {error && !isLoading && (
                    <button
                        onClick={onGenerate}
                        className="flex-shrink-0 flex items-center justify-center gap-2 bg-[var(--color-interactive)] hover:bg-[var(--color-interactive-hover)] text-[var(--color-text-primary)] font-bold py-3 px-4 rounded-lg transition"
                        aria-label="Retry generation"
                        title={t.tooltips.retry}
                    >
                        <RetryIcon />
                        <span>{t.retry}</span>
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm break-words animate-fade-in">
                    <ErrorIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" />
                    <pre className="whitespace-pre-wrap font-sans">{error}</pre>
                </div>
            )}

            {/* Generated Response */}
            <div ref={responseContainerRef} className="scroll-mt-8">
            {(response || isLoading) && (
                <div className="border-t border-[var(--color-border)] pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{t.generatedResponseTitle}</h3>
                        {response && !isEditing && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 bg-[var(--color-interactive)] hover:bg-[var(--color-interactive-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold py-1.5 px-3 rounded-lg transition text-sm"
                                    aria-label="Edit response" 
                                    title={t.tooltips.editResponse}>
                                    <EditIcon /> {t.edit}
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 bg-[var(--color-interactive)] hover:bg-[var(--color-interactive-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold py-1.5 px-3 rounded-lg transition text-sm"
                                    aria-label="Copy response" 
                                    title={t.tooltips.copyResponse}>
                                    <CopyIcon /> {copied ? t.copied : t.copy}
                                </button>
                            </div>
                        )}
                    </div>
                    {isLoading && !response && (
                        <LoadingIndicator profile={profile} />
                    )}
                    {response && (
                        isEditing ? (
                            <div>
                                <textarea
                                    value={editableResponse}
                                    onChange={(e) => setEditableResponse(e.target.value)}
                                    rows={10}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition resize-y text-base"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={handleCancelEdit} className="bg-[var(--color-interactive)] hover:bg-[var(--color-interactive-hover)] text-[var(--color-text-primary)] font-semibold py-2 px-4 rounded-lg transition" title={t.tooltips.cancelChanges}>{t.cancel}</button>
                                    <button onClick={handleSaveEdit} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition" title={t.tooltips.saveChanges}>{t.save}</button>
                                </div>
                            </div>
                        ) : (
                             <>
                                 <div 
                                    className="prose-custom max-w-none"
                                    dangerouslySetInnerHTML={{ __html: generatedHtml }} 
                                 />
                                 {currentResponseHistoryItem?.searchResults && currentResponseHistoryItem.searchResults.length > 0 && (
                                     <div className="mt-6 pt-4 border-t border-[var(--color-border)]/50">
                                         <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
                                             <WebIcon /> {t.searchResults}
                                         </h4>
                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                             {currentResponseHistoryItem.searchResults.map((source, index) => (
                                                 <a 
                                                     key={index}
                                                     href={source.uri}
                                                     target="_blank"
                                                     rel="noopener noreferrer"
                                                     className="bg-[var(--color-interactive)]/50 hover:bg-[var(--color-interactive)]/80 p-3 rounded-lg truncate transition-colors group"
                                                     title={source.uri}
                                                 >
                                                     <p className="font-semibold text-[var(--color-text-primary)] group-hover:text-cyan-400 truncate">{source.title}</p>
                                                     <p className="text-xs text-[var(--color-text-secondary)] truncate mt-1">{source.uri}</p>
                                                 </a>
                                             ))}
                                         </div>
                                     </div>
                                 )}
                             </>
                        )
                    )}
                </div>
            )}
            </div>

            {/* History Section */}
            {history.length > 0 && (
                <div className="border-t border-[var(--color-border)] pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setIsHistoryVisible(!isHistoryVisible)} className="flex items-center gap-2 text-lg font-bold text-[var(--color-text-primary)] w-full" title={t.tooltips.toggleHistory}>
                            <HistoryIcon />
                            {t.responseHistory}
                            <span className={`transform transition-transform ${isHistoryVisible ? 'rotate-180' : 'rotate-0'}`}>
                                <ChevronDownIcon />
                            </span>
                        </button>
                        {isHistoryVisible && (
                             <div className="flex items-center gap-2">
                                <button onClick={handleCopyConversation} className="flex-shrink-0 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition" title={t.tooltips.copyConversation}>
                                    <ClipboardListIcon />
                                    {conversationCopied ? t.copied : t.copyConversation}
                                </button>
                                <button onClick={onClearHistory} className="flex-shrink-0 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition" title={t.tooltips.clearHistory}>
                                    <TrashIcon />
                                    {t.clear}
                                </button>
                            </div>
                        )}
                    </div>
                    {isHistoryVisible && (
                        <div className="space-y-6">
                            {historyHtml.map((item, index) => (
                                <div key={item.id} className={`bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]/50 transition-all overflow-hidden ${index === 0 ? 'border-violet-500/50 shadow-lg shadow-violet-500/5' : ''}`}>
                                    {/* Client Message */}
                                    <div className="p-4 bg-[var(--color-surface-secondary)]">
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)]">
                                                <UserIcon className="h-5 w-5" />
                                                {t.client}
                                            </p>
                                            <button 
                                                onClick={() => handleReply(item.clientMessage)} 
                                                className="flex items-center gap-1.5 bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold py-1 px-2.5 rounded-md transition text-xs"
                                                aria-label="Reply to this message"
                                                title={t.tooltips.replyToMessage}>
                                                <ReplyIcon />
                                                {t.reply}
                                            </button>
                                        </div>
                                        <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap text-sm">{item.clientMessage}</p>
                                    </div>

                                    {/* AI Response */}
                                    <div className="p-4">
                                        <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                                            <SparklesIcon className="h-5 w-5 text-cyan-400" />
                                            {t.you}
                                        </p>
                                        <div 
                                            className="prose-custom prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: item.generatedResponseHtml }}
                                        />
                                        {item.searchResults && item.searchResults.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-[var(--color-border)]/50">
                                                <h4 className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
                                                    <WebIcon /> {t.searchResults}
                                                </h4>
                                                <div className="grid grid-cols-1 gap-2 text-xs">
                                                    {item.searchResults.map((source, idx) => (
                                                        <a 
                                                            key={idx}
                                                            href={source.uri}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-[var(--color-interactive)]/40 hover:bg-[var(--color-interactive)]/70 p-2 rounded-md truncate transition-colors group"
                                                            title={source.uri}
                                                        >
                                                            <p className="font-medium text-[var(--color-text-secondary)] group-hover:text-cyan-400 truncate">{source.title}</p>
                                                            <p className="text-[var(--color-text-placeholder)] truncate">{source.uri}</p>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="mt-4 pt-4 border-t border-[var(--color-border)]/50 flex flex-wrap justify-between items-center gap-x-4 gap-y-2 text-xs text-[var(--color-text-secondary)]">
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                                <div className="flex items-center gap-1.5"><ModeIcon modelId={item.modelId} /> {modelToDisplayName(item.modelId, t)}</div>
                                                <div className="flex items-center gap-1.5"><ToneIcon /> {item.tone}</div>
                                                <div className="flex items-center gap-1.5"><StyleIcon /> {item.responseStyle}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => onFeedback(item.id, 'good')}
                                                    className={`p-1.5 rounded-full transition-colors ${item.feedback === 'good' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-[var(--color-interactive)]'}`}
                                                    title={t.tooltips.goodResponse}
                                                >
                                                    <ThumbUpIcon />
                                                </button>
                                                 <button 
                                                    onClick={() => onFeedback(item.id, 'bad')}
                                                    className={`p-1.5 rounded-full transition-colors ${item.feedback === 'bad' ? 'bg-red-500/20 text-red-400' : 'hover:bg-[var(--color-interactive)]'}`}
                                                    title={t.tooltips.badResponse}
                                                >
                                                    <ThumbDownIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
