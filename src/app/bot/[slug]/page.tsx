'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Bot } from '@/types';
import ChatInterface from '@/components/ChatInterface';

export default function BotChatPage() {
    const { slug } = useParams();
    const [bot, setBot] = useState<Bot | null>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        loadBot();
    }, [slug]);

    async function loadBot() {
        const supabase = createClient();

        // Fetch bot by slug
        const { data: botData } = await supabase
            .from('bots')
            .select('*')
            .eq('slug', slug)
            .single();

        if (!botData) {
            setLoading(false);
            return;
        }

        setBot(botData);
        setLikesCount(botData.likes_count);

        // Check if logged in user owns this bot or has liked it
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setIsOwner(user.id === botData.user_id);

            const { data: like } = await supabase
                .from('bot_likes')
                .select('*')
                .eq('user_id', user.id)
                .eq('bot_id', botData.id)
                .single();

            setLiked(!!like);
        }

        setLoading(false);
    }

    async function handleLike() {
        const res = await fetch('/api/likes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bot_id: bot?.id }),
        });

        if (res.status === 401) {
            alert('Please log in to like bots');
            return;
        }

        const data = await res.json();
        setLiked(data.liked);
        setLikesCount(data.likes_count);
    }

    async function handleShare() {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-800 rounded w-1/2 mb-8" />
                <div className="h-96 bg-gray-800 rounded-xl" />
            </div>
        );
    }

    if (!bot) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="text-5xl mb-4">🤖</div>
                <h1 className="text-2xl font-bold text-white mb-2">Bot not found</h1>
                <p className="text-gray-400 mb-6">This bot doesn't exist or has been deleted.</p>
                <Link href="/explore" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
                    Browse Bots
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Bot Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {bot.avatar_url && !bot.avatar_url.startsWith('/') ? (
                            <img src={bot.avatar_url} alt={bot.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white font-bold text-2xl">{bot.name.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{bot.name}</h1>
                        {bot.tagline && <p className="text-gray-400">{bot.tagline}</p>}
                        <div className="flex items-center gap-3 mt-1">
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded capitalize">
                {bot.category}
              </span>
                            <span className="text-xs text-gray-500">❤️ {likesCount}</span>
                            <span className="text-xs text-gray-500">💬 {bot.total_messages}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {isOwner && (
                        <Link
                            href={`/bot/${bot.slug}/edit`}
                            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg transition"
                        >
                            Edit
                        </Link>
                    )}
                    <button
                        onClick={handleShare}
                        className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg transition"
                    >
                        Share
                    </button>
                    <button
                        onClick={handleLike}
                        className={`text-sm px-3 py-2 rounded-lg transition ${
                            liked
                                ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                    >
                        {liked ? '❤️' : '🤍'} {likesCount}
                    </button>
                </div>
            </div>

            {/* Chat Interface */}
            <ChatInterface bot={bot} />
        </div>
    );
}