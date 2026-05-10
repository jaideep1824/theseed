import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { streamChatResponse } from '@/lib/ai';
import { buildSystemPrompt } from '@/lib/prompts';
import { PLAN_LIMITS, MESSAGES_PER_CONTEXT } from '@/lib/constants';
import type { Bot, ChatRequest } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const body: ChatRequest = await req.json();
        const { bot_id, conversation_id, message, session_id } = body;

        if (!bot_id || !message) {
            return NextResponse.json({ error: 'bot_id and message are required' }, { status: 400 });
        }

        if (message.length > 2000) {
            return NextResponse.json({ error: 'Message too long' }, { status: 400 });
        }

        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        const db = createServiceRoleClient();

        // Load bot
        const { data: bot, error: botError } = await db
            .from('bots')
            .select('*')
            .eq('id', bot_id)
            .single();

        if (botError || !bot) {
            return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
        }

        // Rate limiting for logged in users
        if (user) {
            const { data: userData } = await db
                .from('users')
                .select('plan, messages_sent_today, messages_reset_date')
                .eq('id', user.id)
                .single();

            if (userData) {
                const plan = userData.plan || 'free';
                const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS].maxMessagesPerDay;
                const today = new Date().toISOString().split('T')[0];
                let messagesToday = userData.messages_sent_today;

                if (userData.messages_reset_date !== today) {
                    messagesToday = 0;
                }

                if (messagesToday >= limit) {
                    return NextResponse.json(
                        { error: 'Daily message limit reached. Upgrade your plan.' },
                        { status: 429 }
                    );
                }

                await db.from('users').update({
                    messages_sent_today: messagesToday + 1,
                    messages_reset_date: today,
                }).eq('id', user.id);
            }
        }

        // Get or create conversation
        let convId = conversation_id;
        if (!convId) {
            const { data: newConv } = await db.from('conversations').insert({
                bot_id,
                user_id: user?.id || null,
                session_id: user ? null : (session_id || null),
                title: message.substring(0, 50),
            }).select().single();
            convId = newConv?.id;
        }

        // Load history
        const { data: history } = await db
            .from('messages')
            .select('role, content')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true })
            .limit(MESSAGES_PER_CONTEXT);

        const conversationHistory = (history || []).map((msg: any) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
        }));

        // Save user message
        await db.from('messages').insert({
            conversation_id: convId,
            role: 'user',
            content: message,
        });

        // Build prompt and stream AI response
        const systemPrompt = buildSystemPrompt(bot as Bot);
        const stream = await streamChatResponse(systemPrompt, conversationHistory, message);

        let fullResponse = '';
        const encoder = new TextEncoder();

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const text = chunk.choices[0]?.delta?.content || '';
                        if (text) {
                            fullResponse += text;
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ text, conversation_id: convId })}\n\n`)
                            );
                        }
                    }

                    // Save full AI response
                    await db.from('messages').insert({
                        conversation_id: convId,
                        role: 'assistant',
                        content: fullResponse,
                    });

                    controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}