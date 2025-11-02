import React from 'react';
import { GenerationMode } from '../../types';
import { SparklesIcon } from './SparklesIcon';
import { BoltIcon } from './BoltIcon';

interface ModeIconProps {
    mode: GenerationMode;
}

const BrainIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.871 14.755c2.193-1.113 3.69-3.41 3.69-6.088 0-3.75-2.7-6.817-6.188-6.817a6.43 6.43 0 00-1.63 12.38M19.129 14.755c-2.193-1.113-3.69-3.41-3.69-6.088 0-3.75 2.7-6.817 6.188-6.817a6.43 6.43 0 011.63 12.38M12 16a3 3 0 100-6 3 3 0 000 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.01 9.01 0 008.83-6.17M12 21a9.01 9.01 0 01-8.83-6.17" />
    </svg>
)

export const ModeIcon: React.FC<ModeIconProps> = ({ mode }) => {
    switch(mode) {
        case 'Thinking':
            return <BrainIcon />;
        case 'Fast':
            return <BoltIcon />;
        case 'Balanced':
        default:
            return (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
            );
    }
};