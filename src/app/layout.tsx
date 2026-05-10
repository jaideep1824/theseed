import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'TheSeed - Build Your Own AI Companion',
    description: 'Create, customize, and share AI companions. No coding required.',
    openGraph: {
        title: 'TheSeed - Build Your Own AI Companion',
        description: 'Create, customize, and share AI companions. No coding required.',
        siteName: 'TheSeed',
        type: 'website',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gray-950 text-white min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}