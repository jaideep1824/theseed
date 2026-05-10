'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Bot, User } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { PLAN_LIMITS } from '@/lib/constants';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try{
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser){setLoading(false); return;}

        const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();
        setUser(userData);

        const res = await fetch('/api/bots');
        const data = await res.json();
        setBots(data.bots || []);}
        catch(error) {
            console.error('Dashboard load error:', error);
        }
        finally{
            setLoading(false);
        }

    }

    async function handleDelete(botId: string) {
        if (!confirm('Are you sure you want to delete this bot?')) return;
        setDeleting(botId);

        await fetch(`/api/bots/${botId}`, { method: 'DELETE' });
        setBots(prev => prev.filter(b => b.id !== botId));
        setDeleting(null);
    }

    async function handleShare(slug: string) {
        await navigator.clipboard.writeText(`${window.location.origin}/bot/${slug}`);
        alert('Link copied to clipboard!');
    }

    const plan = user?.plan || 'free';
    const botLimit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS].maxBots;
    const canCreateBot = bots.length < botLimit;

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-800 rounded w-1/3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-gray-800 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Welcome back, {user?.display_name}!
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Plan: <span className="capitalize text-blue-400">{plan}</span>
                        {' • '}
                        {bots.length}/{botLimit === Infinity ? '∞' : botLimit} bots used
                    </p>
                </div>

                <div className="flex gap-3">
                    {!canCreateBot && (
                        <Link
                            href="/pricing"
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Upgrade Plan
                        </Link>
                    )}
                    <Link
                        href={canCreateBot ? '/bot/new' : '/pricing'}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            canCreateBot
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        + Create New Bot
                    </Link>
                </div>
            </div>

            {/* Bots Grid */}
            {bots.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🌱</div>
                    <h2 className="text-xl font-semibold text-white mb-2">No bots yet</h2>
                    <p className="text-gray-400 mb-6">Create your first AI companion to get started</p>
                    <Link
                        href="/bot/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Create Your First Bot
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bots.map(bot => (
                        <div key={bot.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            {/* Bot Info */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {bot.avatar_url ? (
                                        <img src={bot.avatar_url} alt={bot.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-bold">{bot.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold truncate">{bot.name}</h3>
                                    <p className="text-gray-400 text-sm truncate">{bot.tagline || 'No tagline'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded capitalize">
                      {bot.category}
                    </span>
                                        <span className="text-xs text-gray-500">
                      {bot.is_public ? 'Public' : 'Private'}
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-4 text-sm text-gray-400 mb-4">
                                <span>❤️ {bot.likes_count}</span>
                                <span>💬 {bot.total_messages}</span>
                                <span>{formatRelativeTime(bot.created_at)}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link
                                    href={`/bot/${bot.slug}`}
                                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
                                >
                                    Chat
                                </Link>
                                <Link
                                    href={`/bot/${bot.slug}/edit`}
                                    className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded-lg transition"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleShare(bot.slug)}
                                    className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg transition"
                                >
                                    Share
                                </button>
                                <button
                                    onClick={() => handleDelete(bot.id)}
                                    disabled={deleting === bot.id}
                                    className="bg-red-900/50 hover:bg-red-900 text-red-400 text-sm px-3 py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {deleting === bot.id ? '...' : 'Del'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}