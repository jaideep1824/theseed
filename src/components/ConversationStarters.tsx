'use client';

import { MAX_CONVERSATION_STARTERS } from '@/lib/constants';

interface ConversationStartersProps {
    starters: string[];
    onChange: (starters: string[]) => void;
}

export default function ConversationStarters({ starters, onChange }: ConversationStartersProps) {
    function handleChange(index: number, value: string) {
        const updated = [...starters];
        updated[index] = value;
        onChange(updated);
    }

    function handleAdd() {
        if (starters.length >= MAX_CONVERSATION_STARTERS) return;
        onChange([...starters, '']);
    }

    function handleRemove(index: number) {
        onChange(starters.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    Add up to {MAX_CONVERSATION_STARTERS} conversation starters
                </p>
                <span className="text-xs text-gray-500">
          {starters.length}/{MAX_CONVERSATION_STARTERS}
        </span>
            </div>

            {starters.map((starter, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        value={starter}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder={`Starter ${index + 1}... e.g. "What anime are you watching?"`}
                        maxLength={100}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="text-red-400 hover:text-red-300 px-2 transition"
                    >
                        ×
                    </button>
                </div>
            ))}

            {starters.length < MAX_CONVERSATION_STARTERS && (
                <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full border border-dashed border-gray-700 hover:border-blue-500 text-gray-400 hover:text-blue-400 py-2.5 rounded-lg text-sm transition"
                >
                    + Add Starter
                </button>
            )}

            {starters.length === 0 && (
                <p className="text-xs text-gray-600 text-center">
                    Conversation starters appear as clickable chips when someone first opens your bot
                </p>
            )}
        </div>
    );
}