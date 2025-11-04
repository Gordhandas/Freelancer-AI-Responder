import React, { useState, useEffect } from 'react';
import { translations } from '../lib/translations';

interface ApiKeyInputProps {
  onSave: (key: string) => void;
  initialError?: string | null;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave, initialError }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  // A bit of a hack to get translations on this screen.
  // Defaults to English, checks localStorage for a profile to get the real language.
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    try {
        const savedProfile = localStorage.getItem('freelancerProfile');
        if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            if (parsed.language) {
                setLanguage(parsed.language);
            }
        }
    } catch (e) { /* ignore */ }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key.');
      return;
    }
    setError(null);
    onSave(apiKey.trim());
  };

  const combinedError = error || initialError;
  const t = translations[language] || translations['English'];

  return (
    <div className="fixed inset-0 bg-[var(--color-background)] bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-2xl w-full max-w-md m-4 animate-slide-in-up">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Google Gemini API Key</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          To use this app, please enter your API key. Your key is stored only in your browser and never sent to any server besides Google's.
        </p>
        <div className="space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            placeholder="Enter your API key here"
            className={`w-full bg-[var(--color-surface-secondary)] border ${combinedError ? 'border-red-500/50' : 'border-[var(--color-border)]'} rounded-lg p-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition`}
            aria-invalid={!!combinedError}
            aria-describedby="api-key-error"
            title={t.tooltips.apiKey}
          />
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            title={t.tooltips.saveApiKey}
          >
            {t.saveAndContinue}
          </button>
        </div>
        {combinedError && <div id="api-key-error" className="mt-4 text-red-400 text-sm">{combinedError}</div>}
        <p className="text-xs text-[var(--color-text-placeholder)] mt-4 text-center">
          You can get a free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline" title={t.tooltips.getApiKey}>Google AI Studio</a>.
        </p>
      </div>
    </div>
  );
};