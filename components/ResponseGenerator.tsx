import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MessageIcon } from './icons/MessageIcon';
import { HistoryItem, Tone, ResponseStyle, ProfileData, GenerationMode } from '../types';
import { translations } from '../lib/translations';
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
    generationMode: GenerationMode;
    setGenerationMode: (mode: GenerationMode) => void;
    useSearch: boolean;
    setUseSearch: (use: boolean) => void;
    history: HistoryItem[];
    onClearHistory: () => void;
    profile: ProfileData;
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
    generationMode,
    setGenerationMode,
    useSearch,
    setUseSearch,
    history,
    onClearHistory,
    profile,
}) => {
    const [copied, setCopied] = useState(false);
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


    return (
        <div className="bg-slate-800/40 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col gap-6 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
            
            {/* Client Message Input */}
            <div>
                <label htmlFor="clientMessage" className="block text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <MessageIcon />
                    {t.clientMessage}
                </label>
                <div className="relative w-full">
                    <textarea
                        id="clientMessage"
                        ref={clientMessageRef}
                        value={clientMessage}
                        onChange={(e) => setClientMessage(e.target.value)}
                        placeholder={t.clientMessagePlaceholder}
                        rows={8}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 pr-12 pb-12 text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition resize-y text-base placeholder:text-slate-500"
                    />
                     <button
                        onClick={handleToggleListening}
                        disabled={!!speechError && !isListening}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500
                            ${isListening ? 'text-cyan-300 animate-pulse-fast bg-violet-500/50' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400'}
                            ${(!!speechError && !isListening) ? 'cursor-not-allowed bg-red-500/20 text-red-400' : ''}
                        `}
                        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                        title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                        <MicrophoneIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setUseSearch(!useSearch)}
                        className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500
                            ${useSearch ? 'text-cyan-300 bg-violet-500/50' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400'}
                        `}
                        aria-pressed={useSearch}
                        title={t.searchTheWeb}
                    >
                        <WebIcon />
                    </button>
                </div>
                {speechError && <p className="text-xs text-red-400 mt-2">{speechError}</p>}
            </div>

            {/* Prompt Library */}
            <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-slate-300 flex items-center gap-2">
                    <BoltIcon />
                    {t.promptLibraryFor(profile.role)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentPrompts.map(({ title, prompt }) => (
                        <button 
                            key={title} 
                            onClick={() => handleQuickPrompt(prompt)} 
                            className="p-3 bg-slate-700/50 hover:bg-slate-700/80 rounded-lg text-left transition-colors text-white text-opacity-90 hover:text-opacity-100"
                            title={prompt}
                        >
                            <p className="font-semibold text-sm text-slate-100">{title}</p>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prompt}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Generation Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="mode" className="block text-sm font-medium text-slate-400 mb-1">{t.mode}</label>
                    <select
                        id="mode"
                        value={generationMode}
                        onChange={(e) => setGenerationMode(e.target.value as GenerationMode)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                    >
                        <option value="Fast">{t.fast}</option>
                        <option value="Balanced">{t.balanced}</option>
                        <option value="Thinking">{t.thinking}</option>
                    </select>
                </div>
                {[
                    { label: t.tone, value: tone, setter: setTone, options: ['Casual', 'Formal', 'Enthusiastic'] },
                    { label: t.style, value: responseStyle, setter: setResponseStyle, options: ['Default', 'Short & Sweet', 'Detailed Explanation'] },
                ].map(({ label, value, setter, options }) => (
                     <div key={label}>
                        <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
                        <select
                            id={label.toLowerCase()}
                            value={value}
                            onChange={(e) => (setter as (value: string) => void)(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                        >
                            {options.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                    </div>
                ))}
            </div>
             <div className="flex items-center justify-start pt-2">
                <label htmlFor="search-toggle" className="flex items-center cursor-pointer select-none">
                    <div className="relative">
                        <input type="checkbox" id="search-toggle" className="sr-only" checked={useSearch} onChange={() => setUseSearch(!useSearch)} />
                        <div className={`block w-12 h-6 rounded-full transition ${useSearch ? 'bg-violet-500' : 'bg-slate-600'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useSearch ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-slate-300 font-medium text-sm">{t.searchTheWeb}</span>
                </label>
            </div>


            {/* Action Buttons */}
            <div className="flex items-stretch gap-4 pt-2">
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="relative flex-grow w-full flex items-center justify-center gap-2 bg-gradient-to-br from-violet-600 via-cyan-500 to-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:shadow-none shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]"
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
                        className="flex-shrink-0 flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition"
                        aria-label="Retry generation"
                    >
                        <RetryIcon />
                        <span>{t.retry}</span>
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm break-words"><pre className="whitespace-pre-wrap font-sans">{error}</pre></div>}

            {/* Generated Response */}
            <div ref={responseContainerRef} className="scroll-mt-8">
            {(response || isLoading) && (
                <div className="border-t border-slate-700 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">{t.generatedResponseTitle}</h3>
                        {response && !isEditing && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-1.5 px-3 rounded-lg transition text-sm"
                                    aria-label="Edit response" >
                                    <EditIcon /> {t.edit}
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-1.5 px-3 rounded-lg transition text-sm"
                                    aria-label="Copy response" >
                                    <CopyIcon /> {copied ? t.copied : t.copy}
                                </button>
                            </div>
                        )}
                    </div>
                    {isLoading && !response && (
                        <div className="space-y-4">
                            <div className="h-4 shimmer rounded w-3/4"></div>
                            <div className="h-4 shimmer rounded w-full"></div>
                            <div className="h-4 shimmer rounded w-5/6"></div>
                        </div>
                    )}
                    {response && (
                        isEditing ? (
                            <div>
                                <textarea
                                    value={editableResponse}
                                    onChange={(e) => setEditableResponse(e.target.value)}
                                    rows={10}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition resize-y text-base"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={handleCancelEdit} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition">{t.cancel}</button>
                                    <button onClick={handleSaveEdit} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition">{t.save}</button>
                                </div>
                            </div>
                        ) : (
                             <>
                                 <div 
                                    className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-white prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-violet-500 prose-li:marker:text-cyan-400 max-w-none"
                                    dangerouslySetInnerHTML={{ __html: generatedHtml }} 
                                 />
                                 {currentResponseHistoryItem?.searchResults && currentResponseHistoryItem.searchResults.length > 0 && (
                                     <div className="mt-6 pt-4 border-t border-slate-700/50">
                                         <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                                             <WebIcon /> {t.searchResults}
                                         </h4>
                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                             {currentResponseHistoryItem.searchResults.map((source, index) => (
                                                 <a 
                                                     key={index}
                                                     href={source.uri}
                                                     target="_blank"
                                                     rel="noopener noreferrer"
                                                     className="bg-slate-700/50 hover:bg-slate-700/80 p-3 rounded-lg truncate transition-colors group"
                                                     title={source.uri}
                                                 >
                                                     <p className="font-semibold text-slate-200 group-hover:text-cyan-400 truncate">{source.title}</p>
                                                     <p className="text-xs text-slate-400 truncate mt-1">{source.uri}</p>
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
                <div className="border-t border-slate-700 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setIsHistoryVisible(!isHistoryVisible)} className="flex items-center gap-2 text-lg font-bold text-white w-full">
                            <HistoryIcon />
                            {t.responseHistory}
                            <span className={`transform transition-transform ${isHistoryVisible ? 'rotate-180' : 'rotate-0'}`}>
                                <ChevronDownIcon />
                            </span>
                        </button>
                        {isHistoryVisible && (
                            <button onClick={onClearHistory} className="flex-shrink-0 flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition">
                                <TrashIcon />
                                {t.clear}
                            </button>
                        )}
                    </div>
                    {isHistoryVisible && (
                        <div className="space-y-6">
                            {historyHtml.map((item, index) => (
                                <div key={item.id} className={`p-4 bg-slate-700/30 rounded-lg border border-slate-700/50 transition-all ${index === 0 ? 'border-violet-500/50 shadow-lg shadow-violet-500/5' : ''}`}>
                                    <div className="flex justify-between items-center border-b border-slate-600/50 pb-3 mb-3">
                                        <p className="text-sm font-semibold text-slate-300">{t.client}</p>
                                        <button 
                                            onClick={() => handleReply(item.clientMessage)} 
                                            className="flex items-center gap-1.5 bg-slate-600/50 hover:bg-slate-600 text-slate-300 font-semibold py-1 px-2.5 rounded-md transition text-xs"
                                            aria-label="Reply to this message">
                                            <ReplyIcon />
                                            {t.reply}
                                        </button>
                                    </div>
                                    <p className="text-slate-300 whitespace-pre-wrap text-sm mb-4">{item.clientMessage}</p>
                                    <p className="text-sm font-semibold text-white mb-3 border-b border-slate-600/50 pb-3">{t.you}</p>
                                    <div 
                                        className="prose prose-sm prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-white prose-a:text-cyan-400 max-w-none"
                                        dangerouslySetInnerHTML={{ __html: item.generatedResponseHtml }}
                                    />
                                    {item.searchResults && item.searchResults.length > 0 && (
                                         <div className="mt-4 pt-4 border-t border-slate-700/50">
                                             <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
                                                 <WebIcon /> {t.searchResults}
                                             </h4>
                                             <div className="grid grid-cols-1 gap-2 text-xs">
                                                 {item.searchResults.map((source, idx) => (
                                                     <a 
                                                         key={idx}
                                                         href={source.uri}
                                                         target="_blank"
                                                         rel="noopener noreferrer"
                                                         className="bg-slate-600/40 hover:bg-slate-600/70 p-2 rounded-md truncate transition-colors group"
                                                         title={source.uri}
                                                     >
                                                         <p className="font-medium text-slate-300 group-hover:text-cyan-400 truncate">{source.title}</p>
                                                         <p className="text-slate-500 truncate">{source.uri}</p>
                                                     </a>
                                                 ))}
                                             </div>
                                         </div>
                                     )}
                                    <div className="mt-4 pt-4 border-t border-slate-600/50 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                                        <div className="flex items-center gap-1.5"><ModeIcon mode={item.generationMode} /><span>{item.generationMode}</span></div>
                                        <div className="flex items-center gap-1.5"><ToneIcon /><span>{item.tone}</span></div>
                                        <div className="flex items-center gap-1.5"><StyleIcon /><span>{item.responseStyle}</span></div>
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