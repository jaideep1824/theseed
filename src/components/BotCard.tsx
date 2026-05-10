import Link from 'next/link';
import { Bot } from '@/types';
import { truncate } from '@/lib/utils';

interface BotCardProps {
    bot: Bot;
}

export default function BotCard({ bot }: BotCardProps) {
    return (
        <div className="bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl p-5 transition group">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {bot.avatar_url ? (
                        <img
                            src={bot.avatar_url}
                            alt={bot.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white font-bold text-lg">{bot.name.charAt(0)}</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate group-hover:text-blue-400 transition">
                        {bot.name}
                    </h3>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded capitalize">
            {bot.category}
          </span>
                </div>
            </div>

            {/* Tagline */}
            <p className="text-gray-400 text-sm mb-4 min-h-[40px]">
                {bot.tagline ? truncate(bot.tagline, 80) : 'No description'}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">
          ❤️{bot.likes_count}
        </span>
                <Link
                    href={`/bot/${bot.slug}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
                >
                    Chat →
                </Link>
            </div>
        </div>
    );
}