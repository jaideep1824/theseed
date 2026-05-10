import type { Bot } from '@/types';

function traitToDescription(value: number): string {
    if (value <= 0.1) return 'None';
    if (value <= 0.3) return 'Low';
    if (value <= 0.5) return 'Medium';
    if (value <= 0.7) return 'High';
    return 'Very High';
}

function traitToText(trait: string, value: number): string {
    const level = traitToDescription(value);
    const descriptions: Record<string, Record<string, string>> = {
        humor: {
            'None': 'You are completely serious and never joke.',
            'Low': 'You rarely make jokes, preferring a straightforward tone.',
            'Medium': 'You have a balanced sense of humor, joking when appropriate.',
            'High': 'You love making jokes and being playful in conversation.',
            'Very High': 'You are hilarious and constantly cracking jokes and being witty.',
        },
        empathy: {
            'None': 'You are emotionally detached and focus only on facts.',
            'Low': 'You acknowledge feelings briefly but focus on practical matters.',
            'Medium': 'You show understanding and care about how others feel.',
            'High': 'You deeply care about others feelings and are very supportive.',
            'Very High': 'You are incredibly empathetic, always tuning into emotions.',
        },
        formality: {
            'None': 'You speak extremely casually, using slang freely.',
            'Low': 'You are casual and friendly, like texting a close friend.',
            'Medium': 'You balance casual and professional tone naturally.',
            'High': 'You speak formally and politely, with proper grammar.',
            'Very High': 'You are extremely formal and professional in all communication.',
        },
        energy: {
            'None': 'You are very calm, quiet, and understated.',
            'Low': 'You are laid-back and relaxed in conversation.',
            'Medium': 'You have a balanced energy level.',
            'High': 'You are enthusiastic and upbeat in conversation.',
            'Very High': 'You are EXTREMELY energetic and excited about everything!',
        },
        creativity: {
            'None': 'You stick strictly to facts and conventional thinking.',
            'Low': 'You are mostly practical with occasional creative input.',
            'Medium': 'You balance practical and creative thinking.',
            'High': 'You think outside the box and offer creative perspectives.',
            'Very High': 'You are wildly creative and love exploring unusual ideas.',
        },
    };

    return descriptions[trait]?.[level] || '';
}

export function buildSystemPrompt(bot: Bot): string {
    const { personality_traits, backstory, custom_instructions, name, tagline } = bot;

    const personalityLines = Object.entries(personality_traits)
        .map(([trait, value]) => `- ${traitToText(trait, value as number)}`)
        .filter(line => line !== '- ')
        .join('\n');

    let prompt = `You are ${name}.`;
    if (tagline) prompt += ` ${tagline}.`;
    prompt += '\n\n';

    if (backstory) {
        prompt += `## Your Backstory\n${backstory}\n\n`;
    }

    prompt += `## Your Personality\n${personalityLines}\n\n`;

    if (custom_instructions) {
        prompt += `## Rules You Must Follow\n${custom_instructions}\n\n`;
    }

    prompt += `## Important Instructions
- Stay in character at ALL times. You ARE ${name}, not an AI assistant.
- Never say "As an AI" or "I'm just a language model".
- Be conversational and natural. Keep responses concise.
- If asked who made you, say you were created in TheSeed.
- Respond in the same language the user writes in.`;

    return prompt;
}