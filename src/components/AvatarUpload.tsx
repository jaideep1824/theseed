'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BOT_CATEGORIES } from '@/lib/constants';
import PersonalitySliders from '@/components/PersonalitySliders';
import { PersonalityTraits } from '@/types';

export default function CreateBotPage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(BOT_CATEGORIES[0].value);
    const [isPublic, setIsPublic] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [personality, setPersonality] = useState<PersonalityTraits>({
        humor: 0.5,
        empathy: 0.5,
        formality: 0.5,
        energy: 0.5,
        creativity: 0.5,
    });

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('bot-assets')
            .upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image');
            setLoading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('bot-assets')
            .getPublicUrl(filePath);

        setAvatarUrl(publicUrl);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/bots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                tagline,
                description,
                category,
                is_public: isPublic,
                avatar_url: avatarUrl,
                personality,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            router.push(`/bot/${data.bot.slug}`);
        } else {
            alert(data.error || 'Something went wrong');
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">Create New Bot</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">
                        Basic Information
                    </h2>

                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-700">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-500 text-xs text-center px-2">No Image</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Bot Avatar</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                                placeholder="e.g. Cyber Guide"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                            >
                                {BOT_CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Short Tagline</label>
                        <input
                            required
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                            placeholder="Describe your bot in one sentence"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Instructions / Description</label>
                        <textarea
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                            placeholder="How should your bot behave? What is its backstory?"
                        />
                    </div>
                </section>

                {/* Personality Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">
                        Personality Traits
                    </h2>
                    <PersonalitySliders values={personality} onChange={setPersonality} />
                </section>

                {/* Settings */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">
                        Visibility
                    </h2>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-5 h-5 accent-blue-500"
                        />
                        <label htmlFor="isPublic" className="text-gray-300">
                            Make this bot public (visible in Explore)
                        </label>
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Create AI Bot'}
                </button>
            </form>
        </div>
    );
}