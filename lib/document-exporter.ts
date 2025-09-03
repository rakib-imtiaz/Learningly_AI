import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Interface for document metadata
interface DocumentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creator?: string;
}

// Function to strip HTML tags from content
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '');
};

// Function to export content as PDF
export const exportToPDF = async (
  htmlContent: string, 
  metadata: DocumentMetadata = {}
): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Set document metadata
  doc.setProperties({
    title: metadata.title || 'Document',
    subject: metadata.subject || '',
    author: metadata.author || '',
    keywords: metadata.keywords?.join(', ') || '',
    creator: metadata.creator || 'Learningly AI'
  });
  
  // Strip HTML tags for plain text
  const plainText = stripHtml(htmlContent);
  
  // Set text properties
  doc.setFontSize(12);
  
  // Add text to document with line wrapping
  const textLines = doc.splitTextToSize(plainText, 180);
  doc.text(textLines, 15, 20);
  
  // Return the PDF as a blob
  return doc.output('blob');
};

// Function to export content as DOCX
export const exportToDOCX = async (
  htmlContent: string, 
  metadata: DocumentMetadata = {}
): Promise<Blob> => {
  // Strip HTML tags for plain text
  const plainText = stripHtml(htmlContent);
  
  // Create document
  const doc = new Document({
    title: metadata.title || 'Document',
    subject: metadata.subject || '',
    creator: metadata.creator || 'Learningly AI',
    description: metadata.subject || '',
    keywords: metadata.keywords?.join(', ') || '',
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun(plainText)
          ]
        })
      ]
    }]
  });
  
  // Generate the document as a blob
  return await Packer.toBlob(doc);
};

// Function to export content as TXT
export const exportToTXT = async (htmlContent: string): Promise<Blob> => {
  // Strip HTML tags for plain text
  const plainText = stripHtml(htmlContent);
  
  // Create a new blob with the text content
  return new Blob([plainText], { type: 'text/plain' });
};

// Main export function that handles all formats
export const exportDocument = async (
  htmlContent: string,
  format: 'pdf' | 'docx' | 'txt',
  metadata: DocumentMetadata = {}
): Promise<{ blob: Blob, filename: string }> => {
  let blob: Blob;
  const fileExtension: string = format;
  
  switch (format) {
    case 'pdf':
      blob = await exportToPDF(htmlContent, metadata);
      break;
    case 'docx':
      blob = await exportToDOCX(htmlContent, metadata);
      break;
    case 'txt':
      blob = await exportToTXT(htmlContent);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
  
  // Generate a filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `document-${timestamp}.${fileExtension}`;
  
  return { blob, filename };
};
