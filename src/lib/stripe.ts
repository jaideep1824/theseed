import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

export async function createCheckoutSession(
    userId: string,
    plan: 'pro' | 'creator',
    email: string,
    customerId?: string
) {
    const priceId = plan === 'pro'
        ? process.env.STRIPE_PRO_PRICE_ID!
        : process.env.STRIPE_CREATOR_PRICE_ID!;

    const session = await stripe.checkout.sessions.create({
        customer: customerId || undefined,
        customer_email: customerId ? undefined : email,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        metadata: { userId },
    });

    return session;
}