'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-gray-400 mb-8">
                An unexpected error occurred. Please try again.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}