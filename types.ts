export type Tone = 'Casual' | 'Formal' | 'Enthusiastic';

export type ResponseStyle = 'Default' | 'Short & Sweet' | 'Detailed Explanation';

export type GenerationMode = 'Fast' | 'Thinking';

export interface ProfileData {
    name: string;
    skills: string;
    experience: string;
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
