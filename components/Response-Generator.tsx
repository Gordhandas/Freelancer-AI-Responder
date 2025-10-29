import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MessageIcon } from './icons/MessageIcon';
import { HistoryItem, Tone, ResponseStyle, GenerationMode } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { EditIcon } from './icons/EditIcon';
import { RetryIcon } from './icons/RetryIcon';
import { ReplyIcon } from './icons/ReplyIcon';
import { BoltIcon } from './icons/BoltIcon';
import { ToneIcon } from './icons/ToneIcon';
import { StyleIcon } from './icons/StyleIcon';
import { ModeIcon } from './icons/ModeIcon';


interface ResponseGeneratorProps {
    clientMessage: string;
    setClientMessage: (message: string) => void;
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
    history: HistoryItem[];
    onClearHistory: () => void;
}

declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
            setOptions: (options: any) => void;
        };
        hljs: any;
    }
}

const quickPrompts = [
    'Can you provide more details about the timeline?',
    'What is the budget for this project?',
    'Are there any design mockups available?',
];

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
    history,
    onClearHistory,
}) => {
    const [copied, setCopied] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editableResponse, setEditableResponse] = useState(response);
    const clientMessageRef = useRef<HTMLTextAreaElement>(null);
    const responseContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setEditableResponse(response);
        setIsEditing(false);
        if (response && !isLoading) {
             setTimeout(() => responseContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }, [response, isLoading]);

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
                    Client's Message
                </label>
                <textarea
                    id="clientMessage"
                    ref={clientMessageRef}
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    placeholder="Paste the client's inquiry here..."
                    rows={8}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-y text-base placeholder:text-slate-500"
                />
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-col gap-2">
                 <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <BoltIcon />
                    Quick Prompts
                </h3>
                <div className="flex flex-wrap gap-2">
                    {quickPrompts.map(prompt => (
                        <button key={prompt} onClick={() => handleQuickPrompt(prompt)} className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-full text-sm text-slate-300 transition-colors">
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Generation Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Tone, Style, Mode Selectors */}
                {[
                    { label: 'Tone', value: tone, setter: setTone, options: ['Casual', 'Formal', 'Enthusiastic'] },
                    { label: 'Style', value: responseStyle, setter: setResponseStyle, options: ['Default', 'Short & Sweet', 'Detailed Explanation'] },
                    { label: 'Mode', value: generationMode, setter: setGenerationMode, options: ['Fast', 'Thinking'] },
                ].map(({ label, value, setter, options }) => (
                     <div key={label}>
                        <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
                        <select
                            id={label.toLowerCase()}
                            value={value}
                            onChange={(e) => setter(e.target.value as any)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                        >
                            {options.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-stretch gap-4 pt-2">
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="relative flex-grow w-full flex items-center justify-center gap-2 bg-gradient-to-br from-cyan-500 to-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:from-sky-700 disabled:to-cyan-700 disabled:cursor-not-allowed disabled:shadow-none shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            Generate Response
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
                        <span>Retry</span>
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
                        <h3 className="text-lg font-bold text-white">Generated Response</h3>
                        {response && !isEditing && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-1.5 px-3 rounded-lg transition text-sm"
                                    aria-label="Edit response" >
                                    <EditIcon /> Edit
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-1.5 px-3 rounded-lg transition text-sm"
                                    aria-label="Copy response" >
                                    <CopyIcon /> {copied ? 'Copied!' : 'Copy'}
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
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-y text-base"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={handleCancelEdit} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition">Cancel</button>
                                    <button onClick={handleSaveEdit} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition">Save</button>
                                </div>
                            </div>
                        ) : (
                             <div 
                                className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-white prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-cyan-500 prose-li:marker:text-cyan-400 max-w-none"
                                dangerouslySetInnerHTML={{ __html: generatedHtml }} 
                             />
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
                            Response History
                            <span className={`transform transition-transform ${isHistoryVisible ? 'rotate-180' : 'rotate-0'}`}>
                                <ChevronDownIcon />
                            </span>
                        </button>
                        {isHistoryVisible && (
                            <button onClick={onClearHistory} className="flex-shrink-0 flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition">
                                <TrashIcon />
                                Clear
                            </button>
                        )}
                    </div>
                    {isHistoryVisible && (
                        <div className="space-y-6">
                            {historyHtml.map((item, index) => (
                                <div key={item.id} className={`p-4 bg-slate-700/30 rounded-lg border border-slate-700/50 transition-all ${index === 0 ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/5' : ''}`}>
                                    <div className="flex justify-between items-center border-b border-slate-600/50 pb-3 mb-3">
                                        <p className="text-sm font-semibold text-slate-300">Client:</p>
                                        <button 
                                            onClick={() => handleReply(item.clientMessage)} 
                                            className="flex items-center gap-1.5 bg-slate-600/50 hover:bg-slate-600 text-slate-300 font-semibold py-1 px-2.5 rounded-md transition text-xs"
                                            aria-label="Reply to this message">
                                            <ReplyIcon />
                                            Reply
                                        </button>
                                    </div>
                                    <p className="text-slate-300 whitespace-pre-wrap text-sm mb-4">{item.clientMessage}</p>
                                    <p className="text-sm font-semibold text-white mb-3 border-b border-slate-600/50 pb-3">You:</p>
                                    <div 
                                        className="prose prose-sm prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-white prose-a:text-cyan-400 max-w-none"
                                        dangerouslySetInnerHTML={{ __html: item.generatedResponseHtml }}
                                    />
                                    <div className="mt-4 pt-4 border-t border-slate-600/50 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                                        <div className="flex items-center gap-1.5"><ToneIcon /><span>{item.tone}</span></div>
                                        <div className="flex items-center gap-1.5"><StyleIcon /><span>{item.responseStyle}</span></div>
                                        <div className="flex items-center gap-1.5"><ModeIcon mode={item.generationMode} /><span>{item.generationMode}</span></div>
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