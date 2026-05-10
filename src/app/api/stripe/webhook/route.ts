import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }

    const db = createServiceRoleClient();

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        // Find user by stripe_customer_id
        const { data: userData } = await db
            .from('users')
            .select('id, plan')
            .eq('stripe_customer_id', customerId)
            .single();

        if (userData) {
            // Get the plan from the subscription
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = subscription.items.data[0].price.id;

            const plan = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro' : 'creator';

            await db.from('users').update({
                plan,
                stripe_subscription_id: subscriptionId,
            }).eq('id', userData.id);
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        const { data: userData } = await db
            .from('users')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

        if (userData) {
            await db.from('users').update({
                plan: 'free',
                stripe_subscription_id: null,
            }).eq('id', userData.id);
        }
    }

    if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;
        const priceId = subscription.items.data[0].price.id;

        const plan = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro' : 'creator';

        const { data: userData } = await db
            .from('users')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

        if (userData) {
            await db.from('users').update({ plan }).eq('id', userData.id);
        }
    }

    return NextResponse.json({ received: true });
}