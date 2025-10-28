import React, { useState } from 'react';

interface ApiKeyInputProps {
    onSave: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave }) => {
    const [key, setKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (key.trim()) {
            onSave(key.trim());
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4">
            <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <div className="bg-blue-600 p-3 rounded-lg inline-block mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome!</h1>
                    <p className="text-gray-400 mb-6">Please enter your Google Gemini API key to get started.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-1">
                            Gemini API Key
                        </label>
                        <input
                            id="api-key"
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter your API key"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
                    >
                        Save & Continue
                    </button>
                </form>
                 <p className="text-xs text-gray-500 mt-4 text-center">
                    Your API key is stored securely in your browser's local storage and is not sent to any server other than Google's.
                </p>
                 <div className="text-center mt-4">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 underline">
                        Get your API Key from Google AI Studio
                    </a>
                </div>
            </div>
        </div>
    );
};
