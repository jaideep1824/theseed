import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Logo + Tagline */}
                    <div>
                        <h3 className="text-white font-bold text-lg">TheSeed</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Build your own AI companion. No coding required.
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                            Inspired by The Seed from Sword Art Online
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-8 text-sm">
                        <div className="space-y-2">
                            <p className="text-gray-400 font-medium">Product</p>
                            <Link href="/explore" className="block text-gray-500 hover:text-white transition">
                                Explore
                            </Link>
                            <Link href="/pricing" className="block text-gray-500 hover:text-white transition">
                                Pricing
                            </Link>
                            <Link href="/bot/new" className="block text-gray-500 hover:text-white transition">
                                Create Bot
                            </Link>
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-400 font-medium">Account</p>
                            <Link href="/auth/signup" className="block text-gray-500 hover:text-white transition">
                                Sign Up
                            </Link>
                            <Link href="/auth/login" className="block text-gray-500 hover:text-white transition">
                                Login
                            </Link>
                            <Link href="/dashboard" className="block text-gray-500 hover:text-white transition">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} TheSeed. Built with Next.js & Supabase.
                    </p>
                </div>
            </div>
        </footer>
    );
}