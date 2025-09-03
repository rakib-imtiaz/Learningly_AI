"use client"

import * as React from "react"
import { 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  BookOpen,
  Menu,
  Focus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { PDFDocument } from "./pdf-viewer-wrapper"
import { RightDrawer } from "./right-drawer"
import { useDocument } from "./document-context"
import { HighlightQuestionModal } from "./highlight-question-modal"
import { PageHighlightOverlay } from "./page-highlight-overlay"
import { useHighlightQuestion } from "@/hooks/use-highlight-question"
import { useHighlights, useHighlightActions } from "@/components/reading/highlight-context"

interface DocumentViewerProps {
  documentUrl?: string
  documentTitle?: string
}

export function DocumentViewer({ documentUrl = "/sample-document.pdf", documentTitle = "Document" }: DocumentViewerProps) {
  const { document, setDocument } = useDocument()
  const [pdfError, setPdfError] = React.useState(false)
  const [pdfLoading, setPdfLoading] = React.useState(true)
  const [zoomLevel, setZoomLevel] = React.useState(100)
  const [isFocusMode, setIsFocusMode] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageDimensions, setPageDimensions] = React.useState({ width: 0, height: 0 })
  
  // Highlight context
  const { highlights } = useHighlights()
  const { removeHighlight } = useHighlightActions()
  
  // Highlight question functionality
  const {
    isModalOpen,
    selectedHighlight,
    openQuestionModal,
    closeQuestionModal,
    submitQuestion
  } = useHighlightQuestion()

  // Set document title in context when props are provided
  const hasProcessedRef = React.useRef(false)
  
  React.useEffect(() => {
    // Reset the processed flag when documentUrl changes
    hasProcessedRef.current = false
    
    if (!document && documentUrl && documentTitle && !hasProcessedRef.current) {
      hasProcessedRef.current = true
      
      // Create a basic document structure for the UI
      const basicDocument = {
        id: 'doc-' + Date.now(),
        title: documentTitle,
        text: '', // Will be populated by PDF processing
        metadata: {
          originalFileName: documentTitle,
          fileSize: 0,
          fileType: 'pdf',
          mimeType: 'application/pdf',
          pages: 0,
          textLength: 0,
          uploadedAt: new Date().toISOString(),
        }
      }
      setDocument(basicDocument)
      
      // Process the PDF to extract text
      processPDFText(documentUrl, documentTitle)
    }
  }, [documentUrl, documentTitle, document, setDocument])

  // Cleanup effect to reset processed flag on unmount
  React.useEffect(() => {
    return () => {
      hasProcessedRef.current = false
    }
  }, [])

  // Function to process PDF and extract text
  const processPDFText = React.useCallback(async (url: string, title: string) => {
    try {
      console.log('🔄 Processing PDF text extraction for:', url)
      
      // Create a FormData with the PDF URL
      const formData = new FormData()
      formData.append('fileUrl', url)
      formData.append('title', title)
      
      const response = await fetch('/api/reading/process-pdf', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ PDF text extracted:', data.textLength, 'characters')
        
        // Update the document with extracted text
        if (document) {
          const updatedDocument = {
            ...document,
            text: data.text,
            metadata: {
              ...document.metadata,
              pages: data.metadata.pages,
              textLength: data.metadata.textLength,
              processingNotes: data.metadata.processingNotes
            }
          }
          setDocument(updatedDocument)
        } else {
          // If document is null, create a new one
          const newDocument = {
            id: 'doc-' + Date.now(),
            title: title,
            text: data.text,
            metadata: {
              originalFileName: title,
              fileSize: 0,
              fileType: 'pdf',
              mimeType: 'application/pdf',
              pages: data.metadata.pages,
              textLength: data.metadata.textLength,
              uploadedAt: new Date().toISOString(),
              processingNotes: data.metadata.processingNotes
            }
          }
          setDocument(newDocument)
        }
      } else {
        console.error('❌ Failed to process PDF:', response.statusText)
      }
    } catch (error) {
      console.error('❌ Error processing PDF:', error)
    }
  }, [document, setDocument])

  const handleDocumentLoadSuccess = () => {
    setPdfLoading(false)
    setPdfError(false)
    console.log(`✅ PDF loaded successfully using native browser viewer`)
    
    // Set initial page dimensions (approximate for native viewer)
    // These will be updated when we can measure the actual PDF content
    setPageDimensions({ width: 612, height: 792 }) // Standard US Letter size in points
  }

  const handleDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error)
    setPdfError(true)
    setPdfLoading(false)
    toast({
      title: "Error loading document",
      description: "There was a problem loading your document. Please try again.",
      variant: "destructive"
    })
  }



  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsFocusMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle question request from highlight overlay
  const handleQuestionRequest = (highlight: any) => {
    openQuestionModal(highlight);
  };
  
  // Get highlights for current page
  const currentPageHighlights = highlights.filter(h => h.pageNumber === currentPage);
  
     return (
     <div className="grid min-h-screen grid-cols-[1fr_360px] xl:grid-cols-[1fr_360px]">
      {/* Main Content */}
      <main className="relative flex flex-col h-screen">
                          {/* Header */}
         <div className="flex items-center justify-between gap-2 border-b px-4 py-3 bg-white shadow-sm">
           <div className="flex items-center gap-3">
             <button className="xl:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
               <Menu className="h-4 w-4 text-gray-600" />
             </button>
             {document?.title && (
               <div className="text-xs text-gray-700 font-medium px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-1.5">
                 <span className="text-blue-600">📄</span>
                 <span className="truncate max-w-[200px]">{document.title}</span>
               </div>
             )}
           </div>
           
           <div className="flex items-center gap-3">
             {/* Zoom Controls */}
             <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
               <button
                 onClick={() => setZoomLevel(prev => Math.max(25, prev - 25))}
                 className="p-1 rounded hover:bg-gray-200 transition-colors"
                 title="Zoom Out"
               >
                 <ChevronDown className="h-3 w-3 text-gray-600" />
               </button>
               <span className="text-xs font-medium text-gray-700 min-w-[40px] text-center">
                 {zoomLevel}%
               </span>
               <button
                 onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}
                 className="p-1 rounded hover:bg-gray-200 transition-colors"
                 title="Zoom In"
               >
                 <ChevronUp className="h-3 w-3 text-gray-600" />
               </button>
             </div>
             
             <Button 
               variant="ghost" 
               size="sm"
               onClick={() => setIsFocusMode(prev => !prev)}
               className="text-gray-600 hover:text-gray-900 p-1.5"
               title="Focus Mode (Ctrl+F)"
             >
               <Focus className="h-3 w-3" />
             </Button>
             

           </div>
         </div>

                                  {/* PDF Area */}
         <section className="flex-1 overflow-hidden bg-gray-50">
           <div className="h-full w-full">
               <div className="h-full w-full bg-white overflow-hidden">
                 {documentUrl ? (
                   <div className="w-full h-full overflow-hidden">
                    {pdfLoading && (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-500">Loading document...</p>
                        </div>
                      </div>
                    )}
                    
                    {pdfError && (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-center text-red-500">
                          <AlertCircle className="h-10 w-10 mx-auto mb-4" />
                          <p>Failed to load document. Please try again.</p>
                        </div>
                      </div>
                    )}
                    
                    {!pdfError && (
                      <div className="w-full h-full overflow-auto">
                        <div 
                          className="w-full h-full relative"
                          style={{ 
                            transform: `scale(${zoomLevel / 100})`,
                            transformOrigin: 'top left',
                            minHeight: `${100 / (zoomLevel / 100)}%`,
                            width: `${100 / (zoomLevel / 100)}%`
                          }}
                        >
                          <PDFDocument
                            file={documentUrl}
                            onLoadSuccess={handleDocumentLoadSuccess}
                            onLoadError={handleDocumentLoadError}
                            loading={
                              <div className="w-full h-full flex items-center justify-center bg-white">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                  <p className="text-gray-500">Loading PDF document...</p>
                                  <p className="text-sm text-gray-400 mt-2">This should only take a moment</p>
                                </div>
                              </div>
                            }
                            error={
                              <div className="w-full h-full flex items-center justify-center bg-white">
                                <div className="text-center text-red-500">
                                  <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                                  <p className="font-medium">Failed to load PDF document</p>
                                  <p className="text-sm text-gray-500 mt-1">Please check the file path and try again</p>
                                </div>
                              </div>
                            }
                          />
                          
                          {/* Page Highlight Overlay */}
                          <PageHighlightOverlay
                            pageNumber={currentPage}
                            pageWidth={pageDimensions.width}
                            pageHeight={pageDimensions.height}
                            highlights={currentPageHighlights}
                            onRemoveHighlight={removeHighlight}
                            onQuestionRequest={handleQuestionRequest}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                                 ) : (
                   <div className="h-full w-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No document loaded</p>
                      <p className="text-sm text-gray-400">Upload a document to get started</p>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </section>

        
      </main>

             {/* Right Drawer - Desktop */}
       <aside className="hidden xl:flex flex-col border-l bg-white w-[360px]">
         <RightDrawer 
           isOpen={true}
           onClose={() => {}}
           document={document}
           className="h-full"
         />
       </aside>

      {/* Highlight Question Modal */}
      <HighlightQuestionModal
        isOpen={isModalOpen}
        onClose={closeQuestionModal}
        highlightedText={selectedHighlight?.selectedText || ''}
        onSubmitQuestion={submitQuestion}
        highlightId={selectedHighlight?.id || ''}
      />
             
    </div>
  )
}
