import { NextRequest, NextResponse } from 'next/server';
import { processWithAI } from '@/lib/ai-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, tone, userId } = body;
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    const response = await processWithAI({
      text,
      tone: tone || 'formal',
      action: 'paraphrase',
      userId
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in paraphrase API:', error);
    return NextResponse.json(
      { error: 'Failed to process paraphrasing request' },
      { status: 500 }
    );
  }
}
