import { NextRequest, NextResponse } from 'next/server';
import { processWithAI } from '@/lib/ai-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, userId } = body;
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    const response = await processWithAI({
      text,
      action: 'grammar',
      userId
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in grammar check API:', error);
    return NextResponse.json(
      { error: 'Failed to process grammar check request' },
      { status: 500 }
    );
  }
}
