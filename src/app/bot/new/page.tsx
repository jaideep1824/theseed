'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateBotInput, PersonalityTraits } from '@/types';
import { DEFAULT_PERSONALITY } from '@/lib/constants';
import PersonalitySliders from '@/components/PersonalitySliders';
import AvatarUpload from '@/components/AvatarUpload';
import ConversationStarters from '@/components/ConversationStarters';

const STEPS = ['Identity', 'Personality', 'Backstory', 'Rules', 'Finish'];

export default function NewBotPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState<CreateBotInput>({
        name: '',
        tagline: '',
        avatar_url: '',
        personality_traits: DEFAULT_PERSONALITY,
        backstory: '',
        custom_instructions: '',
        conversation_starters: [],
        is_public: true,
        category: 'friend',
    });

    function updateForm(field: string, value: any) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function nextStep() {
        if (step === 0 && !form.name.trim()) {
            setError('Bot name is required');
            return;
        }
        setError('');
        setStep(prev => prev + 1);
    }

    function prevStep() {
        setError('');
        setStep(prev => prev - 1);
    }

    async function handleSubmit() {
        setSubmitting(true);
        setError('');

        const res = await fetch('/api/bots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || 'Failed to create bot');
            setSubmitting(false);
            return;
        }

        router.push(`/bot/${data.bot.slug}`);
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-4">Create Your AI Companion</h1>

                {/* Progress Bar */}
                <div className="flex gap-2">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex-1">
                            <div className={`h-1.5 rounded-full transition ${
                                i <= step ? 'bg-blue-500' : 'bg-gray-700'
                            }`} />
                            <p className={`text-xs mt-1 text-center ${
                                i === step ? 'text-blue-400' : 'text-gray-600'
                            }`}>{s}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* Step 1: Identity */}
                {step === 0 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Identity</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Bot Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => updateForm('name', e.target.value)}
                                maxLength={50}
                                placeholder="e.g. Kira"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tagline</label>
                            <input
                                type="text"
                                value={form.tagline || ''}
                                onChange={(e) => updateForm('tagline', e.target.value)}
                                maxLength={100}
                                placeholder="e.g. A 22-year-old artist from Tokyo"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
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
                            <AvatarUpload
                                value={form.avatar_url || null}
                                onChange={(url) => updateForm('avatar_url', url)}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Personality */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Personality</h2>
                        <p className="text-gray-400 text-sm">Drag the sliders to shape your bot's personality</p>
                        <PersonalitySliders
                            values={form.personality_traits}
                            onChange={(traits) => updateForm('personality_traits', traits)}
                        />
                    </div>
                )}

                {/* Step 3: Backstory */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Backstory</h2>
                        <p className="text-gray-400 text-sm">
                            Tell your bot who they are. The more detail, the more unique they'll feel.
                        </p>
                        <div>
              <textarea
                  value={form.backstory || ''}
                  onChange={(e) => updateForm('backstory', e.target.value)}
                  maxLength={2000}
                  rows={10}
                  placeholder='You are Kira, a 22-year-old artist from Tokyo who loves anime, late-night ramen, and giving life advice. You speak casually like a close friend...'
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
                            <p className="text-xs text-gray-500 text-right mt-1">
                                {(form.backstory || '').length}/2000
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 4: Rules */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Rules & Behavior</h2>
                        <p className="text-gray-400 text-sm">Set specific rules your bot must follow in every conversation.</p>
                        <div>
              <textarea
                  value={form.custom_instructions || ''}
                  onChange={(e) => updateForm('custom_instructions', e.target.value)}
                  maxLength={1000}
                  rows={8}
                  placeholder="- Never break character&#10;- Always end messages with an emoji&#10;- If someone seems sad, be extra supportive&#10;- Occasionally recommend anime"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
                            <p className="text-xs text-gray-500 text-right mt-1">
                                {(form.custom_instructions || '').length}/1000
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 5: Finish */}
                {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Almost Done!</h2>
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

                        {/* Summary */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-400 mb-2">Summary</p>
                            <p className="text-white font-medium">{form.name}</p>
                            <p className="text-gray-400 text-sm">{form.tagline}</p>
                            <p className="text-gray-500 text-xs mt-1 capitalize">
                                {form.category} • {form.is_public ? 'Public' : 'Private'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 0}
                        className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white rounded-lg transition"
                    >
                        ← Back
                    </button>

                    {step < STEPS.length - 1 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                        >
                            {submitting ? 'Creating...' : 'Publish Bot 🌱'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}