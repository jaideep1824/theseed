'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

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

    async function handleSignOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
        router.refresh();
    }

    return (
        <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition">
                        TheSeed
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/explore" className="text-gray-400 hover:text-white transition">
                            Explore
                        </Link>

                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                                    Dashboard
                                </Link>
                                <span className="text-gray-400 text-sm">{user.display_name}</span>
                                <button
                                    onClick={handleSignOut}
                                    className="text-gray-400 hover:text-white transition text-sm"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="text-gray-400 hover:text-white transition">
                                    Login
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link href="/explore" className="block text-gray-400 hover:text-white py-2 transition">
                            Explore
                        </Link>
                        {user ? (
                            <>
                                <Link href="/dashboard" className="block text-gray-400 hover:text-white py-2 transition">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="block text-gray-400 hover:text-white py-2 transition w-full text-left"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="block text-gray-400 hover:text-white py-2 transition">
                                    Login
                                </Link>
                                <Link href="/auth/signup" className="block text-gray-400 hover:text-white py-2 transition">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}