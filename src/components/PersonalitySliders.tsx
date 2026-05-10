'use client';

import { PersonalityTraits } from '@/types';
import { PERSONALITY_TRAITS } from '@/lib/constants';

interface PersonalitySlidersProps {
    values: PersonalityTraits;
    onChange: (values: PersonalityTraits) => void;
}

function getPreviewText(trait: string, value: number): string {
    const level = value <= 0.2 ? 'low' : value <= 0.4 ? 'below average' : value <= 0.6 ? 'medium' : value <= 0.8 ? 'high' : 'very high';

    const descriptions: Record<string, Record<string, string>> = {
        humor: {
            low: 'Serious',
            'below average': 'Mostly serious',
            medium: 'Balanced humor',
            high: 'Funny & playful',
            'very high': 'Hilarious'
        },
        empathy: {
            low: 'Detached',
            'below average': 'Somewhat caring',
            medium: 'Understanding',
            high: 'Very caring',
            'very high': 'Deeply empathetic'
        },
        formality: {
            low: 'Very casual',
            'below average': 'Casual',
            medium: 'Balanced',
            high: 'Formal',
            'very high': 'Very formal'
        },
        energy: {
            low: 'Calm',
            'below average': 'Relaxed',
            medium: 'Balanced',
            high: 'Energetic',
            'very high': 'Hyper energetic'
        },
        creativity: {
            low: 'Practical',
            'below average': 'Mostly practical',
            medium: 'Balanced',
            high: 'Creative',
            'very high': 'Wildly creative'
        },
    };

    return descriptions[trait]?.[level] || '';
}

export default function PersonalitySliders({ values, onChange }: PersonalitySlidersProps) {
    function handleChange(trait: string, value: number) {
        onChange({ ...values, [trait]: value });
    }

    return (
        <div className="space-y-6">
            {PERSONALITY_TRAITS.map((trait) => (
                <div key={trait.key}>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-300">{trait.label}</label>
                        <span className="text-sm text-blue-400">
              {getPreviewText(trait.key, values[trait.key as keyof PersonalityTraits])}
            </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-20 text-right">{trait.lowLabel}</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={values[trait.key as keyof PersonalityTraits]}
                            onChange={(e) => handleChange(trait.key, parseFloat(e.target.value))}
                            className="flex-1 accent-blue-500"
                        />
                        <span className="text-xs text-gray-500 w-20">{trait.highLabel}</span>
                    </div>
                </div>
            ))}

            {/* Preview */}
            <div className="bg-gray-800 rounded-lg p-4 mt-4">
                <p className="text-xs text-gray-400 mb-1">Personality Preview:</p>
                <p className="text-sm text-gray-300">
                    Your bot will be{' '}
                    <span className="text-blue-400">{getPreviewText('humor', values.humor).toLowerCase()}</span>,{' '}
                    <span className="text-blue-400">{getPreviewText('empathy', values.empathy).toLowerCase()}</span>,{' '}
                    <span className="text-blue-400">{getPreviewText('formality', values.formality).toLowerCase()}</span>,{' '}
                    <span className="text-blue-400">{getPreviewText('energy', values.energy).toLowerCase()}</span>, and{' '}
                    <span className="text-blue-400">{getPreviewText('creativity', values.creativity).toLowerCase()}</span>.
                </p>
            </div>
        </div>
    );
}