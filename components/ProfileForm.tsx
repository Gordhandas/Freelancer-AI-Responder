
import React from 'react';
import { ProfileData, Language } from '../types';
import { translations } from '../lib/translations';
import { UserIcon } from './icons/UserIcon';

interface ProfileFormProps {
    profile: ProfileData;
    setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
    onClearApiKey: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, setProfile, onClearApiKey }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const t = translations[profile.language];
    const placeholders = t.placeholders(profile.role);
    const labels = t.labels(profile.role);
    const portfolioPlaceholder = t.portfolioWebsitePlaceholder(profile.role);


    return (
        <div className="bg-[var(--color-surface-secondary)]/60 p-6 rounded-2xl shadow-lg border border-[var(--color-border)]">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-3">
                <UserIcon />
                {t.yourProfile}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6 text-sm">{t.yourProfileDesc}</p>
            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t.yourName}</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b-2 border-[var(--color-border)] focus:border-[var(--color-border-focus)] p-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-0 transition duration-300"
                        placeholder={t.yourNamePlaceholder}
                        title={t.tooltips.name}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t.iAmA}</label>
                        <div className="relative">
                            <select
                                name="role"
                                id="role"
                                value={profile.role}
                                onChange={handleChange}
                                className="w-full appearance-none bg-[var(--color-interactive)]/50 border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition"
                                title={t.tooltips.role}
                            >
                                <option value="Freelancer">{t.freelancer}</option>
                                <option value="Student">{t.student}</option>
                                <option value="Business Owner">{t.businessOwner}</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--color-text-secondary)]">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="language" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t.language}</label>
                        <div className="relative">
                            <select
                                name="language"
                                id="language"
                                value={profile.language}
                                onChange={handleChange}
                                className="w-full appearance-none bg-[var(--color-interactive)]/50 border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition"
                                title={t.tooltips.language}
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Español</option>
                                <option value="French">Français</option>
                                <option value="Japanese">日本語</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--color-text-secondary)]">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{labels.skills}</label>
                    <input
                        type="text"
                        name="skills"
                        id="skills"
                        value={profile.skills}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b-2 border-[var(--color-border)] focus:border-[var(--color-border-focus)] p-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-0 transition duration-300"
                        placeholder={placeholders.skills}
                        title={t.tooltips.skills(profile.role)}
                    />
                </div>
                <div>
                    <label htmlFor="portfolioUrl" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t.portfolioWebsite}</label>
                    <input
                        type="url"
                        name="portfolioUrl"
                        id="portfolioUrl"
                        value={profile.portfolioUrl || ''}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b-2 border-[var(--color-border)] focus:border-[var(--color-border-focus)] p-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-0 transition duration-300"
                        placeholder={portfolioPlaceholder}
                        title={t.tooltips.portfolio(profile.role)}
                    />
                </div>
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{labels.experience}</label>
                    <textarea
                        name="experience"
                        id="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-[var(--color-interactive)]/50 border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition resize-y"
                        placeholder={placeholders.experience}
                        title={t.tooltips.experience(profile.role)}
                    />
                </div>
                 <div className="pt-2">
                    <button
                        onClick={onClearApiKey}
                        className="w-full text-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-interactive)]/50 hover:bg-[var(--color-interactive)] p-2 rounded-lg transition"
                        title={t.tooltips.changeApiKey}
                    >
                        {t.changeApiKey}
                    </button>
                </div>
            </div>
        </div>
    );
};