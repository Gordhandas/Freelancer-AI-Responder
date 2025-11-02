export type Tone = 'Casual' | 'Formal' | 'Enthusiastic';

export type ResponseStyle = 'Default' | 'Short & Sweet' | 'Detailed Explanation';

export type GenerationMode = 'Fast' | 'Thinking';

export type UserRole = 'Freelancer' | 'Student' | 'Business Owner';

export type Language = 'English' | 'Spanish' | 'French' | 'Japanese';

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
    generationMode: GenerationMode;
}

export interface Conversation {
    id: number;
    name: string;
    history: HistoryItem[];
}