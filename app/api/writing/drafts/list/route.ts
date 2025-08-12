import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Mock implementation - in production, this would fetch from the database
    
    // Mock response with a list of drafts
    const mockDrafts = Array(Math.min(limit, 5)).fill(null).map((_, index) => ({
      id: `mock-draft-id-${index + offset}`,
      userId,
      title: `Draft ${index + offset + 1}`,
      excerpt: `This is a preview of draft ${index + offset + 1}...`,
      tone: index % 2 === 0 ? 'formal' : 'casual',
      versionNumber: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date(Date.now() - (index * 86400000)).toISOString(), // Days ago
      updatedAt: new Date(Date.now() - (index * 43200000)).toISOString(), // Half days ago
    }));
    
    return NextResponse.json({
      drafts: mockDrafts,
      total: 20, // Mock total count
      limit,
      offset
    });
  } catch (error) {
    console.error('Error listing drafts:', error);
    return NextResponse.json(
      { error: 'Failed to list drafts' },
      { status: 500 }
    );
  }
}
