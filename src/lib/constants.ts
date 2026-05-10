export const PLAN_LIMITS = {
    free: { maxBots: 1, maxMessagesPerDay: 1000 },
    pro: { maxBots: 5, maxMessagesPerDay: Infinity },
    creator: { maxBots: Infinity, maxMessagesPerDay: Infinity },
} as const;

export const BOT_CATEGORIES = [
    { value: 'friend', label: 'Friend', description: 'A casual companion to chat with' },
    { value: 'tutor', label: 'Tutor', description: 'Helps you learn and study' },
    { value: 'coach', label: 'Coach', description: 'Motivates and guides you' },
    { value: 'character', label: 'Character', description: 'A fictional persona to interact with' },
    { value: 'companion', label: 'Companion', description: 'An emotional support companion' },
] as const;

export const PERSONALITY_TRAITS = [
    { key: 'humor', label: 'Humor', lowLabel: 'Serious', highLabel: 'Hilarious' },
    { key: 'empathy', label: 'Empathy', lowLabel: 'Detached', highLabel: 'Deeply caring' },
    { key: 'formality', label: 'Formality', lowLabel: 'Very casual', highLabel: 'Very formal' },
    { key: 'energy', label: 'Energy', lowLabel: 'Calm', highLabel: 'Hyper energetic' },
    { key: 'creativity', label: 'Creativity', lowLabel: 'Practical', highLabel: 'Wildly creative' },
] as const;

export const DEFAULT_PERSONALITY = {
    humor: 0.5,
    empathy: 0.5,
    formality: 0.5,
    energy: 0.5,
    creativity: 0.5,
};

export const DEFAULT_AVATARS = [
    '/avatars/default-1.png',
    '/avatars/default-2.png',
    '/avatars/default-3.png',
    '/avatars/default-4.png',
];

export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_BACKSTORY_LENGTH = 2000;
export const MAX_INSTRUCTIONS_LENGTH = 1000;
export const MAX_BOT_NAME_LENGTH = 50;
export const MAX_TAGLINE_LENGTH = 100;
export const MAX_CONVERSATION_STARTERS = 5;
export const MESSAGES_PER_CONTEXT = 20;