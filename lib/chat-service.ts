import { getSupabaseClient } from './supabase-client';
import {
  ChatConversation,
  ChatMessage,
  ChatPreferences,
  ChatUsage,
  CreateConversationRequest,
  SendMessageRequest,
  UpdateConversationRequest,
  ConversationFilters,
  MessageSearchResult
} from '@/types/chat';

export class ChatService {
  private supabase = getSupabaseClient();

  // Conversation Management
  async createConversation(request: CreateConversationRequest): Promise<ChatConversation> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('chat_conversations')
      .insert({
        user_id: user.id,
        title: request.title || 'New Conversation',
        model_name: request.model_name
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create conversation: ${error.message}`);
    return data;
  }

  async getConversations(filters?: ConversationFilters): Promise<ChatConversation[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = this.supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }
    if (filters?.model_name) {
      query = query.eq('model_name', filters.model_name);
    }
    if (filters?.is_archived !== undefined) {
      query = query.eq('is_archived', filters.is_archived);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch conversations: ${error.message}`);
    return data || [];
  }

  async getConversation(id: string): Promise<ChatConversation> {
    const { data, error } = await this.supabase
      .from('chat_conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Failed to fetch conversation: ${error.message}`);
    return data;
  }

  async updateConversation(id: string, updates: UpdateConversationRequest): Promise<ChatConversation> {
    const { data, error } = await this.supabase
      .from('chat_conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update conversation: ${error.message}`);
    return data;
  }

  async deleteConversation(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('chat_conversations')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete conversation: ${error.message}`);
  }

  // Message Management
  async sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Verify conversation belongs to user
    const conversation = await this.getConversation(request.conversation_id);
    if (conversation.user_id !== user.id) {
      throw new Error('Unauthorized access to conversation');
    }

    const { data, error } = await this.supabase
      .from('chat_messages')
      .insert({
        conversation_id: request.conversation_id,
        role: 'user',
        content: request.content,
        content_type: request.content_type || 'text',
        metadata: request.metadata || {}
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to send message: ${error.message}`);
    return data;
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
    return data || [];
  }

  async addAssistantMessage(conversationId: string, content: string, metadata?: Record<string, any>): Promise<ChatMessage> {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content,
        content_type: 'text',
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to add assistant message: ${error.message}`);
    return data;
  }

  // Preferences Management
  async getUserPreferences(): Promise<ChatPreferences | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('chat_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to fetch preferences: ${error.message}`);
    }

    return data;
  }

  async updateUserPreferences(preferences: Partial<ChatPreferences>): Promise<ChatPreferences> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('chat_preferences')
      .upsert({
        user_id: user.id,
        ...preferences
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to update preferences: ${error.message}`);
    return data;
  }

  // Usage Tracking
  async logUsage(usage: Omit<ChatUsage, 'id' | 'created_at'>): Promise<void> {
    const { error } = await this.supabase
      .from('chat_usage')
      .insert(usage);

    if (error) throw new Error(`Failed to log usage: ${error.message}`);
  }

  // Search Functionality
  async searchMessages(query: string): Promise<MessageSearchResult[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Use full-text search on message content
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select(`
        *,
        chat_conversations!inner(
          id,
          title,
          user_id
        )
      `)
      .eq('chat_conversations.user_id', user.id)
      .textSearch('content', query)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw new Error(`Failed to search messages: ${error.message}`);

    return (data || []).map(item => ({
      message: {
        id: item.id,
        conversation_id: item.conversation_id,
        role: item.role,
        content: item.content,
        content_type: item.content_type,
        metadata: item.metadata,
        created_at: item.created_at
      },
      conversation: {
        id: item.chat_conversations.id,
        title: item.chat_conversations.title,
        user_id: item.chat_conversations.user_id,
        model_name: item.chat_conversations.model_name,
        is_archived: item.chat_conversations.is_archived,
        created_at: item.chat_conversations.created_at,
        updated_at: item.chat_conversations.updated_at
      },
      snippet: this.generateSnippet(item.content, query),
      relevance_score: 1.0 // Could implement more sophisticated scoring
    }));
  }

  private generateSnippet(content: string, query: string): string {
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    const index = contentLower.indexOf(queryLower);
    
    if (index === -1) {
      return content.substring(0, 100) + '...';
    }

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    return content.substring(start, end) + '...';
  }

  // Real-time subscriptions
  subscribeToMessages(conversationId: string, callback: (message: ChatMessage) => void) {
    return this.supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  async subscribeToConversations(callback: (conversation: ChatConversation) => void) {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      if (error || !user) {
        console.log('ChatService: No authenticated user for conversation subscription');
        return null;
      }

      return this.supabase
        .channel(`conversations:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chat_conversations',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            callback(payload.new as ChatConversation);
          }
        )
        .subscribe();
    } catch (error) {
      console.error('ChatService: Error setting up conversation subscription:', error);
      return null;
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
