-- Chat Conversations Table: Stores chat sessions/conversations
CREATE TABLE chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    model_name TEXT CHECK(model_name IN ('gpt-4', 'gpt-3.5-turbo', 'gemini-pro', 'claude')) NOT NULL,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages Table: Stores individual messages within conversations
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK(role IN ('user', 'assistant', 'system')) NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT CHECK(content_type IN ('text', 'markdown', 'code', 'image')) DEFAULT 'text',
    metadata JSONB DEFAULT '{}', -- Store additional info like tokens, model used, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Message Attachments Table: For file uploads, images, etc.
CREATE TABLE chat_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER, -- in bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Chat Preferences Table: Store user preferences for chat
CREATE TABLE chat_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    default_model TEXT CHECK(default_model IN ('gpt-4', 'gpt-3.5-turbo', 'gemini-pro', 'claude')) DEFAULT 'gpt-3.5-turbo',
    max_context_length INTEGER DEFAULT 4000,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    auto_save BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Usage Analytics Table: Track usage for billing/limits
CREATE TABLE chat_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE NOT NULL,
    tokens_used INTEGER NOT NULL,
    model_name TEXT NOT NULL,
    cost DECIMAL(10,6), -- Cost in USD
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_updated_at ON chat_conversations(updated_at DESC);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_preferences_user_id ON chat_preferences(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view their own conversations" ON chat_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON chat_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON chat_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON chat_conversations
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their conversations" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = chat_messages.conversation_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in their conversations" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = chat_messages.conversation_id 
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for chat_preferences
CREATE POLICY "Users can view their own preferences" ON chat_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON chat_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON chat_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to update conversation updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_conversations 
    SET updated_at = NOW() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update conversation timestamp when messages are added
CREATE TRIGGER update_conversation_timestamp_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();
