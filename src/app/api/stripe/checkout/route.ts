import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { createCheckoutSession, stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!plan || !['pro', 'creator'].includes(plan)) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const db = createServiceRoleClient();
    const { data: userData } = await db
        .from('users')
        .select('email, stripe_customer_id')
        .eq('id', user.id)
        .single();

    if (!userData) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or reuse Stripe customer
    let customerId = userData.stripe_customer_id;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: userData.email,
            metadata: { userId: user.id },
        });

        customerId = customer.id;

        await db.from('users')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
    }

    const session = await createCheckoutSession(
        user.id,
        plan,
        userData.email,
        customerId
    );

    return NextResponse.json({ url: session.url });
}