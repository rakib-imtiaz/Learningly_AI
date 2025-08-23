"use client"

import * as React from "react"
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Upload, 
  MoreVertical,
  Search,
  MessageSquare,
  Archive,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { PDFDocument, PDFPage } from "./pdf-viewer-wrapper"

interface DocumentViewerProps {
  documentUrl?: string
  documentTitle?: string
}

export function DocumentViewer({ documentUrl = "/sample-document.pdf", documentTitle = "Document" }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [zoomLevel, setZoomLevel] = React.useState(100)
  const [activeTab, setActiveTab] = React.useState("chat")
  const [pdfError, setPdfError] = React.useState(false)
  const [pdfLoading, setPdfLoading] = React.useState(true)

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages)
    setPdfLoading(false)
    setPdfError(false)
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

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const adjustZoom = (amount: number) => {
    setZoomLevel(prev => Math.max(25, Math.min(prev + amount, 200)))
  }
  
  return (
    <div className="flex h-screen bg-white text-black">
      {/* Left Sidebar */}
      <div className="w-60 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold flex items-center">
            <span className="bg-green-500 text-white p-1 rounded mr-2">L</span>
            Learningly
          </h1>
          <p className="text-xs text-gray-500">AI Learning Platform</p>
        </div>
        
        <div className="p-2">
          <button className="w-full bg-blue-600 text-white rounded-lg p-2 mb-4 text-sm flex items-center">
            <span className="mr-2">+</span> Add content
          </button>
        </div>
        
        <div className="p-2">
          <h2 className="text-gray-700 text-sm flex items-center mb-2">
            <Archive className="h-4 w-4 mr-1" /> History
          </h2>
        </div>
        
        <div className="p-2">
          <h3 className="text-gray-700 text-sm mb-2">Recents</h3>
          <ul className="space-y-1">
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">Electronic Structure and Bonding</li>
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">6.006 Introduction to Algorithms</li>
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">1. Introduction to the Human Mind</li>
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">1. Introduction to Human Psychology</li>
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">Lecture 1: Introduction to Biology</li>
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer text-gray-500">Show more</li>
          </ul>
        </div>
        
        <div className="p-2 mt-4">
          <h2 className="text-gray-700 text-sm mb-2">Spaces</h2>
          <button className="w-full bg-gray-100 text-gray-800 rounded-lg p-2 mb-2 text-sm flex items-center">
            <span className="mr-2">+</span> Add space
          </button>
          <ul className="space-y-1">
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">Introduction to Biology</li>
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">COMPSCI 224</li>
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">Stanford Behavioral Economics</li>
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">Quantum Physics</li>
            <li className="p-2 rounded hover:bg-gray-100 text-sm cursor-pointer">MIT 6.006 Intro to Algorithms</li>
          </ul>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Document Header */}
        <div className="border-b border-gray-200 flex p-2">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">PDF</Button>
            <Button variant="ghost" size="sm">Chapters</Button>
          </div>
        </div>
        
        {/* Document Viewer */}
        <div className="flex-1 flex flex-col relative">
          {/* Document Toolbar */}
          <div className="flex items-center justify-between px-2 py-1 bg-gray-50">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600" 
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center text-gray-600 text-sm">
                <span>{currentPage}</span>
                <span className="mx-1">/</span>
                <span>{totalPages}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600"
                onClick={() => adjustZoom(-10)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-gray-600 text-sm">{zoomLevel}%</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600"
                onClick={() => adjustZoom(10)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Document Content */}
          <div className="flex-1 bg-gray-50 flex justify-center items-center overflow-auto p-4">
            {documentUrl ? (
              <div className="bg-white text-black w-full max-w-2xl shadow-lg border border-gray-200 overflow-hidden">
                {pdfLoading && (
                  <div className="h-[800px] w-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading document...</p>
                    </div>
                  </div>
                )}
                
                {pdfError && (
                  <div className="h-[800px] w-full flex items-center justify-center">
                    <div className="text-center text-red-500">
                      <AlertCircle className="h-10 w-10 mx-auto mb-4" />
                      <p>Failed to load document. Please try again.</p>
                    </div>
                  </div>
                )}
                
                {!pdfError && (
                  <div className="h-full w-full flex justify-center">
                    <PDFDocument
                      file={documentUrl}
                      onLoadSuccess={handleDocumentLoadSuccess}
                      onLoadError={handleDocumentLoadError}
                      loading={
                        <div className="h-[800px] w-full flex items-center justify-center">
                          <p className="text-center text-gray-500">Loading...</p>
                        </div>
                      }
                      error={
                        <div className="h-[800px] w-full flex items-center justify-center">
                          <p className="text-center text-red-500">Failed to load PDF.</p>
                        </div>
                      }
                    >
                      <PDFPage 
                        pageNumber={currentPage} 
                        scale={zoomLevel / 100}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        loading={
                          <div className="h-[800px] w-full flex items-center justify-center">
                            <p className="text-center text-gray-500">Loading page {currentPage}...</p>
                          </div>
                        }
                      />
                    </PDFDocument>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[800px] w-full flex items-center justify-center text-gray-500">
                No document loaded
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-72 border-l border-gray-200">
        <div className="p-2">
          <Tabs defaultValue="chat" className="w-full">
            <div className="flex justify-center">
              <TabsList className="rounded-full bg-gray-100">
                <TabsTrigger 
                  value="chat"
                  className={`px-4 py-1 rounded-full ${activeTab === 'chat' ? 'bg-blue-600 text-white' : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="flashcards" 
                  className={`px-4 py-1 rounded-full ${activeTab === 'flashcards' ? 'bg-blue-600 text-white' : ''}`}
                  onClick={() => setActiveTab('flashcards')}
                >
                  Flashcards
                </TabsTrigger>
                <TabsTrigger 
                  value="summary" 
                  className={`px-4 py-1 rounded-full ${activeTab === 'summary' ? 'bg-blue-600 text-white' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  Summary
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="mt-4">
              <div className="p-4">
                <p className="text-sm text-gray-600">
                  Welcome to the chat! Ask me anything. I may not always be right, but your
                  feedback will help me improve!
                </p>
                
                <div className="mt-8">
                  <Card className="bg-gray-100 border border-gray-200 p-3 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          Q
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">
                          Explain the Aufbau principle and how it is used to determine the electron configuration of atoms.
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-gray-100 border border-gray-200 p-3 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          Q
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">
                          What are the differences between cations and anions in terms of their electronic structures?
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="flashcards" className="mt-4">
              <div className="p-4">
                <p className="text-sm text-gray-600">Flashcards will appear here based on document content.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="summary" className="mt-4">
              <div className="p-4">
                <p className="text-sm text-gray-600">Document summary will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
