import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// System prompt for document chat
const SYSTEM_PROMPT = `You are Learningly's study coach.

RULES OF CONDUCT
1) After receiving a document, first acknowledge it and propose 3-6 next actions as short options (chips).
2) When the user picks an action, collect missing inputs with ONE concise question at a time.
3) Keep every message ≤ 350 words. If output is longer, chunk it and offer "Generate more".
4) Always end with helpful follow-up chips (e.g., Export, Quiz, Flashcards, Explain Section).
5) If user asks a free question, answer based on the document content.
6) If a request is ambiguous, explain briefly and re-ask with 3-5 options.

FORMATTING
- Respond in Markdown. Use headings, short paragraphs, bullet/numbered lists where helpful, and fenced code blocks for any code.
- Use inline math $...$ and block math $$...$$ when relevant.
- Do not wrap the entire message in a single triple-backtick block.

STYLE
- Formal, concise, student-friendly. Bullets > long paragraphs. No emojis. No marketing fluff.

SECURITY & SAFETY
- Don't fabricate content. Only use information from the provided document.
- If information isn't in the document, say so clearly.`;

interface ChatRequest {
  message: string;
  documentText?: string;
  documentTitle?: string;
  conversationHistory?: Array<{role: 'user' | 'assistant', content: string}>;
  isFirstMessage?: boolean;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  console.log('📚 [READING CHAT] POST request started')

  try {
    const body: ChatRequest = await req.json();
    const { message, documentText, documentTitle, conversationHistory = [], isFirstMessage = false } = body;

    console.log('📚 [READING CHAT] Request details:', {
      message: message?.substring(0, 50) + (message?.length > 50 ? '...' : ''),
      documentTitle,
      hasDocument: !!documentText,
      documentLength: documentText?.length || 0,
      conversationHistoryLength: conversationHistory?.length || 0,
      isFirstMessage
    })

    if (!message) {
      console.error('📚 [READING CHAT] Missing message')
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Build conversation context
    let prompt = SYSTEM_PROMPT + '\n\n';
    
    // Add document context if provided
    console.log('📚 [READING CHAT] Building prompt context...')
    if (documentText) {
      prompt += `DOCUMENT TITLE: ${documentTitle || 'Untitled Document'}\n`;
      prompt += `DOCUMENT CONTENT:\n${documentText}\n\n`;
      console.log('📚 [READING CHAT] Added document context to prompt')
    }

    // Add conversation history
    if (conversationHistory.length > 0) {
      prompt += 'CONVERSATION HISTORY:\n';
      conversationHistory.forEach(msg => {
        prompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
      });
      prompt += '\n';
      console.log('📚 [READING CHAT] Added conversation history to prompt')
    }

    // Handle first message after document upload
    if (isFirstMessage && documentText) {
      prompt += `The user has uploaded a document titled "${documentTitle}".
      Acknowledge the document processing and present 4-6 next-step options as short labels.
      Do NOT summarize the whole document. Keep it ≤ 120 words.

      USER MESSAGE: ${message}`;
      console.log('📚 [READING CHAT] Handling first message after document upload')
    } else {
      prompt += `USER MESSAGE: ${message}`;
      console.log('📚 [READING CHAT] Handling regular message')
    }

    // Generate response with Gemini
    console.log('📚 [READING CHAT] Generating AI response...')
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const responseTime = Date.now() - startTime
    console.log('📚 [READING CHAT] Response generated successfully:', {
      responseTime: `${responseTime}ms`,
      responseLength: text.length
    })

    return NextResponse.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    console.error('📚 [READING CHAT] Error:', {
      error: error.message,
      code: error.code,
      type: error.type,
      responseTime: `${responseTime}ms`
    });
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error.message },
      { status: 500 }
    );
  }
}
