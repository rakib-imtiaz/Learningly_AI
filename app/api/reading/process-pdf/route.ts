import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  console.log('📤 Process PDF API called');
  
  try {
    // Parse form data
    let formData: FormData;
    try {
      formData = await req.formData();
      console.log('✅ FormData parsed successfully');
    } catch (error) {
      console.error('❌ Failed to parse FormData:', error);
      return NextResponse.json(
        { 
          error: 'Invalid request format.',
          details: 'FormData parsing failed'
        },
        { status: 400 }
      );
    }

    // Extract file URL and title
    const fileUrl = formData.get('fileUrl') as string;
    const title = formData.get('title') as string;
    
    if (!fileUrl) {
      console.error('❌ No file URL in request');
      return NextResponse.json(
        { 
          error: 'No file URL provided',
          details: 'Please provide a valid file URL'
        },
        { status: 400 }
      );
    }

    console.log('📁 Processing file:', fileUrl);

    // Convert URL to file path
    let filePath: string;
    if (fileUrl.startsWith('/uploads/')) {
      // Handle uploaded files
      filePath = path.join(process.cwd(), 'public', fileUrl);
    } else if (fileUrl.startsWith('/')) {
      // Handle public files
      filePath = path.join(process.cwd(), 'public', fileUrl);
    } else {
      // Handle external URLs (not supported for now)
      return NextResponse.json(
        { 
          error: 'External URLs not supported',
          details: 'Please use local file paths'
        },
        { status: 400 }
      );
    }

    // Read the file
    let buffer: Buffer;
    try {
      buffer = await readFile(filePath);
      console.log('✅ File read successfully:', buffer.length, 'bytes');
    } catch (error) {
      console.error('❌ Failed to read file:', error);
      return NextResponse.json(
        { 
          error: 'File not found or not accessible',
          details: 'Could not read the specified file'
        },
        { status: 404 }
      );
    }

    // Extract text from PDF
    let extractedText = '';
    let pageCount = 1;
    let processingNotes: string[] = [];

    try {
      console.log('📄 Processing PDF...');
      
      // Dynamic import of pdf-parse to avoid compilation issues
      const { default: PDFParse } = await import('pdf-parse');
      const pdfData = await PDFParse(buffer);
      extractedText = pdfData.text || '';
      pageCount = pdfData.numpages || 1;
      
      if (extractedText.trim().length === 0) {
        extractedText = 'This PDF appears to contain mostly images or has no extractable text. You can still analyze it, but text-based features may be limited.';
        processingNotes.push('PDF contains no extractable text');
      }
      
      console.log('✅ PDF processed:', {
        pages: pageCount,
        textLength: extractedText.length
      });
      
    } catch (pdfError: any) {
      console.error('❌ PDF parsing error:', pdfError);
      extractedText = 'PDF processing encountered an issue. The file may be corrupted, password-protected, or contain only images. You can still upload it, but text extraction is limited.';
      pageCount = 1;
      processingNotes.push('PDF parsing failed - using fallback');
    }

    // Generate metadata
    const metadata = {
      title: title || 'Untitled Document',
      originalFileName: path.basename(fileUrl),
      fileSize: buffer.length,
      fileType: 'pdf',
      mimeType: 'application/pdf',
      pages: pageCount,
      textLength: extractedText.length,
      uploadedAt: new Date().toISOString(),
      processingNotes,
      fileUrl
    };

    console.log('✅ PDF processing successful:', {
      title: metadata.title,
      fileSize: metadata.fileSize,
      textLength: metadata.textLength
    });

    // Return success response
    return NextResponse.json({
      success: true,
      text: extractedText,
      metadata,
      message: 'PDF processed successfully'
    });

  } catch (error: any) {
    console.error('💥 Unexpected error in process PDF API:', error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
