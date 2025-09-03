import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const draftId = req.nextUrl.searchParams.get('draftId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Mock implementation - in production, this would fetch from the database
    // If draftId is provided, fetch that specific draft
    // If not, fetch the most recent draft for the user
    
    // Mock response
    const mockDraft = {
      id: draftId || 'mock-draft-id',
      userId,
      content: '<p>This is a sample draft content that would be loaded from the database.</p>',
      rawContent: { /* draft-js raw content structure */ },
      tone: 'formal',
      versionNumber: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(mockDraft);
  } catch (error) {
    console.error('Error loading draft:', error);
    return NextResponse.json(
      { error: 'Failed to load draft' },
      { status: 500 }
    );
  }
}
