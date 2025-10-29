
import React, { useState, useMemo, useEffect } from 'react';
import { ProfileForm } from './components/ProfileForm';
import { ResponseGenerator } from './components/ResponseGenerator';
import { Header } from './components/Header';
import { ProfileData, Tone, HistoryItem, ResponseStyle, GenerationMode, Conversation } from './types';
import { ConversationList } from './components/ConversationList';
import { GoogleGenAI } from '@google/genai';

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


const App: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData>({
        name: 'Gordhan Das',
        skills: 'React, TypeScript, Node.js, Tailwind CSS, UI/UX Design',
        experience: '5+ years of experience building high-quality web applications for clients across various industries. I specialize in creating responsive and performant user interfaces.'
    });

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
    const [isAppVisible, setIsAppVisible] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);

    useEffect(() => {
        // Trigger entry animation
        setIsAppVisible(true);
        // Check for API key on mount
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey && storedKey !== 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
            setApiKey(storedKey);
        }
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


    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId);
    }, [conversations, activeConversationId]);
    
    const [clientMessage, setClientMessage] = useState<string>('');
    const [generatedResponse, setGeneratedResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tone, setTone] = useState<Tone>('Casual');
    const [responseStyle, setResponseStyle] = useState<ResponseStyle>('Default');
    const [generationMode, setGenerationMode] = useState<GenerationMode>('Fast');
    
    const handleGenerateResponse = async () => {
        if (!apiKey) {
            setError('API Key is not set. Please set your API key to generate a response.');
            (window as any).showApiKeyModal();
            return;
        }
        if (!clientMessage.trim() || !activeConversation) {
            setError('Please enter a client message and select a conversation.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedResponse('');

        try {
            const ai = new GoogleGenAI({ apiKey });
            
            const systemInstruction = `You are a highly skilled and professional freelance frontend developer named ${profile.name}.
Your key skills are: ${profile.skills}.
Here is a brief summary of your experience: ${profile.experience}.

Your task is to draft professional, context-aware responses to clients. Follow these instructions carefully:
1.  **Context**: Consider the entire conversation history to avoid repetition and maintain context. Your response should flow naturally from the previous messages.
2.  **Tone**: ${getToneInstruction(tone)}
3.  **Style**: ${getStyleInstruction(responseStyle)}
4.  Acknowledge their message and express enthusiasm for the potential project.
5.  Briefly and naturally mention how your skills are a great fit for their needs based on their message.
6.  Ask one or two insightful clarifying questions to encourage a conversation.
7.  End with a clear and positive call to action, inviting them to discuss the project further.
8.  Maintain a professional yet approachable tone. Do not sound robotic.
9.  IMPORTANT: Do not introduce yourself as an AI. You are responding as ${profile.name}, the developer.`;
            
            const conversationHistory = activeConversation.history.length > 0
            ? `Here is the previous conversation history for context (in chronological order):\n---\n${activeConversation.history.slice().reverse().map(item => `Client: ${item.clientMessage}\nYou (${profile.name}): ${item.generatedResponse}`).join('\n---\n')}\n---`
            : 'This is the first message from the client.';


            const userPrompt = `${conversationHistory}\n\nNow, the client has sent a new message:\n"---\n${clientMessage}\n---\"\n\nDraft the next response.`;
            
            let modelName;
            const modelConfig: { thinkingConfig?: { thinkingBudget: number } } = {};

            if (generationMode === 'Thinking') {
                modelName = 'gemini-2.5-pro';
                modelConfig.thinkingConfig = { thinkingBudget: 32768 };
            } else { // Fast mode
                modelName = 'gemini-flash-lite-latest';
            }
            
            const response = await ai.models.generateContent({
                model: modelName,
                contents: userPrompt,
                config: {
                    systemInstruction,
                    ...modelConfig,
                },
            });

            const responseText = response.text;
            setGeneratedResponse(responseText);
            
            const newHistoryItem: HistoryItem = {
                id: Date.now(),
                clientMessage,
                generatedResponse: responseText,
                tone,
                responseStyle,
                generationMode,
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
             setError(`Failed to generate response. Please check your API key and network connection. Original error: ${errorMessage}`);
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

    return (
        <div className={`min-h-screen text-slate-200 transition-opacity duration-500 ${isAppVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Header 
                onAddNewConversation={handleAddNewConversation}
                isSidebarVisible={isSidebarVisible}
                onToggleSidebar={() => setIsSidebarVisible(prev => !prev)}
            />
            <main className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-8xl mx-auto">
                    <div className={`lg:col-span-3 transition-all duration-300 ${isSidebarVisible ? 'opacity-100' : 'opacity-0 lg:w-0'}`}>
                        {isSidebarVisible && (
                            <div className="flex flex-col gap-8 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                                <ProfileForm profile={profile} setProfile={setProfile} />
                                {conversations.length > 0 && activeConversationId && (
                                    <ConversationList 
                                        conversations={conversations}
                                        activeConversationId={activeConversationId}
                                        onSelectConversation={handleSelectConversation}
                                        onRenameConversation={handleRenameConversation}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    <div className={`transition-all duration-300 ${isSidebarVisible ? "lg:col-span-9" : "lg:col-span-12"}`}>
                        {activeConversation ? (
                             <ResponseGenerator
                                apiKey={apiKey}
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