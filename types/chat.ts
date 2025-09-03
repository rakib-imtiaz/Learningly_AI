export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  model_name: 'gpt-4' | 'gpt-3.5-turbo' | 'gemini-pro' | 'claude';
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  content_type: 'text' | 'markdown' | 'code' | 'image';
  metadata: Record<string, any>;
  created_at: string;
}

export interface ChatAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  created_at: string;
}

export interface ChatPreferences {
  id: string;
  user_id: string;
  default_model: 'gpt-4' | 'gpt-3.5-turbo' | 'gemini-pro' | 'claude';
  max_context_length: number;
  temperature: number;
  auto_save: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatUsage {
  id: string;
  user_id: string;
  conversation_id: string;
  tokens_used: number;
  model_name: string;
  cost?: number;
  created_at: string;
}

export interface CreateConversationRequest {
  title?: string;
  model_name: 'gpt-4' | 'gpt-3.5-turbo' | 'gemini-pro' | 'claude';
}

export interface SendMessageRequest {
  conversation_id: string;
  content: string;
  content_type?: 'text' | 'markdown' | 'code' | 'image';
  metadata?: Record<string, any>;
}

export interface UpdateConversationRequest {
  title?: string;
  is_archived?: boolean;
}

export interface ChatContext {
  conversation: ChatConversation;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatState {
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// AI Model Response Types
export interface AIResponse {
  content: string;
  model_name: string;
  tokens_used: number;
  cost?: number;
  metadata?: Record<string, any>;
}

export interface ChatStreamResponse {
  content: string;
  done: boolean;
  model_name: string;
  tokens_used?: number;
}

// Search and Filter Types
export interface ConversationFilters {
  search?: string;
  model_name?: string;
  is_archived?: boolean;
  date_from?: string;
  date_to?: string;
}

export interface MessageSearchResult {
  message: ChatMessage;
  conversation: ChatConversation;
  snippet: string;
  relevance_score: number;
}
