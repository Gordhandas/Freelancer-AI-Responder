
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
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <UserIcon />
                Your Freelancer Profile
            </h2>
            <p className="text-gray-400 mb-6 text-sm">Personalize the AI by providing your details. This information will be used to craft responses in your voice.</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="e.g., Jane Doe"
                    />
                </div>
                <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">Key Skills (comma-separated)</label>
                    <input
                        type="text"
                        name="skills"
                        id="skills"
                        value={profile.skills}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="e.g., React, Next.js, Figma"
                    />
                </div>
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">Experience Summary</label>
                    <textarea
                        name="experience"
                        id="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                        placeholder="Briefly describe your expertise..."
                    />
                </div>
            </div>
        </div>
    );
};
