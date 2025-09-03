"use client"

import * as React from "react"
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, Search, FileText, MessageSquare, Plus, Trash2, Mic, Menu, Square, ChevronRight, Zap, Brain, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

import { useAuthContext } from "@/components/auth/auth-provider"
import { Markdown } from "@/components/ui/markdown"
import { toast } from "sonner"
import { useChat } from "@/hooks/use-chat"
import { ChatConversation, ChatMessage } from "@/types/chat"

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: string[]
  isTyping?: boolean
}

interface Conversation {
  id: string
  title: string
  model_used: 'gemini-2.5-flash' | 'gpt-5-mini'
  created_at: string
  updated_at: string
}

function QuickTip({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
      {icon}
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-slate-600">{desc}</div>
      </div>
    </div>
  );
}

const SearchPage = () => {
  const { user, loading } = useAuthContext()
  
  // Use the Supabase chat hook for conversation management
  const {
    conversations: supabaseConversations,
    currentConversation,
    messages: supabaseMessages,
    isLoading: supabaseLoading,
    error: chatError,
    createConversation,
    selectConversation,
    sendMessage: supabaseSendMessage,
    updateConversation,
    deleteConversation,
    clearError
  } = useChat()

  // Local state for UI
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI research assistant. I can help you search through your uploaded documents and answer questions about them. What would you like to know?',
      timestamp: new Date(),
    }
  ])
  const [currentMessage, setCurrentMessage] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [selectedModel, setSelectedModel] = React.useState<'gemini-2.5-flash' | 'gpt-5-mini' | 'gpt-5' | 'gpt-5-nano' | 'gemini-2.5-pro' | 'gemini-2.5-flash-lite' | 'gpt-5-thinking-pro'>('gemini-2.5-flash')
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [conversationSidebarCollapsed, setConversationSidebarCollapsed] = React.useState(false)
  const [showModelMenu, setShowModelMenu] = React.useState(false)
  const [abortController, setAbortController] = React.useState<AbortController | null>(null)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load conversations on mount and when Supabase conversations change
  React.useEffect(() => {
    if (user?.id && !loading) {
      loadConversations()
    }
  }, [user?.id, supabaseConversations, loading])

  // Handle chat errors
  React.useEffect(() => {
    if (chatError) {
      toast.error(chatError)
      clearError()
    }
  }, [chatError, clearError])

  // Only setup Supabase chat when user is authenticated and not loading
  React.useEffect(() => {
    if (user?.id && !loading && supabaseConversations.length > 0) {
      console.log('💬 [SEARCH PAGE] User authenticated, Supabase conversations loaded:', supabaseConversations.length)
    }
  }, [user?.id, loading, supabaseConversations])

  // Debug: Monitor state changes
  React.useEffect(() => {
    console.log('💬 [SEARCH PAGE] State changed:', {
      conversationsCount: conversations.length,
      messagesCount: messages.length,
      selectedConversationId,
      isTyping,
      isLoading,
      selectedModel,
      currentMessageLength: currentMessage.length,
      supabaseConversationsCount: supabaseConversations.length,
      supabaseMessagesCount: supabaseMessages.length
    })
  }, [conversations, messages, selectedConversationId, isTyping, isLoading, selectedModel, currentMessage, supabaseConversations, supabaseMessages])

  const loadConversations = async () => {
    if (!user?.id || loading) {
      console.log('💬 [SEARCH PAGE] loadConversations: No user ID or still loading:', { userId: user?.id, loading })
      return
    }

    console.log('💬 [SEARCH PAGE] loadConversations: Starting for user:', user.id)
    
    try {
      // Convert Supabase conversations to local format for compatibility
      const localConversations: Conversation[] = supabaseConversations.map(conv => ({
        id: conv.id,
        title: conv.title,
        model_used: conv.model_name as any, // Map model names
        created_at: conv.created_at,
        updated_at: conv.updated_at
      }))
      
      console.log('💬 [SEARCH PAGE] loadConversations: Converting Supabase conversations:', {
        supabaseCount: supabaseConversations.length,
        localCount: localConversations.length
      })
      
      setConversations(localConversations)
      console.log('💬 [SEARCH PAGE] loadConversations: Conversations updated in state')
    } catch (error: any) {
      // Improved error handling with fallbacks
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred'
      const errorStack = error?.stack || 'No stack trace available'
      
      console.error('💬 [SEARCH PAGE] loadConversations: Error:', {
        error: errorMessage,
        stack: errorStack,
        errorType: error?.constructor?.name || 'Unknown',
        errorKeys: error ? Object.keys(error) : []
      })
    }
  }

  const loadConversationMessages = async (conversationId: string) => {
    if (!user?.id || loading) {
      console.log('💬 [SEARCH PAGE] loadConversationMessages: No user ID or still loading:', { userId: user?.id, loading })
      return
    }

    console.log('💬 [SEARCH PAGE] loadConversationMessages: Starting for conversation:', conversationId)
    
    try {
      console.log('💬 [SEARCH PAGE] loadConversationMessages: Setting loading state...')
      setIsLoading(true)

      // Convert Supabase messages to local format for compatibility
      const formattedMessages: Message[] = supabaseMessages.map((msg: ChatMessage) => ({
        id: msg.id,
        type: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at),
        sources: msg.metadata?.sources || []
      }))

      console.log('💬 [SEARCH PAGE] loadConversationMessages: Converting Supabase messages:', {
        supabaseCount: supabaseMessages.length,
        localCount: formattedMessages.length
      })

      if (formattedMessages.length > 0) {
        setMessages(formattedMessages)
        console.log('💬 [SEARCH PAGE] loadConversationMessages: Messages loaded successfully')
      } else {
        // If no messages found, show welcome message
        console.log('💬 [SEARCH PAGE] loadConversationMessages: No messages found, showing welcome message')
        const welcomeMessage: Message = {
          id: '1',
          type: 'assistant' as const,
          content: 'Hello! I\'m your AI research assistant. I can help you search through your uploaded documents and answer questions about them. What would you like to know?',
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      }
    } catch (error: any) {
      // Improved error handling with fallbacks
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred'
      const errorStack = error?.stack || 'No stack trace available'
      
      console.error('💬 [SEARCH PAGE] loadConversationMessages: Error:', {
        error: errorMessage,
        stack: errorStack,
        errorType: error?.constructor?.name || 'Unknown',
        errorKeys: error ? Object.keys(error) : []
      })
      
      // Show welcome message on error
      const welcomeMessage: Message = {
        id: '1',
        type: 'assistant' as const,
        content: 'Hello! I\'m your AI research assistant. I can help you search through your uploaded documents and answer questions about them. What would you like to know?',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    } finally {
      console.log('💬 [SEARCH PAGE] loadConversationMessages: Clearing loading state')
      setIsLoading(false)
    }
  }

  const sendMessage = async (message: string) => {
    if (!user?.id || loading || !message.trim() || isTyping) {
      console.log('💬 [SEARCH PAGE] Send message blocked:', {
        hasUser: !!user?.id,
        loading,
        hasMessage: !!message.trim(),
        isTyping
      })
      return
    }

    console.log('💬 [SEARCH PAGE] Sending message:', {
      message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      model: selectedModel,
      conversationId: selectedConversationId
    })

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    // Add typing indicator message
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])
    setIsTyping(true)

    // Create abort controller for this request
    const controller = new AbortController()
    setAbortController(controller)

    console.log('💬 [SEARCH PAGE] Added user message and typing indicator')

    try {
      // First, save to Supabase if we have a conversation
      if (selectedConversationId) {
        console.log('💬 [SEARCH PAGE] Saving user message to Supabase conversation:', selectedConversationId)
        try {
          await supabaseSendMessage(message.trim())
          console.log('💬 [SEARCH PAGE] User message saved to Supabase successfully')
        } catch (supabaseError: any) {
          console.warn('💬 [SEARCH PAGE] Failed to save user message to Supabase:', {
            error: supabaseError?.message || 'Unknown Supabase error',
            conversationId: selectedConversationId
          })
          // Continue with the flow even if Supabase fails
        }
      } else {
        // Create new conversation in Supabase
        console.log('💬 [SEARCH PAGE] Creating new Supabase conversation')
        try {
          const newConversation = await createConversation({
            title: message.trim().substring(0, 50) + (message.length > 50 ? '...' : ''),
            model_name: mapModelToDatabaseModel(selectedModel)
          })
          setSelectedConversationId(newConversation.id)
          console.log('💬 [SEARCH PAGE] New Supabase conversation created:', newConversation.id)
        } catch (supabaseError: any) {
          console.warn('💬 [SEARCH PAGE] Failed to create Supabase conversation:', {
            error: supabaseError?.message || 'Unknown Supabase error'
          })
          // Continue with the flow even if Supabase fails
        }
      }

      console.log('💬 [SEARCH PAGE] Making API request with model:', selectedModel)
      let response: Response
      try {
        response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message.trim(),
            conversationId: selectedConversationId,
            model: selectedModel
          }),
          signal: controller.signal
        })
      } catch (fetchError: any) {
        console.error('💬 [SEARCH PAGE] Fetch request failed:', {
          error: fetchError?.message || 'Unknown fetch error',
          errorType: fetchError?.constructor?.name || 'Unknown',
          errorKeys: fetchError ? Object.keys(fetchError) : []
        })
        throw new Error(`Network error: ${fetchError?.message || 'Failed to connect to server'}`)
      }

      let data: any
      try {
        data = await response.json()
        console.log('💬 [SEARCH PAGE] API response received:', {
          ok: response.ok,
          status: response.status,
          hasResponse: !!data?.response,
          responseLength: data?.response?.length || 0,
          conversationId: data?.conversationId,
          dataKeys: data ? Object.keys(data) : []
        })
      } catch (parseError: any) {
        console.error('💬 [SEARCH PAGE] Failed to parse API response:', {
          error: parseError?.message || 'Unknown parse error',
          responseText: await response.text().catch(() => 'Could not read response text')
        })
        throw new Error('Invalid response from server')
      }

      if (response.ok && data?.response) {
        const aiMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: data.response,
          timestamp: new Date(),
          sources: data.sources || []
        }

        // Replace the typing message with the actual response
        setMessages(prev => prev.map(msg =>
          msg.isTyping ? aiMessage : msg
        ))

        console.log('💬 [SEARCH PAGE] AI response message added to chat')

        // Save AI response to Supabase
        if (selectedConversationId) {
          console.log('💬 [SEARCH PAGE] Saving AI response to Supabase')
          // The AI response will be saved via the API route
        }
      } else if (response.ok) {
        // Response was OK but no content
        console.warn('💬 [SEARCH PAGE] API response OK but no content:', {
          data: data,
          hasResponse: !!data?.response,
          responseType: typeof data?.response
        })
        toast.error('Received empty response from AI service')
        
        // Remove the typing message
        setMessages(prev => prev.filter(msg => !msg.isTyping))
      }

      // Update conversation ID if this is a new conversation (only if we have a response)
      if (response.ok && data?.response && !selectedConversationId && data?.conversationId) {
        console.log('💬 [SEARCH PAGE] New conversation detected:', data.conversationId)
        console.log('💬 [SEARCH PAGE] Previous selectedConversationId:', selectedConversationId)
        setSelectedConversationId(data.conversationId)
        console.log('💬 [SEARCH PAGE] New selectedConversationId set to:', data.conversationId)

        // Reload conversations to get the new one
        console.log('💬 [SEARCH PAGE] Reloading conversations to show new conversation...')
        try {
          await loadConversations()
        } catch (reloadError: any) {
          console.warn('💬 [SEARCH PAGE] Failed to reload conversations:', {
            error: reloadError?.message || 'Unknown reload error'
          })
          // Continue even if reload fails
        }
      } else if (response.ok && data?.response) {
        console.log('💬 [SEARCH PAGE] Using existing conversation:', selectedConversationId)
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorMessage = data?.error || `Server error: ${response.status} ${response.statusText}`
        console.error('💬 [SEARCH PAGE] API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          data: data
        })
        toast.error(errorMessage)
        
        // Remove the typing message on error
        setMessages(prev => prev.filter(msg => !msg.isTyping))
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('💬 [SEARCH PAGE] Request aborted by user')
        // Remove typing message when aborted
        setMessages(prev => prev.filter(msg => !msg.isTyping))
        toast.info('Message cancelled')
      } else {
        // Improved error handling with fallbacks
        const errorMessage = error?.message || error?.toString() || 'Unknown error occurred'
        const errorStack = error?.stack || 'No stack trace available'
        
        console.error('💬 [SEARCH PAGE] Network error:', {
          error: errorMessage,
          stack: errorStack,
          errorType: error?.constructor?.name || 'Unknown',
          errorKeys: error ? Object.keys(error) : []
        })
        
        // Show user-friendly error message
        toast.error(`Failed to send message: ${errorMessage}`)
      }
    } finally {
      setIsTyping(false)
      setAbortController(null)
      console.log('💬 [SEARCH PAGE] Message sending process completed')
    }
  }

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsTyping(false)
      // Remove typing message
      setMessages(prev => prev.filter(msg => !msg.isTyping))
      toast.info('Generation stopped')
    }
  }

  // Close model menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showModelMenu && !(event.target as Element).closest('.model-menu')) {
        setShowModelMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showModelMenu])

  // Close model menu when pressing Escape
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showModelMenu) {
        setShowModelMenu(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showModelMenu])

  const handleSendMessage = () => {
    if (!currentMessage.trim() || isTyping || loading || !user?.id) return
    sendMessage(currentMessage.trim())
    setCurrentMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Map new model names to database-allowed model names
  const mapModelToDatabaseModel = (model: string): 'gpt-4' | 'gpt-3.5-turbo' | 'gemini-pro' | 'claude' => {
    const modelMapping: Record<string, 'gpt-4' | 'gpt-3.5-turbo' | 'gemini-pro' | 'claude'> = {
      'gemini-2.5-flash': 'gemini-pro',
      'gemini-2.5-flash-lite': 'gemini-pro',
      'gemini-2.5-pro': 'gemini-pro',
      'gpt-5-mini': 'gpt-3.5-turbo',
      'gpt-5': 'gpt-4',
      'gpt-5-nano': 'gpt-3.5-turbo',
      'gpt-5-thinking-pro': 'gpt-4'
    }
    
    return modelMapping[model] || 'gpt-3.5-turbo' // Default fallback
  }

  const handleNewConversation = () => {
    if (loading || !user?.id) {
      console.log('💬 [SEARCH PAGE] handleNewConversation blocked - loading or no user:', { loading, userId: user?.id })
      return
    }

    console.log('💬 [SEARCH PAGE] handleNewConversation called')
    console.log('💬 [SEARCH PAGE] Previous state:', {
      selectedConversationId,
      messagesCount: messages.length,
      conversationsCount: conversations.length
    })

    setSelectedConversationId(null)
    const welcomeMessage = {
      id: '1',
      type: 'assistant' as const,
      content: 'Hello! I\'m your AI research assistant. I can help you search through your uploaded documents and answer questions about them. What would you like to know?',
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])

    console.log('💬 [SEARCH PAGE] New conversation state set:', {
      selectedConversationId: null,
      messagesCount: 1,
      welcomeMessage: welcomeMessage.content.substring(0, 50) + '...'
    })
  }

  // Handle model changes
  const handleModelChange = (model: 'gemini-2.5-flash' | 'gpt-5-mini' | 'gpt-5' | 'gpt-5-nano' | 'gemini-2.5-pro' | 'gemini-2.5-flash-lite' | 'gpt-5-thinking-pro') => {
    console.log('Model changed from', selectedModel, 'to', model)
    setSelectedModel(model as any) // Type assertion for now to handle the expanded model types
    const modelNames = {
      'gemini-2.5-flash': 'Gemini 2.5 Flash',
      'gpt-5-mini': 'GPT-5 Mini',
      'gpt-5': 'GPT-5',
      'gpt-5-nano': 'GPT-5 Nano',
      'gemini-2.5-pro': 'Gemini 2.5 Pro',
      'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite',
      'gpt-5-thinking-pro': 'GPT-5 Thinking Pro'
    }
    toast.success(`Switched to ${modelNames[model] || model}`)
  }

  const handleConversationSelect = (conversationId: string | null) => {
    if (loading || !user?.id) {
      console.log('💬 [SEARCH PAGE] handleConversationSelect blocked - loading or no user:', { loading, userId: user?.id })
      return
    }

    console.log('💬 [SEARCH PAGE] handleConversationSelect called:', {
      conversationId,
      previousSelectedId: selectedConversationId,
      isNewConversation: conversationId === null
    })

    setSelectedConversationId(conversationId)

    if (conversationId) {
      console.log('💬 [SEARCH PAGE] Loading existing conversation messages:', conversationId)
      // Use Supabase selectConversation to load messages
      selectConversation(conversationId).then(() => {
        loadConversationMessages(conversationId)
      }).catch(error => {
        console.error('💬 [SEARCH PAGE] Error selecting conversation:', error)
        toast.error('Failed to load conversation')
      })
    } else {
      console.log('💬 [SEARCH PAGE] Starting new conversation')
      handleNewConversation()
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    if (loading || !user?.id) {
      console.log('💬 [SEARCH PAGE] handleDeleteConversation blocked - loading or no user:', { loading, userId: user?.id })
      return
    }

    console.log('💬 [SEARCH PAGE] handleDeleteConversation called:', conversationId)
    console.log('💬 [SEARCH PAGE] State before deletion:', {
      conversationsCount: conversations.length,
      selectedConversationId,
      isSelectedConversation: selectedConversationId === conversationId
    })

    try {
      console.log('💬 [SEARCH PAGE] Deleting conversation from Supabase...')
      await deleteConversation(conversationId)

      console.log('💬 [SEARCH PAGE] Removing conversation from local state...')
      // Remove from local state
      setConversations(prev => {
        const filtered = prev.filter(conv => conv.id !== conversationId)
        console.log('💬 [SEARCH PAGE] Conversations after filtering:', {
          count: filtered.length,
          removed: conversations.length - filtered.length
        })
        return filtered
      })

      // If this was the selected conversation, clear it
      if (selectedConversationId === conversationId) {
        console.log('💬 [SEARCH PAGE] Selected conversation was deleted, starting new conversation...')
        setSelectedConversationId(null)
        handleNewConversation()
      } else {
        console.log('💬 [SEARCH PAGE] Selected conversation was not deleted, keeping current selection')
      }

      toast.success('Conversation deleted')
    } catch (error: any) {
      console.error('💬 [SEARCH PAGE] DELETE error:', {
        error: error.message,
        stack: error.stack
      })
      toast.error('Failed to delete conversation')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 text-muted-foreground">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm">AI is thinking...</span>
    </div>
  )

  // Debug authentication status
  React.useEffect(() => {
    console.log('Search page: User authentication status:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      isLoading: loading,
      supabaseConversationsCount: supabaseConversations.length,
      supabaseMessagesCount: supabaseMessages.length
    })
  }, [user, loading, supabaseConversations, supabaseMessages])

  // Format date utility for conversation sidebar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const getModelIcon = (model: 'gemini-2.5-flash' | 'gpt-5-mini') => {
    return model.startsWith('gemini') ? Sparkles : Bot
  }

  const getModelColor = (model: 'gemini-2.5-flash' | 'gpt-5-mini') => {
    return model.startsWith('gemini') ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
  }

  return (
    <div className="h-screen w-full bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="flex h-full w-full">
        {/* Conversation Sidebar - Collapsible (Desktop) */}
        <aside className={`hidden lg:flex ${conversationSidebarCollapsed ? 'w-16' : 'w-[260px]'} flex-col border-r bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 transition-[width] duration-200 z-40`}>
          <div className="flex items-center gap-2 px-3 h-12 border-b flex-shrink-0">
            {!conversationSidebarCollapsed && (
              <div className="font-medium text-sm">Conversations</div>
            )}
            <Button
              onClick={handleNewConversation}
              variant="outline"
              size="sm"
              className={`${conversationSidebarCollapsed ? 'w-8 h-8 p-0' : 'ml-auto h-8'}`}
              disabled={isLoading || loading || !user?.id}
            >
              {conversationSidebarCollapsed ? (
                <Plus className="h-4 w-4" />
              ) : (
                <>
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </>
              )}
            </Button>
            <button
              onClick={() => setConversationSidebarCollapsed(!conversationSidebarCollapsed)}
              className="ml-auto rounded-lg p-1 hover:bg-slate-100"
              aria-label="Toggle conversation sidebar"
            >
              <ChevronRight className={`h-4 w-4 ${conversationSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto px-2 py-1">
              <div className="space-y-1">
                <AnimatePresence>
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className={`group relative flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                        selectedConversationId === conversation.id 
                          ? 'bg-slate-100' 
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => handleConversationSelect(conversation.id)}
                      >
                        {conversationSidebarCollapsed ? (
                          <div className="w-full flex justify-center">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-slate-900 truncate">
                                {conversation.title}
                              </div>
                              <div className="text-xs text-slate-500">
                                {formatDate(conversation.updated_at)}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteConversation(conversation.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 transition"
                            >
                              <Trash2 className="h-3 w-3 text-slate-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {conversations.length === 0 && !conversationSidebarCollapsed && (
                  <div className="text-center py-6 text-slate-500">
                    {loading ? (
                      <p className="text-sm">Loading conversations...</p>
                    ) : (
                      <p className="text-sm">No conversations yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Conversation Sidebar - Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar */}
            <aside className="absolute left-0 top-0 h-full w-[280px] bg-white border-r border-slate-200 shadow-xl transform transition-transform duration-200 ease-in-out">
              <div className="flex items-center gap-2 px-3 h-12 border-b flex-shrink-0">
                <div className="font-medium text-sm">Conversations</div>
                <Button
                  onClick={handleNewConversation}
                  variant="outline"
                  size="sm"
                  className="ml-auto h-8"
                  disabled={isLoading || loading || !user?.id}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-2 rounded-lg p-1 hover:bg-slate-100"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                <div className="h-full overflow-y-auto px-2 py-1">
                  <div className="space-y-1">
                    <AnimatePresence>
                      {conversations.map((conversation) => (
                        <motion.div
                          key={conversation.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className={`group relative flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                            selectedConversationId === conversation.id 
                              ? 'bg-slate-100' 
                              : 'hover:bg-slate-50'
                          }`}
                          onClick={() => {
                            handleConversationSelect(conversation.id);
                            setSidebarOpen(false); // Close sidebar after selection
                          }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-slate-900 truncate">
                                {conversation.title}
                              </div>
                              <div className="text-xs text-slate-500">
                                {formatDate(conversation.updated_at)}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConversation(conversation.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 transition"
                            >
                              <Trash2 className="h-3 w-3 text-slate-400" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {conversations.length === 0 && (
                      <div className="text-center py-6 text-slate-500">
                        {loading ? (
                          <p className="text-sm">Loading conversations...</p>
                        ) : (
                          <p className="text-sm">No conversations yet</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col pb-32">
          {/* Top bar */}
          <div className="h-12 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b flex items-center gap-3 px-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden rounded-lg p-2 hover:bg-slate-100" 
              aria-label="Toggle conversation sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-1.5 w-full max-w-sm">
              <Search className="h-4 w-4" />
              <input className="bg-transparent outline-none text-sm w-full" placeholder="Search conversations..."/>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {/* Stop button moved to chat interface */}
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 pt-3 relative" style={{ paddingBottom: '200px' }}>
            {/* Bottom fade indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">AI Co‑Pilot</h1>
              {loading && (
                <div className="text-sm text-slate-500">Loading...</div>
              )}
            </div>

            {/* Assistant welcome card - only show on initial conversation */}
            {messages.length <= 1 && (
              <div className="mt-3 bg-white/90 backdrop-blur border rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-900 text-white grid place-content-center text-sm font-bold">AI</div>
                  <div className="space-y-2">
                    <p className="text-slate-800 text-sm">Hello! I'm your AI co‑pilot. I'm here to help you learn and understand new concepts. To get started, you can:</p>
                    <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-sm">
                      <li>Ask me questions about topics you're studying.</li>
                      <li>Provide content (articles or notes) and ask me to explain parts of it.</li>
                      <li>Request a quiz or flashcards to test your knowledge.</li>
                      <li>Ask me to create diagrams or visualizations.</li>
                    </ul>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      <QuickTip icon={<Search className="h-4 w-4 mt-0.5"/>} title="Summarize the main points" desc="Paste a link, PDF, or notes"/>
                      <QuickTip icon={<FileText className="h-4 w-4 mt-0.5"/>} title="What are the key concepts?" desc="Surface definitions and examples"/>
                      <QuickTip icon={<Bot className="h-4 w-4 mt-0.5"/>} title="Explain this simply" desc="Great for first‑time learning"/>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="mt-3 space-y-4">
              <AnimatePresence>
                {messages.slice(1).map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    {message.type === 'user' ? (
                      <div className="flex justify-end">
                        <div className="bg-slate-200 text-slate-700 rounded-2xl px-4 py-2 text-sm max-w-[80%]">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {message.isTyping ? (
                            <TypingIndicator />
                          ) : (
                            <>
                              <div className="text-slate-900">
                                <Markdown>{message.content}</Markdown>
                              </div>
                              
                              {/* Clean Message Actions */}
                              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(message.content)}
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {/* Sources */}
                              {message.sources && message.sources.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-slate-100">
                                  <p className="text-xs text-slate-500 mb-2">Sources:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {message.sources.map((source, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                                        <FileText className="h-3 w-3 mr-1" />
                                        {source}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Composer (sticky bottom like ChatGPT) */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 border-t border-slate-200 shadow-lg">
            <div className="px-3 sm:px-4 py-3">
              <div className="mx-auto max-w-4xl">
                <div className="bg-white border rounded-3xl px-4 py-3 shadow-sm">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 px-1 sm:px-2 py-2">
                      <textarea
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder={loading ? "Loading..." : "Message Learningly…"}
                        rows={2}
                        className="w-full resize-none outline-none text-sm bg-transparent"
                        disabled={isTyping || loading || !user?.id}
                      />
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                        {/* Professional Model Selector */}
                        <div className="relative model-menu w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowModelMenu((s) => !s)}
                            className="h-8 px-3 text-xs border-slate-200 bg-white hover:bg-slate-50 w-full sm:min-w-[140px] justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {selectedModel.startsWith('gemini') ? (
                                <Zap className="h-3 w-3 text-purple-600" />
                              ) : (
                                <Brain className="h-3 w-3 text-blue-600" />
                              )}
                              <span className="truncate font-medium">
                                {selectedModel.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                            <ChevronRight className={`h-3 w-3 transition-transform ${showModelMenu ? 'rotate-90' : ''}`} />
                          </Button>
                          {showModelMenu && (
                            <div className="absolute left-0 sm:left-0 right-0 sm:right-auto bottom-full mb-2 w-full sm:w-64 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-[60]">
                              <div className="p-2 border-b border-slate-100">
                                <div className="text-xs font-medium text-slate-600 px-2 py-1">Select AI Model</div>
                              </div>
                              <div className="max-h-64 overflow-y-auto">
                                {/* GPT-5 Models */}
                                <div className="px-2 py-1">
                                  <div className="text-xs font-medium text-slate-500 px-2 py-1 mb-1 flex items-center gap-1">
                                    <Brain className="h-3 w-3" />
                                    GPT-5 Models
                                  </div>
                                  {[
                                    { id: 'gpt-5', name: 'GPT-5', desc: 'Most capable model' },
                                    { id: 'gpt-5-mini', name: 'GPT-5 Mini', desc: 'Fast and efficient' },
                                    { id: 'gpt-5-nano', name: 'GPT-5 Nano', desc: 'Lightweight option' },
                                    { id: 'gpt-5-thinking-pro', name: 'GPT-5 Thinking Pro', desc: 'Advanced reasoning' }
                                  ].map((model) => (
                                    <button
                                      key={model.id}
                                      onClick={() => {
                                        setSelectedModel(model.id as any);
                                        setShowModelMenu(false);
                                      }}
                                      className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors rounded-lg ${
                                        selectedModel === model.id ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="text-sm font-medium">{model.name}</div>
                                          <div className="text-xs text-slate-500">{model.desc}</div>
                                        </div>
                                        {selectedModel === model.id && (
                                          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                
                                {/* Gemini Models */}
                                <div className="px-2 py-1">
                                  <div className="text-xs font-medium text-slate-500 px-2 py-1 mb-1 flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    Gemini Models
                                  </div>
                                  {[
                                    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Most capable Gemini' },
                                    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Fast and efficient' },
                                    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', desc: 'Lightweight option' }
                                  ].map((model) => (
                                    <button
                                      key={model.id}
                                      onClick={() => {
                                        setSelectedModel(model.id as any);
                                        setShowModelMenu(false);
                                      }}
                                      className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors rounded-lg ${
                                        selectedModel === model.id ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="text-sm font-medium">{model.name}</div>
                                          <div className="text-xs text-slate-500">{model.desc}</div>
                                        </div>
                                        {selectedModel === model.id && (
                                          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-slate-200 bg-white hover:bg-slate-50 w-full sm:w-auto">
                          Add Context
                        </Button>

                        {/* Stop generation button - shows when typing */}
                        {isTyping ? (
                          <Button
                            onClick={stopGeneration}
                            variant="outline"
                            size="sm"
                            className="ml-auto h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Square className="h-3 w-3 fill-current" />
                            Stop
                          </Button>
                        ) : (
                          <>
                            <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                              <button
                                onClick={handleSendMessage}
                                disabled={!currentMessage.trim() || isTyping || loading || !user?.id}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 text-xs px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
                              >
                                <Send className="h-3.5 w-3.5"/> Send
                              </button>
                              <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 text-xs px-3 py-1.5 rounded-full border bg-white hover:bg-slate-50 transition-colors">
                                <Mic className="h-3.5 w-3.5"/> Voice
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-auto max-w-4xl flex flex-col sm:flex-row gap-2 mt-2 px-1">
                  {["Summarize this page","Generate 10 flashcards","Create a quiz"].map((t, i) => (
                    <Button 
                      key={i} 
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMessage(t)}
                      disabled={isTyping}
                      className="text-xs px-3 py-1.5 h-8 border-slate-200 bg-white hover:bg-slate-50 w-full sm:w-auto"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SearchPage
