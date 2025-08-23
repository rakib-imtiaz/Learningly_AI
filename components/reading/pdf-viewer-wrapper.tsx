"use client"

import * as React from "react"
import dynamic from "next/dynamic"

// Dynamically import the PDF components to avoid SSR issues
const ReactPDFDocument = dynamic(() => import('react-pdf').then(mod => {
  // Set worker source
  const { pdfjs } = mod
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
  return mod.Document
}), { ssr: false })

const ReactPDFPage = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false })

// This removes any props that might cause the "overRide" error
// by forwarding only the props we explicitly want
export const PDFDocument: React.FC<{
  file: string;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ file, onLoadSuccess, onLoadError, loading, error, children }) => {
  return (
    <ReactPDFDocument
      file={file}
      onLoadSuccess={onLoadSuccess}
      onLoadError={onLoadError}
      loading={loading}
      error={error}
    >
      {children}
    </ReactPDFDocument>
  )
}

export const PDFPage: React.FC<{
  pageNumber: number;
  scale: number;
  renderTextLayer?: boolean;
  renderAnnotationLayer?: boolean;
  loading?: React.ReactNode;
}> = ({ pageNumber, scale, renderTextLayer, renderAnnotationLayer, loading }) => {
  return (
    <ReactPDFPage
      pageNumber={pageNumber}
      scale={scale}
      renderTextLayer={renderTextLayer}
      renderAnnotationLayer={renderAnnotationLayer}
      loading={loading}
    />
  )
}


