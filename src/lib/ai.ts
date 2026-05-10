import OpenAI from 'openai';

function getAIClient() {
    const provider = process.env.AI_PROVIDER || 'together';

    if (provider === 'groq') {
        return new OpenAI({
            apiKey: process.env.GROQ_API_KEY!,
            baseURL: 'https://api.groq.com/openai/v1',
        });
    }

    return new OpenAI({
        apiKey: process.env.TOGETHER_API_KEY!,
        baseURL: 'https://api.together.xyz/v1',
    });
}

export async function streamChatResponse(
    systemPrompt: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    userMessage: string
) {
    const client = getAIClient();
    const model = process.env.AI_MODEL || 'NousResearch/Hermes-3-Llama-3.1-8B';

    const stream = await client.chat.completions.create({
        model,
        messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
            { role: 'user', content: userMessage },
        ],
        stream: true,
        max_tokens: 1024,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
    });

    return stream;
}