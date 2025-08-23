"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { FileUploader } from "react-drag-drop-files"
import { Upload, FileText, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface FileUploaderProps {
  onClose?: () => void
}

const fileTypes = ["PDF", "DOC", "DOCX", "TXT", "PPT", "PPTX"]

export function FileUploaderComponent({ onClose }: FileUploaderProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const handleChange = (file: File) => {
    setFile(file)
  }

  const handleUpload = useCallback(() => {
    if (!file) return
    
    setLoading(true)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setLoading(false)
            
            // In a real implementation, you would upload the file to a server
            // and get back a URL. For now, we'll use our sample PDF
            
            // Show success toast
            import("sonner").then(({ toast }) => {
              toast.success("Upload complete", {
                description: `${file.name} has been successfully uploaded.`
              });
            });
            
            // Navigate to document viewer
            router.push(`/reading/document-viewer?title=${encodeURIComponent(file.name)}&url=/sample-document.pdf`)
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 100)
    
    // Cleanup function
    return () => clearInterval(interval)
  }, [file, router])
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) {
      const droppedFile = e.dataTransfer.files[0]
      const fileExtension = droppedFile.name.split('.').pop()?.toUpperCase() || ''
      
      if (fileTypes.includes(fileExtension)) {
        setFile(droppedFile)
      } else {
        import("sonner").then(({ toast }) => {
          toast.error("Unsupported file format", {
            description: `Please upload a ${fileTypes.join(", ")} file.`
          });
        })
      }
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Document</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {!file && !loading ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Drag & drop your document here or click to browse
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Supports PDF, DOC, DOCX, TXT, PPT, PPTX
            </p>
            <FileUploader
              handleChange={handleChange}
              name="file"
              types={fileTypes}
              classes="hidden"
              maxSize={50}
            >
              <Button>Browse Files</Button>
            </FileUploader>
          </div>
        ) : loading ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FileText className="h-16 w-16 text-blue-600" />
            </div>
            <p className="font-medium mb-2">Uploading {file?.name}</p>
            <div className="mb-2">
              <Progress value={progress} className="h-2" />
            </div>
            <p className="text-sm text-gray-500">{progress}% complete</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="font-medium mb-2">Ready to Upload</p>
            <p className="text-gray-600 mb-4">{file?.name}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="w-1/2" onClick={() => setFile(null)}>
                Change file
              </Button>
              <Button className="w-1/2" onClick={handleUpload}>
                Upload
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

