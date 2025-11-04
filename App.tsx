
import React, { useState, useMemo, useEffect } from 'react';
import { ProfileForm } from './components/ProfileForm';
import { ResponseGenerator } from './components/ResponseGenerator';
import { Header } from './components/Header';
import { ProfileData, Tone, HistoryItem, ResponseStyle, Conversation, ModelId, SearchResult, Language } from './types';
import { ConversationList } from './components/ConversationList';
import { GoogleGenAI } from '@google/genai';
import { ApiKeyInput } from './components/ApiKeyInput';
import { translations } from './lib/translations';
import { checkRateLimit, recordRequest } from './lib/rateLimiter';

const defaultClientMessage = `Hi there,

I came across your profile and I'm really impressed with your work in React and UI/UX design.

We're looking to build a new dashboard for our internal analytics tool. The key features would be data visualization, user management, and a fully responsive layout.

Are you available to discuss this project in more detail sometime next week?

Best,
John Doe`;

const getToneInstruction = (tone: Tone) => {
    switch (tone) {
        case 'Formal':
            return 'Adopt a formal and professional tone. Use complete sentences and avoid contractions (e.g., "I am" instead of "I\'m").';
        case 'Enthusiastic':
            return 'Adopt an energetic and enthusiastic tone. Feel free to use exclamation points where appropriate. Show genuine excitement about the project.';
        case 'Casual':
        default:
            return 'Adopt a friendly and casual tone, as if you are talking to a colleague. You can use contractions (e.g., "I\'m", "let\'s"). Keep it approachable.';
    }
};

const getStyleInstruction = (style: ResponseStyle) => {
    switch (style) {
        case 'Short & Sweet':
            return 'Keep the response concise and to the point. Aim for 2-3 sentences.';
        case 'Detailed Explanation':
            return 'Provide a more detailed and thorough response. Elaborate on your points and explain your reasoning clearly.';
        case 'Default':
        default:
            return 'Write a balanced response of a standard length.';
    }
};

const getSystemInstruction = (profile: ProfileData) => {
    const portfolioInstruction = profile.portfolioUrl ? `\nMy portfolio/website is available at: ${profile.portfolioUrl}. You can share this link if it's relevant.` : '';
    const languageInstruction = `\nIMPORTANT: You MUST respond in ${profile.language}.`;

    let roleInstruction = '';

    switch (profile.role) {
        case 'Student':
            roleInstruction = `You are a dedicated and bright student named ${profile.name}.
Your areas of study are: ${profile.skills}.
Here is a summary of your relevant projects and coursework: ${profile.experience}.${portfolioInstruction}

Your task is to draft clear, respectful, and professional messages for academic purposes (e.g., emailing professors, group project coordination).
- Always consider the conversation history for context.
- Clearly state the purpose of your message.
- Ask questions if you need clarification.
- Maintain a respectful and slightly formal tone.
- End with a polite closing.
- IMPORTANT: Do not introduce yourself as an AI. You are responding as ${profile.name}, the student.`;
            break;
        
        case 'Business Owner':
             roleInstruction = `You are ${profile.name}, the owner or a representative of a business.
Your business specializes in: ${profile.skills}.
About the business: ${profile.experience}.${portfolioInstruction}

Your task is to draft professional responses to customers, partners, or other stakeholders.
- Use the conversation history to understand the stakeholder's needs and previous interactions.
- Maintain a professional, helpful, and customer-centric brand voice.
- Address inquiries or issues directly and offer clear solutions or next steps.
- End with a clear call to action or a polite closing that strengthens the business relationship.
- IMPORTANT: Do not introduce yourself as an AI. You are responding on behalf of the business as ${profile.name}.`;
             break;
        
        case 'Freelancer':
        default:
            roleInstruction = `You are a highly skilled and professional freelance developer named ${profile.name}.
Your key skills are: ${profile.skills}.
Here is a brief summary of your experience: ${profile.experience}.${portfolioInstruction}

Your task is to draft professional, context-aware responses to clients.
- Consider the entire conversation history to avoid repetition and maintain context.
- Acknowledge the client's message and express enthusiasm for the project.
- Briefly mention how your skills are a great fit for their needs.
- Ask one or two insightful clarifying questions to encourage a conversation.
- End with a clear and positive call to action.
- IMPORTANT: Do not introduce yourself as an AI. You are responding as ${profile.name}, the developer.`;
            break;
    }
    return roleInstruction + languageInstruction;
};

const migrateConversation = (convo: any): Conversation => {
    return {
        ...convo,
        history: convo.history.map((item: any) => {
            if (item.generationMode && !item.modelId) {
                let modelId: ModelId = 'gemini-2.5-flash';
                if (item.generationMode === 'Fast') modelId = 'gemini-flash-lite-latest';
                if (item.generationMode === 'Thinking') modelId = 'gemini-2.5-pro';
                const { generationMode, ...rest } = item;
                return { ...rest, modelId };
            }
            return item;
        })
    };
};

const App: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData>(() => {
        try {
            const savedProfile = localStorage.getItem('freelancerProfile');
            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                return {
                    ...parsed,
                    role: parsed.role || 'Freelancer', // Backwards compatibility for role
                    language: parsed.language || 'English', // Backwards compatibility for language
                };
            }
        } catch (error) {
            console.error("Failed to parse profile from localStorage", error);
        }
        // Auto-detect language for new users
        const browserLang = (navigator.language || 'en').split('-')[0];
        let defaultLanguage: Language = 'English';
        if (browserLang === 'es') defaultLanguage = 'Spanish';
        if (browserLang === 'fr') defaultLanguage = 'French';
        if (browserLang === 'ja') defaultLanguage = 'Japanese';

        return {
            name: 'Gordhan Das',
            role: 'Freelancer',
            language: defaultLanguage,
            skills: 'React, TypeScript, Node.js, Tailwind CSS, UI/UX Design',
            experience: '5+ years of experience building high-quality web applications for clients across various industries. I specialize in creating responsive and performant user interfaces.',
            portfolioUrl: ''
        };
    });

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(() => window.innerWidth >= 1024); // lg breakpoint
    const [isAppVisible, setIsAppVisible] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [apiKeyError, setApiKeyError] = useState<string | null>(null);
    const [isAppInitialized, setIsAppInitialized] = useState(false);
    const [modelId, setModelId] = useState<ModelId>('gemini-2.5-flash');
    const [useSearch, setUseSearch] = useState<boolean>(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }
        return 'dark'; // Default to dark theme
    });

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const savedKey = localStorage.getItem('geminiApiKey');
        if (savedKey) {
            setApiKey(savedKey);
        }
        setIsAppInitialized(true); // Allow rendering after checking storage
    }, []);

    useEffect(() => {
        // Trigger entry animation
        setIsAppVisible(true);
    }, []);

    // Handle shared conversation link on initial load
    useEffect(() => {
        if (window.location.hash.startsWith('#share=')) {
            const encodedData = window.location.hash.substring('#share='.length);
            try {
                // Handle UTF-8 characters correctly during base64 decoding
                const jsonString = decodeURIComponent(escape(atob(encodedData)));
                const importedConversation = JSON.parse(jsonString);

                if (importedConversation && typeof importedConversation.id === 'number' && typeof importedConversation.name === 'string' && Array.isArray(importedConversation.history)) {
                    const newConversation = {
                        ...migrateConversation(importedConversation),
                        id: Date.now(),
                        name: `(Shared) ${importedConversation.name}`
                    };

                    setConversations(prev => {
                        const exists = prev.some(p => p.id === newConversation.id);
                        if (exists) return prev;
                        return [newConversation, ...prev];
                    });
                    setActiveConversationId(newConversation.id);

                    // Clear the hash to prevent re-importing on reload
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                } else {
                    throw new Error('Invalid shared conversation format.');
                }
            } catch (e) {
                console.error("Failed to parse shared conversation from URL", e);
                const message = e instanceof Error ? e.message : "Failed to load shared conversation.";
                setError(`Import failed: ${message}`);
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        }
    }, []);
    
    // Load conversations from local storage on initial load
    useEffect(() => {
        try {
            const savedConversations = localStorage.getItem('conversations');
            const savedActiveId = localStorage.getItem('activeConversationId');
            if (savedConversations) {
                const parsedConversations = JSON.parse(savedConversations).map(migrateConversation);
                setConversations(parsedConversations);
                if (savedActiveId && parsedConversations.some((c: Conversation) => c.id === Number(savedActiveId))) {
                    setActiveConversationId(Number(savedActiveId));
                } else if (parsedConversations.length > 0) {
                    setActiveConversationId(parsedConversations[0].id);
                }
            } else {
                // Initialize with a default conversation if none are saved
                const initialConversation: Conversation = { id: Date.now(), name: 'Client Conversation 1', history: [] };
                setConversations([initialConversation]);
                setActiveConversationId(initialConversation.id);
                setClientMessage(defaultClientMessage);
            }
        } catch (error) {
            console.error("Failed to parse conversations from localStorage", error);
        }
    }, []);

    // Save conversations to local storage whenever they change
    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('conversations', JSON.stringify(conversations));
        }
        if (activeConversationId) {
            localStorage.setItem('activeConversationId', String(activeConversationId));
        }
    }, [conversations, activeConversationId]);

    // Save profile to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('freelancerProfile', JSON.stringify(profile));
    }, [profile]);


    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId);
    }, [conversations, activeConversationId]);
    
    const [clientMessage, setClientMessage] = useState<string>('');
    const [generatedResponse, setGeneratedResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tone, setTone] = useState<Tone>('Casual');
    const [responseStyle, setResponseStyle] = useState<ResponseStyle>('Default');
    
    const handleSaveApiKey = (key: string) => {
        localStorage.setItem('geminiApiKey', key);
        setApiKey(key);
        setApiKeyError(null);
    };

    const handleGenerateResponse = async () => {
        const t = translations[profile.language];
        
        const { isLimited, timeUntilNextRequest } = checkRateLimit();
        if (isLimited) {
            const seconds = Math.ceil(timeUntilNextRequest / 1000);
            setError(t.errors.clientRateLimit(seconds));
            return;
        }

        if (!clientMessage.trim() || !activeConversation) {
            setError('Please enter a client message and select a conversation.');
            return;
        }
        if (!apiKey) {
            setError('API Key is not set.');
            setApiKeyError('Your API key is missing. Please enter it to continue.');
            return;
        }

        recordRequest();
        setIsLoading(true);
        setError(null);
        setGeneratedResponse('');
        const ai = new GoogleGenAI({ apiKey });

        try {
            const baseSystemInstruction = getSystemInstruction(profile);

            const systemInstruction = `${baseSystemInstruction}\n\nFor this specific response, follow these stylistic overrides:\n- Tone: ${getToneInstruction(tone)}\n- Style: ${getStyleInstruction(responseStyle)}`;
            
            const conversationHistory = activeConversation.history.length > 0
            ? `Here is the previous conversation history for context (in chronological order):\n---\n${activeConversation.history.slice().reverse().map(item => `Client: ${item.clientMessage}\nYou (${profile.name}): ${item.generatedResponse}`).join('\n---\n')}\n---`
            : 'This is the first message from the client.';


            const userPrompt = `${conversationHistory}\n\nNow, the client has sent a new message:\n"---\n${clientMessage}\n---\"\n\nDraft the next response as ${profile.name}.`;
            
            const config: any = { systemInstruction };

            if (modelId === 'gemini-2.5-pro') {
                config.thinkingConfig = { thinkingBudget: 32768 };
            }
            
            if (useSearch) {
                config.tools = [{googleSearch: {}}];
            }
            
            const response = await ai.models.generateContent({
                model: modelId,
                contents: userPrompt,
                config,
            });

            const responseText = response.text;
            setGeneratedResponse(responseText);

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            const searchResults: SearchResult[] = groundingChunks
                ?.map((chunk: any) => chunk.web)
                .filter(Boolean)
                .map((webChunk: any) => ({ uri: webChunk.uri, title: webChunk.title }))
                .filter((v: SearchResult, i: number, a: SearchResult[]) => a.findIndex(t => t.uri === v.uri) === i) || [];
            
            const newHistoryItem: HistoryItem = {
                id: Date.now(),
                clientMessage,
                generatedResponse: responseText,
                tone,
                responseStyle,
                modelId,
                searchResults,
            };

            let finalConversations = conversations.map(c => 
                c.id === activeConversationId 
                ? { ...c, history: [newHistoryItem, ...c.history] }
                : c
            );

            // Auto-name conversation if it's the first message and has a default name
            const isFirstMessage = activeConversation.history.length === 0;
            const hasDefaultName = activeConversation.name.startsWith('Client Conversation ');

            if (isFirstMessage && hasDefaultName) {
                try {
                    const nameGenerationPrompt = `Based on this user's message, create a short, descriptive title for the conversation. The title should be 5 words or less. Respond with only the title itself, nothing else.\n\nMESSAGE: "${clientMessage}"`;
                    const nameResponse = await ai.models.generateContent({
                        model: 'gemini-flash-lite-latest',
                        contents: nameGenerationPrompt,
                    });
            
                    let newConversationName = nameResponse.text.trim().replace(/["'.]/g, '');
                    if (newConversationName) {
                        finalConversations = finalConversations.map(c =>
                            c.id === activeConversationId
                            ? { ...c, name: newConversationName }
                            : c
                        );
                    }
                } catch (nameGenError) {
                    console.error("Failed to auto-generate conversation name:", nameGenError);
                    // Fail silently, keep the default name
                }
            }

            setConversations(finalConversations);
            setClientMessage('');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            console.error("Generation Error:", err);

            if (errorMessage.includes('API key not valid') || errorMessage.includes('API_KEY_INVALID')) {
                setError(t.errors.invalidApiKey);
                setApiKeyError(t.errors.invalidApiKey);
                localStorage.removeItem('geminiApiKey');
                setApiKey(null);
            } else if (errorMessage.toLowerCase().includes('quota') || errorMessage.includes('429')) {
                setError(t.errors.rateLimit);
            } else if (errorMessage.includes('400') || errorMessage.toLowerCase().includes('invalid argument')) {
                setError(t.errors.badRequest);
            } else if (errorMessage.includes('500') || errorMessage.toLowerCase().includes('internal error')) {
                setError(t.errors.serverError);
            } else if (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch')) {
                setError(t.errors.networkError);
            } else {
                setError(t.errors.unknownError(errorMessage));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = () => {
        const updatedConversations = conversations.map(c => 
            c.id === activeConversationId 
            ? { ...c, history: [] }
            : c
        );
        setConversations(updatedConversations);
        setGeneratedResponse('');
    };

    const handleAddNewConversation = () => {
        const lastConversation = conversations[conversations.length - 1];
        if (lastConversation && lastConversation.history.length === 0 && !lastConversation.name.includes('Edited')) {
            setActiveConversationId(lastConversation.id);
            if (!isSidebarVisible) setIsSidebarVisible(true);
            return;
        }

        const newConversation: Conversation = {
            id: Date.now(),
            name: `Client Conversation ${conversations.length + 1}`,
            history: [],
        };
        setConversations(prev => [...prev, newConversation]);
        setActiveConversationId(newConversation.id);
        setClientMessage('');
        setGeneratedResponse('');
        setError(null);
        if (!isSidebarVisible) {
            setIsSidebarVisible(true);
        }
    };

    const handleSelectConversation = (id: number) => {
        setActiveConversationId(id);
        setClientMessage('');
        setGeneratedResponse('');
        setError(null);
    };

    const handleRenameConversation = (id: number, newName: string) => {
        const updatedConversations = conversations.map(c => 
            c.id === id ? { ...c, name: newName } : c
        );
        setConversations(updatedConversations);
    };

    const handleExportConversations = () => {
        if (conversations.length === 0) {
            alert('There are no conversations to export.');
            return;
        }
        const jsonString = JSON.stringify(conversations, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversations-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportConversations = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error('File content is not readable.');
                
                const importedData = JSON.parse(text);

                if (!Array.isArray(importedData) || !importedData.every(c => 'id' in c && 'name' in c && 'history' in c && Array.isArray(c.history))) {
                    throw new Error('Invalid conversation file format.');
                }
                
                const newConversations = importedData.map((convo: Conversation, index: number) => ({
                    ...convo,
                    id: Date.now() + index,
                }));

                setConversations(prev => [...prev, ...newConversations]);
                if (newConversations.length > 0) {
                    setActiveConversationId(newConversations[0].id);
                }
                setError(null);

            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error during import.';
                setError(`Import failed: ${message}`);
                console.error(err);
            }
        };
        reader.onerror = () => {
            setError('Failed to read the selected file.');
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleShareConversation = () => {
        if (!activeConversation) {
            setError("Please select a conversation to share.");
            return;
        }
        try {
            const jsonString = JSON.stringify(activeConversation);
            const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
            const url = `${window.location.origin}${window.location.pathname}#share=${encodedData}`;
            navigator.clipboard.writeText(url);
        } catch (e) {
            console.error("Failed to create share link", e);
            setError("Failed to create the shareable link. The conversation might be too large.");
        }
    };

    if (!isAppInitialized) {
        return <div className="min-h-screen bg-[var(--color-background)]"></div>; // Loading state before we check for API key
    }

    if (!apiKey) {
        return <ApiKeyInput onSave={handleSaveApiKey} initialError={apiKeyError} />;
    }

    return (
        <div className={`min-h-screen text-[var(--color-text-primary)] transition-opacity duration-500 ${isAppVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Header 
                profile={profile}
                onAddNewConversation={handleAddNewConversation}
                isSidebarVisible={isSidebarVisible}
                onToggleSidebar={() => setIsSidebarVisible(prev => !prev)}
                theme={theme}
                onToggleTheme={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
            />
            <main className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-8xl mx-auto">
                    {isSidebarVisible && (
                        <div className="lg:col-span-3 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="flex flex-col gap-8">
                                <ProfileForm 
                                    profile={profile} 
                                    setProfile={setProfile}
                                    onClearApiKey={() => {
                                        setApiKey(null);
                                        localStorage.removeItem('geminiApiKey');
                                    }}
                                />
                                {conversations.length > 0 && activeConversationId && (
                                    <ConversationList 
                                        profile={profile}
                                        conversations={conversations}
                                        activeConversationId={activeConversationId}
                                        onSelectConversation={handleSelectConversation}
                                        onRenameConversation={handleRenameConversation}
                                        onImportConversations={handleImportConversations}
                                        onExportConversations={handleExportConversations}
                                        onShareConversation={handleShareConversation}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                    <div className={`transition-all duration-300 ${isSidebarVisible ? "lg:col-span-9" : "lg:col-span-12"}`}>
                        {activeConversation ? (
                             <ResponseGenerator
                                profile={profile}
                                clientMessage={clientMessage}
                                setClientMessage={setClientMessage}
                                onGenerate={handleGenerateResponse}
                                response={generatedResponse}
                                isLoading={isLoading}
                                error={error}
                                tone={tone}
                                setTone={setTone}
                                responseStyle={responseStyle}
                                setResponseStyle={setResponseStyle}
                                modelId={modelId}
                                setModelId={setModelId}
                                useSearch={useSearch}
                                setUseSearch={setUseSearch}
                                history={activeConversation?.history || []}
                                onClearHistory={handleClearHistory}
                            />
                        ) : (
                            <div className="bg-[var(--color-surface-secondary)]/40 p-6 rounded-2xl border border-[var(--color-border)] h-full flex items-center justify-center animate-fade-in">
                                <p className="text-[var(--color-text-secondary)] text-lg">Select a conversation or create a new one to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;