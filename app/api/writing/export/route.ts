import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { exportDocument } from '@/lib/document-exporter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, format, userId, title } = body;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    if (!['pdf', 'docx', 'txt'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be pdf, docx, or txt' },
        { status: 400 }
      );
    }
    
    // Generate the document blob
    const { blob, filename } = await exportDocument(
      content, 
      format as 'pdf' | 'docx' | 'txt',
      {
        title: title || 'Untitled Document',
        creator: 'Learningly AI Writing Assistant'
      }
    );
    
    // Generate a unique export ID
    const exportId = uuidv4();
    
    // In production, this would:
    // 1. Store the blob in a storage service (S3, Azure Blob Storage, etc.)
    // 2. Log the export in the download_history table
    // 3. Create an entry in export_queue if needed for larger docs
    
    // For now, just return the response with a mock download URL
    const response = {
      id: exportId,
      downloadUrl: `/api/writing/download/${exportId}/${filename}`,
      format,
      filename,
      status: 'completed',
      message: `Your ${format.toUpperCase()} has been successfully generated.`
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error exporting document:', error);
    return NextResponse.json(
      { error: 'Failed to export document' },
      { status: 500 }
    );
  }
}
