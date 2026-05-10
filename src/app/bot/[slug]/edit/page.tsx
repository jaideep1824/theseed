'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bot, CreateBotInput } from '@/types';
import PersonalitySliders from '@/components/PersonalitySliders';
import AvatarUpload from '@/components/AvatarUpload';
import ConversationStarters from '@/components/ConversationStarters';

const STEPS = ['Identity', 'Personality', 'Backstory', 'Rules', 'Finish'];

export default function EditBotPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [bot, setBot] = useState<Bot | null>(null);
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState<CreateBotInput | null>(null);

    useEffect(() => {
        loadBot();
    }, [slug]);

    async function loadBot() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/auth/login');
            return;
        }

        const { data: botData } = await supabase
            .from('bots')
            .select('*')
            .eq('slug', slug)
            .single();

        if (!botData || botData.user_id !== user.id) {
            router.push('/dashboard');
            return;
        }

        setBot(botData);
        setForm({
            name: botData.name,
            tagline: botData.tagline || '',
            avatar_url: botData.avatar_url || '',
            personality_traits: botData.personality_traits,
            backstory: botData.backstory || '',
            custom_instructions: botData.custom_instructions || '',
            conversation_starters: botData.conversation_starters || [],
            is_public: botData.is_public,
            category: botData.category,
        });
        setLoading(false);
    }

    function updateForm(field: string, value: any) {
        setForm(prev => prev ? { ...prev, [field]: value } : prev);
    }

    async function handleSubmit() {
        if (!bot || !form) return;
        setSubmitting(true);
        setError('');

        const res = await fetch(`/api/bots/${bot.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || 'Failed to update bot');
            setSubmitting(false);
            return;
        }

        router.push(`/bot/${bot.slug}`);
    }

    if (loading || !form) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 bg-gray-800 rounded w-1/3 mb-8" />
                <div className="h-96 bg-gray-800 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-4">Edit {bot?.name}</h1>
                <div className="flex gap-2">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex-1">
                            <div className={`h-1.5 rounded-full transition ${i <= step ? 'bg-blue-500' : 'bg-gray-700'}`} />
                            <p className={`text-xs mt-1 text-center ${i === step ? 'text-blue-400' : 'text-gray-600'}`}>{s}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {step === 0 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Identity</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Bot Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => updateForm('name', e.target.value)}
                                maxLength={50}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tagline</label>
                            <input
                                type="text"
                                value={form.tagline || ''}
                                onChange={(e) => updateForm('tagline', e.target.value)}
                                maxLength={100}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => updateForm('category', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="friend">Friend</option>
                                <option value="tutor">Tutor</option>
                                <option value="coach">Coach</option>
                                <option value="character">Character</option>
                                <option value="companion">Companion</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Avatar</label>
                            <AvatarUpload value={form.avatar_url || null} onChange={(url) => updateForm('avatar_url', url)} />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Personality</h2>
                        <PersonalitySliders
                            values={form.personality_traits}
                            onChange={(traits) => updateForm('personality_traits', traits)}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Backstory</h2>
                        <textarea
                            value={form.backstory || ''}
                            onChange={(e) => updateForm('backstory', e.target.value)}
                            maxLength={2000}
                            rows={10}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                        <p className="text-xs text-gray-500 text-right">{(form.backstory || '').length}/2000</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Rules & Behavior</h2>
                        <textarea
                            value={form.custom_instructions || ''}
                            onChange={(e) => updateForm('custom_instructions', e.target.value)}
                            maxLength={1000}
                            rows={8}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                        <p className="text-xs text-gray-500 text-right">{(form.custom_instructions || '').length}/1000</p>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Finish</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Conversation Starters</label>
                            <ConversationStarters
                                starters={form.conversation_starters}
                                onChange={(starters) => updateForm('conversation_starters', starters)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Visibility</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={form.is_public}
                                        onChange={() => updateForm('is_public', true)}
                                        className="accent-blue-500"
                                    />
                                    <div>
                                        <p className="text-white text-sm font-medium">Public</p>
                                        <p className="text-gray-400 text-xs">Listed in Explore + shareable link</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={!form.is_public}
                                        onChange={() => updateForm('is_public', false)}
                                        className="accent-blue-500"
                                    />
                                    <div>
                                        <p className="text-white text-sm font-medium">Private</p>
                                        <p className="text-gray-400 text-xs">Only people with the link can chat</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    <button
                        onClick={() => setStep(prev => prev - 1)}
                        disabled={step === 0}
                        className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white rounded-lg transition"
                    >
                        ← Back
                    </button>
                    {step < STEPS.length - 1 ? (
                        <button
                            onClick={() => setStep(prev => prev + 1)}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                        >
                            {submitting ? 'Saving...' : 'Save Changes ✓'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}