import { NextRequest, NextResponse } from 'next/server';
import { processWithAI } from '@/lib/ai-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, action, percentage = 50, userId } = body;
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    if (!['shorten', 'expand'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be either "shorten" or "expand"' },
        { status: 400 }
      );
    }
    
    // Validate percentage is between 10-90%
    const validPercentage = Math.min(Math.max(parseInt(percentage.toString()) || 50, 10), 90);
    
    const response = await processWithAI({
      text,
      action: action as 'shorten' | 'expand',
      percentage: validPercentage,
      userId
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in adjust length API:', error);
    return NextResponse.json(
      { error: 'Failed to process length adjustment request' },
      { status: 500 }
    );
  }
}
