import { Message } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface ChatMessageProps {
    message: Message;
    botAvatar?: string | null;
    botName?: string;
}

export default function ChatMessage({ message, botAvatar, botName }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                    {botAvatar ? (
                        <img src={botAvatar} alt={botName} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white text-xs font-bold">
              {botName?.charAt(0).toUpperCase() || 'B'}
            </span>
                    )}
                </div>
            )}

            {/* Message bubble */}
            <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isUser
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-gray-800 text-gray-100 rounded-tl-sm'
                    }`}
                >
                    {message.content}
                </div>
                <span className="text-xs text-gray-500">
          {formatRelativeTime(message.created_at)}
        </span>
            </div>
        </div>
    );
}