import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MessageIcon } from './icons/MessageIcon';
import { HistoryItem, Tone, ResponseStyle, GenerationMode } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

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

    const handleCopy = () => {
        navigator.clipboard.writeText(response);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    // Format response to render newlines correctly
    const formattedResponse = response.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));

    const formatHistoryResponse = (text: string) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col h-full">
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MessageIcon />
                    Client's Message
                </h2>
                <textarea
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    rows={6}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                    placeholder="Paste the client's message here..."
                />
            </div>

            <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="tone-select" className="block text-sm font-medium text-gray-300 mb-2">
                        Response Tone
                    </label>
                    <div className="relative">
                        <select
                            id="tone-select"
                            value={tone}
                            onChange={(e) => setTone(e.target.value as Tone)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                            style={{ paddingRight: '2.5rem' }}
                        >
                            <option value="Casual">Casual</option>
                            <option value="Formal">Formal</option>
                            <option value="Enthusiastic">Enthusiastic</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                            </svg>
                        </div>
                    </div>
                </div>
                 <div>
                    <label htmlFor="style-select" className="block text-sm font-medium text-gray-300 mb-2">
                        Response Style
                    </label>
                    <div className="relative">
                        <select
                            id="style-select"
                            value={responseStyle}
                            onChange={(e) => setResponseStyle(e.target.value as ResponseStyle)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                            style={{ paddingRight: '2.5rem' }}
                        >
                            <option value="Default">Default</option>
                            <option value="Short & Sweet">Short & Sweet</option>
                            <option value="Detailed Explanation">Detailed Explanation</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                            </svg>
                        </div>
                    </div>
                </div>
                 <div>
                    <label htmlFor="mode-select" className="block text-sm font-medium text-gray-300 mb-2">
                        Generation Mode
                    </label>
                    <div className="relative">
                        <select
                            id="mode-select"
                            value={generationMode}
                            onChange={(e) => setGenerationMode(e.target.value as GenerationMode)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                            style={{ paddingRight: '2.5rem' }}
                        >
                            <option value="Fast">Fast (Quick Response)</option>
                            <option value="Thinking">Thinking (Complex Query)</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mb-4">
                 <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
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
            </div>

            {error && (
                <div className="mb-6 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-sm">
                    <p className="font-bold text-base mb-1">An Error Occurred</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="flex-grow flex flex-col min-h-0">
                <h2 className="text-xl font-bold text-white mb-4">Generated Response</h2>
                <div className="relative flex-grow bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-gray-300 overflow-y-auto min-h-[200px]">
                    {response && (
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition"
                            aria-label="Copy response"
                        >
                            <CopyIcon />
                            {copied && <span className="absolute -left-20 top-1/2 -translate-y-1/2 text-xs bg-green-600 text-white px-2 py-1 rounded">Copied!</span>}
                        </button>
                    )}
                    {isLoading && <p className="text-gray-400">AI is crafting your response...</p>}
                    {!isLoading && !error && !response && <p className="text-gray-500">Your AI-generated response will appear here.</p>}
                    {!isLoading && !error && response && <div className="prose prose-invert prose-sm max-w-none">{formattedResponse}</div>}
                </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-6">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsHistoryVisible(!isHistoryVisible)}>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <HistoryIcon />
                        Response History
                    </h2>
                    <div className="flex items-center gap-2">
                         {history.length > 0 && isHistoryVisible && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onClearHistory(); }}
                                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-red-500/20"
                                aria-label="Clear this conversation's history"
                            >
                                <TrashIcon />
                            </button>
                        )}
                        <button
                            className="text-gray-400 hover:text-white p-2 rounded-lg"
                             aria-expanded={isHistoryVisible}
                             aria-label={isHistoryVisible ? "Collapse history" : "Expand history"}
                        >
                            <div className={`transform transition-transform duration-200 ${isHistoryVisible ? 'rotate-180' : ''}`}>
                                <ChevronDownIcon />
                            </div>
                        </button>
                    </div>
                </div>

                {isHistoryVisible && (
                    <div className="mt-4 max-h-[400px] overflow-y-auto space-y-4 pr-2">
                        {history.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No responses in this conversation yet.</p>
                        ) : (
                            history.map(item => (
                                <div key={item.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                                    <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-700">
                                        <h3 className="font-semibold text-gray-300">Client Message</h3>
                                        <div className="flex flex-wrap gap-2 text-xs justify-end">
                                            <span className="font-medium bg-blue-900 text-blue-300 px-2 py-1 rounded-md">{item.tone}</span>
                                            <span className="font-medium bg-purple-900 text-purple-300 px-2 py-1 rounded-md">{item.responseStyle}</span>
                                            <span className="font-medium bg-gray-700 text-gray-300 px-2 py-1 rounded-md">{item.generationMode}</span>
                                        </div>
                                    </div>
                                    <blockquote className="text-gray-400 text-sm mb-4 italic border-l-2 border-gray-600 pl-3">"{item.clientMessage}"</blockquote>
                                    
                                    <h3 className="font-semibold text-gray-300 mb-2">Your Response</h3>
                                    <div className="text-gray-300 text-sm prose prose-invert prose-sm max-w-none">
                                        {formatHistoryResponse(item.generatedResponse)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};