'use client';

import { useState, useEffect } from 'react';
import { Bot } from '@/types';
import { BOT_CATEGORIES } from '@/lib/constants';
import BotCard from '@/components/BotCard';

export default function ExplorePage() {
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadBots(true);
    }, [search, category]);

    async function loadBots(reset = false) {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        if (reset) setPage(1);

        const params = new URLSearchParams({
            public: 'true',
            page: currentPage.toString(),
            limit: '12',
        });

        if (category !== 'all') params.set('category', category);
        if (search) params.set('search', search);

        const res = await fetch(`/api/bots?${params}`);
        const data = await res.json();

        if (reset) {
            setBots(data.bots || []);
        } else {
            setBots(prev => [...prev, ...(data.bots || [])]);
        }

        setTotal(data.total || 0);
        setLoading(false);
    }

    function handleLoadMore() {
        const nextPage = page + 1;
        setPage(nextPage);
        loadBots(false);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Explore</h1>
                <p className="text-gray-400">Discover AI companions created by the community</p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bots..."
                    className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap mb-8">
                <button
                    onClick={() => setCategory('all')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        category === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                >
                    All
                </button>
                {BOT_CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                            category === cat.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Bots Grid */}
            {loading && bots.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 bg-gray-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : bots.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <h2 className="text-xl font-semibold text-white mb-2">No bots found</h2>
                    <p className="text-gray-400">Try a different search or category</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bots.map((bot) => (
                            <BotCard key={bot.id} bot={bot} />
                        ))}
                    </div>

                    {/* Load More */}
                    {bots.length < total && (
                        <div className="text-center mt-8">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                            <p className="text-center text-gray-600 text-sm mt-4">
                                Showing {bots.length} of {total} bots
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}