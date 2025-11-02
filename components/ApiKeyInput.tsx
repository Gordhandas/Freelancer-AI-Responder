import React, { useState } from 'react';

interface ApiKeyInputProps {
  onSave: (key: string) => void;
  initialError?: string | null;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave, initialError }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key.');
      return;
    }
    setError(null);
    onSave(apiKey.trim());
  };

  const combinedError = error || initialError;

  return (
    <div className="fixed inset-0 bg-slate-950 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl w-full max-w-md m-4 animate-slide-in-up">
        <h2 className="text-2xl font-bold text-white mb-2">Google Gemini API Key</h2>
        <p className="text-slate-400 mb-6">
          To use this app, please enter your API key. Your key is stored only in your browser and never sent to any server besides Google's.
        </p>
        <div className="space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            placeholder="Enter your API key here"
            className={`w-full bg-slate-800 border ${combinedError ? 'border-red-500/50' : 'border-slate-600'} rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition`}
            aria-invalid={!!combinedError}
            aria-describedby="api-key-error"
          />
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          >
            Save and Continue
          </button>
        </div>
        {combinedError && <div id="api-key-error" className="mt-4 text-red-400 text-sm">{combinedError}</div>}
        <p className="text-xs text-slate-500 mt-4 text-center">
          You can get a free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google AI Studio</a>.
        </p>
      </div>
    </div>
  );
};
