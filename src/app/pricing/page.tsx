'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types';
import PricingCard from '@/components/PricingCard';

const PLANS = [
    {
        name: 'Free',
        price: null,
        description: 'Perfect for getting started',
        features: [
            '1 AI bot',
            '30 messages per day',
            'Public bot sharing',
            'Basic personality sliders',
            'Community support',
        ],
    },
    {
        name: 'Pro',
        price: 9,
        description: 'For creators who want more',
        features: [
            '5 AI bots',
            'Unlimited messages',
            'Public & private bots',
            'Full personality customization',
            'Basic analytics',
            'Email support',
        ],
        isPopular: true,
    },
    {
        name: 'Creator',
        price: 19,
        description: 'For power users & builders',
        features: [
            'Unlimited AI bots',
            'Unlimited messages',
            'Public & private bots',
            'Full analytics dashboard',
            'Knowledge base (coming soon)',
            'Priority email support',
        ],
    },
];

export default function PricingPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [upgrading, setUpgrading] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user: authUser } }) => {
            if (authUser) {
                supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .single()
                    .then(({ data }) => setUser(data));
            }
        });
    }, []);

    async function handleUpgrade(plan: 'pro' | 'creator') {
        if (!user) {
            router.push('/auth/signup');
            return;
        }

        setUpgrading(plan);

        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan }),
        });

        const data = await res.json();

        if (data.url) {
            window.location.href = data.url;
        } else {
            alert('Something went wrong. Please try again.');
            setUpgrading(null);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-gray-400 text-lg">
                    Start free. Upgrade when you need more.
                </p>
                {user && (
                    <p className="text-blue-400 text-sm mt-2">
                        Current plan: <span className="capitalize font-medium">{user.plan}</span>
                    </p>
                )}
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan) => (
                    <PricingCard
                        key={plan.name}
                        name={plan.name}
                        price={plan.price}
                        description={plan.description}
                        features={plan.features}
                        isPopular={plan.isPopular}
                        isCurrent={user?.plan === plan.name.toLowerCase()}
                        upgrading={upgrading === plan.name.toLowerCase()}
                        onUpgrade={() => handleUpgrade(plan.name.toLowerCase() as 'pro' | 'creator')}
                    />
                ))}
            </div>

            {/* FAQ */}
            <div className="mt-20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                    Common Questions
                </h2>
                <div className="space-y-6">
                    {[
                        {
                            q: 'Can I cancel anytime?',
                            a: 'Yes. Cancel anytime from your billing portal. You keep access until the end of your billing period.',
                        },
                        {
                            q: 'What happens to my bots if I downgrade?',
                            a: "Your bots stay. You just won't be able to create new ones beyond the free limit.",
                        },
                        {
                            q: 'Is there a free trial?',
                            a: 'The free plan is yours forever. No credit card required to start.',
                        },
                        {
                            q: 'What AI model powers the bots?',
                            a: 'We use open-source LLaMA models via Together AI and Groq - fast, capable, and no content restrictions.',
                        },
                    ].map(({ q, a }) => (
                        <div key={q} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <p className="text-white font-medium mb-2">{q}</p>
                            <p className="text-gray-400 text-sm">{a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}