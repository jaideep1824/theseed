import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Must be logged in to like a bot' }, { status: 401 });
    }

    const { bot_id } = await req.json();

    if (!bot_id) {
        return NextResponse.json({ error: 'bot_id is required' }, { status: 400 });
    }

    const db = createServiceRoleClient();

    // Check if already liked
    const { data: existing } = await db
        .from('bot_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('bot_id', bot_id)
        .single();

    if (existing) {
        // Unlike
        await db.from('bot_likes')
            .delete()
            .eq('user_id', user.id)
            .eq('bot_id', bot_id);

        const { data: bot } = await db
            .from('bots')
            .select('likes_count')
            .eq('id', bot_id)
            .single();

        return NextResponse.json({
            liked: false,
            likes_count: bot?.likes_count || 0
        });
    } else {
        // Like
        await db.from('bot_likes')
            .insert({ user_id: user.id, bot_id: bot_id });

        const { data: bot } = await db
            .from('bots')
            .select('likes_count')
            .eq('id', bot_id)
            .single();

        return NextResponse.json({
            liked: true,
            likes_count: bot?.likes_count || 0
        });
    }
}