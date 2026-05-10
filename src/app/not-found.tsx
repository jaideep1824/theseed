import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="text-8xl mb-6">🌱</div>
            <h1 className="text-4xl font-bold text-white mb-3">404</h1>
            <p className="text-xl text-gray-400 mb-2">Page not found</p>
            <p className="text-gray-500 mb-8">
                This page doesn't exist or was moved.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                >
                    Go Home
                </Link>
                <Link
                    href="/explore"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition"
                >
                    Explore Bots
                </Link>
            </div>
        </div>
    );
}