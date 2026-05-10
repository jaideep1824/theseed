export interface User {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    plan: 'free' | 'pro' | 'creator';
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    messages_sent_today: number;
    messages_reset_date: string;
    created_at: string;
    updated_at: string;
}

export interface Bot {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    tagline: string | null;
    avatar_url: string | null;
    personality_traits: PersonalityTraits;
    backstory: string | null;
    custom_instructions: string | null;
    conversation_starters: string[];
    is_public: boolean;
    category: BotCategory;
    likes_count: number;
    total_conversations: number;
    total_messages: number;
    created_at: string;
    updated_at: string;
}

export interface PersonalityTraits {
    humor: number;
    empathy: number;
    formality: number;
    energy: number;
    creativity: number;
}

export interface Conversation {
    id: string;
    bot_id: string;
    user_id: string | null;
    session_id: string | null;
    title: string | null;
    message_count: number;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    token_count: number | null;
    created_at: string;
}

export interface BotLike {
    user_id: string;
    bot_id: string;
    created_at: string;
}

export interface CreateBotInput {
    name: string;
    tagline?: string;
    avatar_url?: string;
    personality_traits: PersonalityTraits;
    backstory?: string;
    custom_instructions?: string;
    conversation_starters: string[];
    is_public: boolean;
    category: BotCategory;
}

export interface UpdateBotInput extends Partial<CreateBotInput> {}

export interface ChatRequest {
    bot_id: string;
    conversation_id?: string;
    message: string;
    session_id?: string;
}

export interface ChatResponse {
    conversation_id: string;
    message: string;
}

export interface ApiError {
    error: string;
    code?: string;
}

export type BotCategory = 'friend' | 'tutor' | 'coach' | 'character' | 'companion';
export type PlanType = 'free' | 'pro' | 'creator';
export type PersonalityTrait = 'humor' | 'empathy' | 'formality' | 'energy' | 'creativity';