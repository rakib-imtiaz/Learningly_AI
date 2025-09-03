"use client"

import * as React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ImprovedWritingPageProps {
  header: React.ReactNode
  draftsManager: React.ReactNode
  writingToolbar: React.ReactNode
  richTextEditor: React.ReactNode
  wordCounter: React.ReactNode
  aiSuggestionsPanel: React.ReactNode
}

export function ImprovedWritingPage({
  header,
  draftsManager,
  writingToolbar,
  richTextEditor,
  wordCounter,
  aiSuggestionsPanel,
}: ImprovedWritingPageProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center">
          {header}
          {draftsManager}
        </div>
      </div>

      <div className="flex-grow p-4 overflow-hidden">
        <ResizablePanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="h-full"
        >
          <ResizablePanel defaultSize={60} minSize={30}>
            <Card className="h-full flex flex-col shadow-sm">
              <CardHeader className="p-0">
                {writingToolbar}
              </CardHeader>
              <Separator />
              <CardContent className="p-0 flex-grow relative">
                {richTextEditor}
              </CardContent>
              <Separator />
              <div className="p-2 bg-gray-50">
                {wordCounter}
              </div>
            </Card>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full p-0 pl-4">
              {aiSuggestionsPanel}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
