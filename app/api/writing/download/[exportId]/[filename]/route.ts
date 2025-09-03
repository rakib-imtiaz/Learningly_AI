import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ exportId: string; filename: string }> }
) {
  try {
    const { exportId, filename } = await params;
    
    // In production, this would:
    // 1. Check if the exportId exists and belongs to the user
    // 2. Retrieve the file from a storage service
    // 3. Log the download in the download_history table
    
    // Get the format from the filename extension
    const format = filename.split('.').pop()?.toLowerCase();
    
    // For now, we'll return a simple text file for demonstration purposes
    let contentType = 'text/plain';
    let content = `This is a sample ${format?.toUpperCase()} file.\nIn a production environment, this would be the actual exported document.`;
    
    // Set the appropriate Content-Type based on the format
    switch (format) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid format' },
          { status: 400 }
        );
    }
    
    // Create a response with the appropriate headers
    const response = new NextResponse(content);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    
    return response;
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}
