import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const db = createServiceRoleClient();
    const { data: bot, error } = await db
        .from('bots')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !bot) {
        return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    return NextResponse.json({ bot });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = createServiceRoleClient();
    const { data: bot } = await db
        .from('bots')
        .select('user_id')
        .eq('id', params.id)
        .single();

    if (!bot || bot.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { data: updated, error } = await db
        .from('bots')
        .update(body)
        .eq('id', params.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bot: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = createServiceRoleClient();
    const { data: bot } = await db
        .from('bots')
        .select('user_id')
        .eq('id', params.id)
        .single();

    if (!bot || bot.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await db.from('bots').delete().eq('id', params.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
