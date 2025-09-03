import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './use-auth';
import { chatService } from '@/lib/chat-service';
import {
  ChatConversation,
  ChatMessage,
  ChatPreferences,
  CreateConversationRequest,
  SendMessageRequest,
  UpdateConversationRequest,
  ConversationFilters,
  MessageSearchResult
} from '@/types/chat';

interface UseChatReturn {
  // State
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  preferences: ChatPreferences | null;
  
  // Actions
  createConversation: (request: CreateConversationRequest) => Promise<ChatConversation>;
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  updateConversation: (updates: UpdateConversationRequest) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  searchMessages: (query: string) => Promise<MessageSearchResult[]>;
  updatePreferences: (preferences: Partial<ChatPreferences>) => Promise<void>;
  
  // Utilities
  clearError: () => void;
  refreshConversations: () => Promise<void>;
}

export function useChat(): UseChatReturn {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<ChatPreferences | null>(null);
  
  const subscriptionsRef = useRef<{ messages?: any; conversations?: any }>({});

  // Load user preferences on mount
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  // Load conversations on mount and when user changes
  useEffect(() => {
    if (user) {
      loadConversations();
      setupRealTimeSubscriptions();
    } else {
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
      cleanupSubscriptions();
    }

    return () => {
      cleanupSubscriptions();
    };
  }, [user]);

  const loadPreferences = async () => {
    try {
      const prefs = await chatService.getUserPreferences();
      setPreferences(prefs);
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const convos = await chatService.getConversations();
      setConversations(convos);
      
      // Select the most recent conversation if none is selected
      if (convos.length > 0 && !currentConversation) {
        await selectConversation(convos[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const msgs = await chatService.getMessages(conversationId);
      setMessages(msgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  };

           const setupRealTimeSubscriptions = async () => {
           if (!user) return;

           try {
             // Subscribe to conversation updates
             subscriptionsRef.current.conversations = await chatService.subscribeToConversations((conversation) => {
               setConversations(prev => {
                 const index = prev.findIndex(c => c.id === conversation.id);
                 if (index >= 0) {
                   const updated = [...prev];
                   updated[index] = conversation;
                   return updated;
                 } else {
                   return [conversation, ...prev];
                 }
               });
             });

             // Subscribe to message updates for current conversation
             if (currentConversation) {
               subscriptionsRef.current.messages = chatService.subscribeToMessages(
                 currentConversation.id,
                 (message) => {
                   setMessages(prev => [...prev, message]);
                 }
               );
             }
           } catch (error) {
             console.error('Failed to setup real-time subscriptions:', error);
           }
         };

  const cleanupSubscriptions = () => {
    if (subscriptionsRef.current.messages) {
      subscriptionsRef.current.messages.unsubscribe();
      subscriptionsRef.current.messages = null;
    }
    if (subscriptionsRef.current.conversations) {
      subscriptionsRef.current.conversations.unsubscribe();
      subscriptionsRef.current.conversations = null;
    }
  };

  const createConversation = useCallback(async (request: CreateConversationRequest): Promise<ChatConversation> => {
    try {
      setError(null);
      const conversation = await chatService.createConversation(request);
      
      setConversations(prev => [conversation, ...prev]);
      setCurrentConversation(conversation);
      setMessages([]);
      
      return conversation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const selectConversation = useCallback(async (conversationId: string) => {
    try {
      setError(null);
      
      // Clean up previous message subscription
      if (subscriptionsRef.current.messages) {
        subscriptionsRef.current.messages.unsubscribe();
      }

      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      setCurrentConversation(conversation);
      await loadMessages(conversationId);

                   // Set up new message subscription
             try {
               subscriptionsRef.current.messages = chatService.subscribeToMessages(
                 conversationId,
                 (message) => {
                   setMessages(prev => [...prev, message]);
                 }
               );
             } catch (error) {
               console.error('Failed to setup message subscription:', error);
             }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select conversation');
    }
  }, [conversations]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentConversation) {
      throw new Error('No conversation selected');
    }

    try {
      setError(null);
      
      // Add user message immediately for optimistic UI
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: currentConversation.id,
        role: 'user',
        content,
        content_type: 'text',
        metadata: {},
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Send message to backend
      const savedMessage = await chatService.sendMessage({
        conversation_id: currentConversation.id,
        content,
        content_type: 'text'
      });

      // Replace temporary message with saved one
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? savedMessage : msg
      ));

      // TODO: Here you would typically call your AI service
      // For now, we'll just add a placeholder assistant message
      const assistantMessage = await chatService.addAssistantMessage(
        currentConversation.id,
        "This is a placeholder response. Implement your AI service integration here."
      );

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
    }
  }, [currentConversation]);

  const updateConversation = useCallback(async (updates: UpdateConversationRequest) => {
    if (!currentConversation) {
      throw new Error('No conversation selected');
    }

    try {
      setError(null);
      const updated = await chatService.updateConversation(currentConversation.id, updates);
      
      setCurrentConversation(updated);
      setConversations(prev => prev.map(c => 
        c.id === updated.id ? updated : c
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation');
    }
  }, [currentConversation]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      setError(null);
      await chatService.deleteConversation(conversationId);
      
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
        
        // Select the next available conversation
        const remainingConversations = conversations.filter(c => c.id !== conversationId);
        if (remainingConversations.length > 0) {
          await selectConversation(remainingConversations[0].id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
    }
  }, [currentConversation, conversations, selectConversation]);

  const searchMessages = useCallback(async (query: string): Promise<MessageSearchResult[]> => {
    try {
      setError(null);
      return await chatService.searchMessages(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search messages');
      return [];
    }
  }, []);

  const updatePreferences = useCallback(async (newPreferences: Partial<ChatPreferences>) => {
    try {
      setError(null);
      const updated = await chatService.updateUserPreferences(newPreferences);
      setPreferences(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, []);

  return {
    // State
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    preferences,
    
    // Actions
    createConversation,
    selectConversation,
    sendMessage,
    updateConversation,
    deleteConversation,
    searchMessages,
    updatePreferences,
    
    // Utilities
    clearError,
    refreshConversations,
  };
}
