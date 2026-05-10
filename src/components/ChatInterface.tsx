'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, Bot } from '@/types';
import { generateSessionId } from '@/lib/utils';
import ChatMessage from './ChatMessage';

interface ChatInterfaceProps {
    bot: Bot;
    initialConversationId?: string;
}

export default function ChatInterface({ bot, initialConversationId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
    const [sessionId] = useState(() => generateSessionId());
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function sendMessage(text: string) {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            conversation_id: conversationId || '',
            role: 'user',
            content: text,
            token_count: null,
            created_at: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            conversation_id: conversationId || '',
            role: 'assistant',
            content: '',
            token_count: null,
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMessage]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bot_id: bot.id,
                    conversation_id: conversationId,
                    message: text,
                    session_id: sessionId,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...botMessage,
                        content: err.error || 'Something went wrong. Please try again.',
                    };
                    return updated;
                });
                setIsLoading(false);
                return;
            }

            const reader = res.body!.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.slice(6));
                            fullText += data.text;
                            if (data.conversation_id) setConversationId(data.conversation_id);

                            setMessages(prev => {
                                const updated = [...prev];
                                updated[updated.length - 1] = {
                                    ...botMessage,
                                    content: fullText,
                                    conversation_id: data.conversation_id || conversationId || '',
                                };
                                return updated;
                            });
                        } catch (e) {}
                    }
                }
            }
        } catch (error) {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...botMessage,
                    content: 'Connection error. Please try again.',
                };
                return updated;
            });
        }

        setIsLoading(false);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    }

    return (
        <div className="flex flex-col h-[600px] bg-gray-900 rounded-xl border border-gray-800">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="space-y-3">
                        <p className="text-center text-gray-500 text-sm">
                            Start a conversation with {bot.name}
                        </p>
                        {bot.conversation_starters?.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {bot.conversation_starters.map((starter, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(starter)}
                                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-full border border-gray-700 transition"
                                    >
                                        {starter}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {messages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        botAvatar={bot.avatar_url}
                        botName={bot.name}
                    />
                ))}

                {isLoading && messages[messages.length - 1]?.role === 'assistant' &&
                    messages[messages.length - 1]?.content === '' && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {bot.name.charAt(0).toUpperCase()}
              </span>
                            </div>
                            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex gap-3">
          <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${bot.name}...`}
              rows={1}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl transition font-medium"
                    >
                        Send
                    </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
        </div>
    );
}
