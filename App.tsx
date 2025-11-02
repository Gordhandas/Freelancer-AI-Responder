
import React, { useState, useMemo, useEffect } from 'react';
import { ProfileForm } from './components/ProfileForm';
import { ResponseGenerator } from './components/ResponseGenerator';
import { Header } from './components/Header';
import { ProfileData, Tone, HistoryItem, ResponseStyle, Conversation, GenerationMode, SearchResult } from './types';
import { ConversationList } from './components/ConversationList';
import { GoogleGenAI } from '@google/genai';
import { ApiKeyInput } from './components/ApiKeyInput';

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
        return {
            name: 'Gordhan Das',
            role: 'Freelancer',
            language: 'English',
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
    const [generationMode, setGenerationMode] = useState<GenerationMode>('Balanced');
    const [useSearch, setUseSearch] = useState<boolean>(false);

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
    
    // Load conversations from local storage on initial load
    useEffect(() => {
        try {
            const savedConversations = localStorage.getItem('conversations');
            const savedActiveId = localStorage.getItem('activeConversationId');
            if (savedConversations) {
                const parsedConversations = JSON.parse(savedConversations);
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
        if (!clientMessage.trim() || !activeConversation) {
            setError('Please enter a client message and select a conversation.');
            return;
        }
        if (!apiKey) {
            setError('API Key is not set.');
            setApiKeyError('Your API key is missing. Please enter it to continue.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedResponse('');

        try {
            const ai = new GoogleGenAI({ apiKey });
            
            const baseSystemInstruction = getSystemInstruction(profile);

            const systemInstruction = `${baseSystemInstruction}\n\nFor this specific response, follow these stylistic overrides:\n- Tone: ${getToneInstruction(tone)}\n- Style: ${getStyleInstruction(responseStyle)}`;
            
            const conversationHistory = activeConversation.history.length > 0
            ? `Here is the previous conversation history for context (in chronological order):\n---\n${activeConversation.history.slice().reverse().map(item => `Client: ${item.clientMessage}\nYou (${profile.name}): ${item.generatedResponse}`).join('\n---\n')}\n---`
            : 'This is the first message from the client.';


            const userPrompt = `${conversationHistory}\n\nNow, the client has sent a new message:\n"---\n${clientMessage}\n---\"\n\nDraft the next response as ${profile.name}.`;
            
            let modelName: string;
            const config: any = { systemInstruction };

            switch (generationMode) {
                case 'Fast':
                    modelName = 'gemini-flash-lite-latest';
                    break;
                case 'Thinking':
                    modelName = 'gemini-2.5-pro';
                    config.thinkingConfig = { thinkingBudget: 32768 };
                    break;
                case 'Balanced':
                default:
                    modelName = 'gemini-2.5-flash';
                    break;
            }
            
            if (useSearch) {
                config.tools = [{googleSearch: {}}];
            }
            
            const response = await ai.models.generateContent({
                model: modelName,
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
                generationMode,
                searchResults,
            };

            const updatedConversations = conversations.map(c => 
                c.id === activeConversationId 
                ? { ...c, history: [newHistoryItem, ...c.history] }
                : c
            );
            setConversations(updatedConversations);
            setClientMessage('');

        } catch (err) {
             const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
             if (errorMessage.includes('API key not valid')) {
                setError("Your API key seems to be invalid. Please enter a valid one.");
                setApiKeyError("Your API key is invalid. Please enter a valid key to continue.");
                localStorage.removeItem('geminiApiKey');
                setApiKey(null);
            } else {
                setError(`Failed to generate response. Please check your network connection. Original error: ${errorMessage}`);
            }
             console.error(err);
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
            c.id === id ? { ...c, name: `${newName} (Edited)` } : c
        );
        setConversations(updatedConversations);
    };

    if (!isAppInitialized) {
        return <div className="min-h-screen bg-slate-950"></div>; // Loading state before we check for API key
    }

    if (!apiKey) {
        return <ApiKeyInput onSave={handleSaveApiKey} initialError={apiKeyError} />;
    }

    return (
        <div className={`min-h-screen text-slate-200 transition-opacity duration-500 ${isAppVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Header 
                profile={profile}
                onAddNewConversation={handleAddNewConversation}
                isSidebarVisible={isSidebarVisible}
                onToggleSidebar={() => setIsSidebarVisible(prev => !prev)}
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
                                generationMode={generationMode}
                                setGenerationMode={setGenerationMode}
                                useSearch={useSearch}
                                setUseSearch={setUseSearch}
                                history={activeConversation?.history || []}
                                onClearHistory={handleClearHistory}
                            />
                        ) : (
                            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 h-full flex items-center justify-center animate-fade-in">
                                <p className="text-slate-400 text-lg">Select a conversation or create a new one to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;