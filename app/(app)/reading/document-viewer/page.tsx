"use client"

import { DocumentViewer } from "@/components/reading/document-viewer"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function DocumentViewerContent() {
  const searchParams = useSearchParams()
  const documentUrl = searchParams.get("url")
  const documentTitle = searchParams.get("title") || "Untitled Document"
  
  return (
    <DocumentViewer 
      documentUrl={documentUrl || undefined} 
      documentTitle={documentTitle} 
    />
  )
}

export default function DocumentViewerPage() {
  return (
    <Suspense fallback={<div>Loading document viewer...</div>}>
      <DocumentViewerContent />
    </Suspense>
  )
}

