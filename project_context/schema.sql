-- Users Table: Stores user profile information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('student', 'self-learner', 'educator', 'admin')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- User Content Table: Tracks the content uploaded by the user
CREATE TABLE user_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_type TEXT CHECK(content_type IN ('pdf', 'docx', 'txt', 'code')) NOT NULL,
    content_url TEXT NOT NULL,  -- Path or URL to the uploaded content
    status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'failed')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Summaries Table: Stores the generated paraphrased summaries for each file uploaded by the user
CREATE TABLE summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES user_content(id) ON DELETE CASCADE,
    summary_type TEXT CHECK(summary_type IN ('outline', 'eli6', 'key-points')) NOT NULL,
    summary_text TEXT NOT NULL,  -- The generated summary content
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Feedback Table: Allows users to provide feedback on the generated summaries
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    summary_id UUID REFERENCES summaries(id) ON DELETE CASCADE,
    rating INT CHECK(rating >= 1 AND rating <= 5),  -- Rating from 1 to 5
    comments TEXT,  -- User comments about the summary
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Download History Table: Tracks the summaries that users download and the format they choose
CREATE TABLE download_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    summary_id UUID REFERENCES summaries(id) ON DELETE CASCADE,
    download_format TEXT CHECK(download_format IN ('pdf', 'docx', 'txt')) NOT NULL,  -- Format type
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Export Queue Table: Handles requests for document export (e.g., PDF, DOCX)
CREATE TABLE export_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id UUID REFERENCES summaries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'failed')) NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Writing History Table: Keeps a record of the content and paraphrasing history for each user
CREATE TABLE writing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES user_content(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    paraphrased_text TEXT NOT NULL,
    tone_selected TEXT CHECK(tone_selected IN ('formal', 'informal', 'academic', 'casual')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tone and Style Preferences Table: Stores user preferences for tone and style adjustments
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tone TEXT CHECK(tone IN ('formal', 'informal', 'academic', 'casual')) NOT NULL,
    style TEXT CHECK(style IN ('concise', 'detailed', 'simple', 'complex')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Version Control Table: Tracks versions of the writing content (in case of edits)
CREATE TABLE version_control (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES user_content(id) ON DELETE CASCADE,
    version_number INT NOT NULL,  -- Incremental version number for the document
    version_text TEXT NOT NULL,  -- Content for that version
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Models API Calls Log: Logs interactions with AI models like Gemini or GPT for debugging or analysis
CREATE TABLE ai_model_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    model_name TEXT CHECK(model_name IN ('gemini', 'openai')) NOT NULL,
    request_payload JSONB NOT NULL,  -- Request data sent to the AI model
    response_payload JSONB NOT NULL,  -- Response data from the AI model
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Writing Drafts Table: Stores drafts of user writing projects
CREATE TABLE writing_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Draft',
    content TEXT NOT NULL,
    content_raw JSONB,  -- Raw editor state for rich text editor
    tone TEXT CHECK(tone IN ('formal', 'informal', 'academic', 'casual')) DEFAULT 'formal',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grammar Issues Table: Stores identified grammar issues from the writing assistant
CREATE TABLE grammar_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    draft_id UUID REFERENCES writing_drafts(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    issue_type TEXT CHECK(issue_type IN ('grammar', 'spelling', 'style', 'clarity')) NOT NULL,
    description TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Writing Assistant Usage Metrics: Tracks usage of writing assistant features
CREATE TABLE writing_assistant_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature_used TEXT CHECK(feature_used IN ('paraphrase', 'grammar', 'shorten', 'expand', 'tone_change', 'export')) NOT NULL,
    text_length INT,  -- Length of text being processed
    processing_time INT,  -- Time taken in milliseconds
    successful BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);