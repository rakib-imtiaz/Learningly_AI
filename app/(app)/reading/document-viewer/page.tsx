"use client"

import { DocumentViewer } from "@/components/reading/document-viewer"
import { useSearchParams } from "next/navigation"

export default function DocumentViewerPage() {
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

