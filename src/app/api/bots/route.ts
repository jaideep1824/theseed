import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { PLAN_LIMITS } from '@/lib/constants';
import { slugify } from '@/lib/utils';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
    const db = createServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get('public');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    let query = db.from('bots').select('*', { count: 'exact' });

    if (isPublic === 'true') {
        query = query.eq('is_public', true);
    } else if (user) {
        query = query.eq('user_id', user.id);
    }

    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    query = query.order('likes_count', { ascending: false }).range(offset, offset + limit - 1);

    const { data: bots, error, count } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bots, total: count });
}

export async function POST(req: NextRequest) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = createServiceRoleClient();
    const { data: userData } = await db
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

    const plan = userData?.plan || 'free';
    const { data: existingBots } = await db
        .from('bots')
        .select('id')
        .eq('user_id', user.id);

    const botCount = existingBots?.length || 0;
    const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS].maxBots;

    if (botCount >= limit) {
        return NextResponse.json(
            { error: `Plan limit reached. Upgrade to create more bots.` },
            { status: 429 }
        );
    }

    const body = await req.json();
    const {
        name,
        tagline,
        avatar_url,
        personality_traits,
        backstory,
        custom_instructions,
        conversation_starters,
        is_public,
        category
    } = body;

    if (!name) {
        return NextResponse.json({ error: 'Bot name is required' }, { status: 400 });
    }

    let slug = slugify(name);
    const { data: existing } = await db.from('bots').select('id').eq('slug', slug).single();

    if (existing) {
        slug = `${slug}-${nanoid(4)}`;
    }

    const { data: bot, error } = await db.from('bots').insert({
        user_id: user.id,
        name,
        slug,
        tagline,
        avatar_url,
        personality_traits: personality_traits || { humor: 0.5, empathy: 0.5, formality: 0.5, energy: 0.5, creativity: 0.5 },
        backstory,
        custom_instructions,
        conversation_starters: conversation_starters || [],
        is_public: is_public ?? true,
        category: category || 'friend',
    }).select().single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bot }, { status: 201 });
}