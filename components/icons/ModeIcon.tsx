import React from 'react';
import { GenerationMode } from '../../types';

interface ModeIconProps {
    mode: GenerationMode;
}

export const ModeIcon: React.FC<ModeIconProps> = ({ mode }) => {
    if (mode === 'Thinking') {
        return (
            // Brain Icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.871 14.755c2.193-1.113 3.69-3.41 3.69-6.088 0-3.75-2.7-6.817-6.188-6.817a6.43 6.43 0 00-1.63 12.38M19.129 14.755c-2.193-1.113-3.69-3.41-3.69-6.088 0-3.75 2.7-6.817 6.188-6.817a6.43 6.43 0 011.63 12.38M12 16a3 3 0 100-6 3 3 0 000 6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.01 9.01 0 008.83-6.17M12 21a9.01 9.01 0 01-8.83-6.17" />
            </svg>
        );
    }
    // Fast Mode - Lightning Bolt Icon
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
};