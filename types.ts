
export type Tone = 'Casual' | 'Formal' | 'Enthusiastic';

export type ResponseStyle = 'Default' | 'Short & Sweet' | 'Detailed Explanation';

export type UserRole = 'Freelancer' | 'Student' | 'Business Owner';

export type Language = 'English' | 'Spanish' | 'French' | 'Japanese';

export type ModelId = 'gemini-flash-lite-latest' | 'gemini-2.5-flash' | 'gemini-2.5-pro';

export interface SearchResult {
    uri: string;
    title: string;
}

export interface ProfileData {
    name: string;
    role: UserRole;
    language: Language;
    skills: string;
    experience: string;
    portfolioUrl?: string;
}

export interface HistoryItem {
    id: number;
    clientMessage: string;
    generatedResponse: string;
    tone: Tone;
    responseStyle: ResponseStyle;
    modelId: ModelId;
    searchResults?: SearchResult[];
    feedback?: 'good' | 'bad';
}

export interface Conversation {
    id: number;
    name: string;
    history: HistoryItem[];
}