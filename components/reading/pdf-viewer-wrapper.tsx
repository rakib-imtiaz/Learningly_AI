"use client"

import * as React from "react"
import { AlertCircle, RotateCcw } from "lucide-react"

// Native Browser PDF Viewer - Simple and Reliable!
export const PDFDocument: React.FC<{
  file: string;
  onLoadSuccess?: (data: { numPages: number }) => void;
  onLoadError?: (error: Error) => void;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ file, onLoadSuccess, onLoadError, loading, error }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)
  const [retryKey, setRetryKey] = React.useState(0)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  // Check file accessibility and handle loading
  React.useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    
    // Quick check if the file is accessible
    const checkFile = async () => {
      try {
        const response = await fetch(file, { method: 'HEAD' })
        if (response.ok) {
          // File exists, show it immediately 
          setTimeout(() => {
            setIsLoading(false)
            onLoadSuccess?.({ numPages: 1 })
          }, 300) // Very short delay just for smooth UX
        } else {
          setIsLoading(false)
          setHasError(true)
          onLoadError?.(new Error(`File not accessible: ${response.status}`))
        }
      } catch (error) {
        setIsLoading(false)
        setHasError(true)
        onLoadError?.(new Error('File not accessible'))
      }
    }
    
    checkFile()
  }, [file, retryKey, onLoadError]) // Added onLoadError back to dependencies

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    setRetryKey(prev => prev + 1)
  }

  const defaultLoading = (
    <div className="flex items-center justify-center p-8 h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading PDF document...</p>
        <p className="text-sm text-gray-500 mt-1">Please wait while the document loads</p>
      </div>
    </div>
  )

  const defaultError = (
    <div className="flex items-center justify-center p-8 h-96">
      <div className="text-center text-red-600">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-2" />
        <p className="font-medium">Failed to load PDF</p>
        <p className="text-sm text-gray-500 mt-1">The document might be corrupted or unavailable</p>
        <button 
          onClick={handleRetry}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )

  if (hasError) {
    return error || defaultError
  }

  if (isLoading) {
    return defaultLoading
  }

  return (
    <div className="w-full h-full bg-white">
      {/* Try object tag first, fallback to iframe */}
      <object
        key={retryKey}
        data={file}
        type="application/pdf"
        className="w-full h-full"
        style={{ 
          height: '100%',
          width: '100%'
        }}
      >
        {/* Fallback iframe if object fails */}
        <iframe
          ref={iframeRef}
          src={file}
          className="w-full h-full border-0"
          title="PDF Document"
          style={{ 
            height: '100%',
            width: '100%'
          }}
          onLoad={() => console.log('✅ iframe loaded successfully')}
        />
      </object>
    </div>
  )
}

// Simplified PDF Page component (not needed for native viewer, but keeping for compatibility)
export const PDFPage: React.FC<{
  pageNumber?: number;
  scale?: number;
  renderTextLayer?: boolean;
  renderAnnotationLayer?: boolean;
  loading?: React.ReactNode;
}> = ({ loading }) => {
  // Native viewer handles all pages automatically
  return (
    <div className="w-full h-full">
      {/* Native browser PDF viewer shows all pages automatically */}
      <p className="text-center text-gray-500 p-4">
        PDF is displayed using the native browser viewer
      </p>
    </div>
  )
}