
import React from 'react';
import { ProfileData } from '../types';
import { UserIcon } from './icons/UserIcon';

interface ProfileFormProps {
    profile: ProfileData;
    setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, setProfile }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-slate-800/40 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <UserIcon />
                Your Freelancer Profile
            </h2>
            <p className="text-slate-400 mb-6 text-sm">Personalize the AI by providing your details to craft responses in your voice.</p>
            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b-2 border-slate-600 focus:border-violet-500 p-2 text-slate-200 focus:outline-none focus:ring-0 transition duration-300"
                        placeholder="e.g., Jane Doe"
                    />
                </div>
                <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-slate-300 mb-1">Key Skills</label>
                    <input
                        type="text"
                        name="skills"
                        id="skills"
                        value={profile.skills}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b-2 border-slate-600 focus:border-violet-500 p-2 text-slate-200 focus:outline-none focus:ring-0 transition duration-300"
                        placeholder="e.g., React, Next.js, Figma"
                    />
                </div>
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-slate-300 mb-1">Experience Summary</label>
                    <textarea
                        name="experience"
                        id="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition resize-y"
                        placeholder="Briefly describe your expertise..."
                    />
                </div>
            </div>
        </div>
    );
};