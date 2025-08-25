"use client"

import * as React from "react"
import {
  Upload,
  FileText,
  BookOpen,
  Link,
  Mic,
  Search,
  ArrowRight,
  ClipboardList,
  Sparkles,
  ArrowUp,
  MessageSquare,
  FilePlus2,
  LayoutGrid,
  List,
  History,
  FolderPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FadeContent } from "@/components/react-bits/fade-content"
import { Bounce } from "@/components/react-bits/bounce"
import { useRouter } from "next/navigation"

import { DocumentProvider } from "@/components/reading/document-context"
import { ClickSpark } from "@/components/react-bits/click-spark"
import { SlideIn } from "@/components/react-bits/slide-in"
import { StarBorder } from "@/components/react-bits/star-border"

interface ReadingResult {
  summary: string;
  notes: string[];
  quiz: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

interface ReadingItem {
  id: string;
  title: string;
  type: string;
  date: string;
  thumbnail?: string;
}

const ReadingPage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState("summary")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [result, setResult] = React.useState<ReadingResult | null>(null)
  const [showHistory, setShowHistory] = React.useState(false)
  
  // Sample reading history data
  const recentReadings: ReadingItem[] = [
    {
      id: "1",
      title: "Electronic Structure and Bonding",
      type: "PDF",
      date: "2 days ago",
      thumbnail: "/images/landing/features/features-ai-chat.png"
    },
    {
      id: "2",
      title: "6.006 Introduction to Algorithms",
      type: "PDF",
      date: "1 week ago",
      thumbnail: "/images/landing/features/features-smart-summaries.png"
    },
    {
      id: "3",
      title: "1. Introduction to the Human Mind",
      type: "PDF",
      date: "2 weeks ago",
      thumbnail: "/images/landing/features/features-interactive-quizzes.png"
    },
    {
      id: "4",
      title: "1. Introduction to Human Psychology",
      type: "PDF",
      date: "3 weeks ago",
      thumbnail: "/images/landing/study-flow/study-flow-quiz-demo.png"
    },
    {
      id: "5",
      title: "Lecture 1: Introduction to Biology",
      type: "PDF",
      date: "1 month ago",
      thumbnail: "/images/landing/study-flow/study-flow-quiz-demo.png"
    }
  ]

  const handleProcess = () => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setResult({
        summary: "This is a smart summary of your document. It highlights the key points and main arguments, providing a concise overview of the content.",
        notes: [
          "Key formula: E=mc²",
          "Important date: 1492",
          "Main definition: Photosynthesis is the process used by plants to convert light energy into chemical energy.",
        ],
        quiz: [
          {
            question: "What is the key formula mentioned?",
            options: ["E=mc²", "A²+B²=C²", "F=ma"],
            answer: "E=mc²",
          },
          {
            question: "What is the main definition provided?",
            options: ["Photosynthesis", "Metabolism", "Respiration"],
            answer: "Photosynthesis",
          },
        ],
      })
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <DocumentProvider>
      <div className="min-h-screen bg-gray-50">
      
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Reading
              </h1>
            </div>
            

          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar - Desktop Only */}
          <aside className="hidden xl:block w-72 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-4">

              {/* History Section */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <History className="h-4 w-4 mr-2 text-gray-600" />
                  History
                </h2>
                <h3 className="text-xs font-medium text-gray-600 mb-3">Recents</h3>
                <div className="space-y-2">
                  {recentReadings.slice(0, 5).map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-lg hover:bg-gray-50 text-sm cursor-pointer transition-colors text-gray-700 bg-white shadow-sm border border-gray-100"
                    >
                      {item.title}
                    </div>
                  ))}
                  <button className="w-full p-3 rounded-lg hover:bg-gray-50 text-sm text-blue-600 font-medium transition-colors text-left">
                    Show more
                  </button>
                </div>
              </div>

              {/* Spaces Section */}
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Spaces</h2>
                <Button 
                  variant="outline" 
                  className="w-full mb-3 text-gray-700 border-gray-200 hover:bg-gray-50"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Add space
                </Button>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg hover:bg-gray-50 text-sm cursor-pointer transition-colors text-gray-700 bg-white shadow-sm border border-gray-100">
                    Introduction to Biology
                  </div>
                  <div className="p-3 rounded-lg hover:bg-gray-50 text-sm cursor-pointer transition-colors text-gray-700 bg-white shadow-sm border border-gray-100">
                    COMPSCI 224
                  </div>
                  <div className="p-3 rounded-lg hover:bg-gray-50 text-sm cursor-pointer transition-colors text-gray-700 bg-white shadow-sm border border-gray-100">
                    Stanford Behavioral Economics
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile History Drawer */}
          {showHistory && (
            <div className="xl:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowHistory(false)}>
              <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">History</h2>
                    <button 
                      onClick={() => setShowHistory(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <ArrowRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Recents</h3>
                  <div className="space-y-2">
                    {recentReadings.slice(0, 5).map((item) => (
                      <div 
                        key={item.id}
                        className="p-3 rounded-lg hover:bg-gray-50 text-sm cursor-pointer transition-colors text-gray-700 bg-white shadow-sm border border-gray-100"
                      >
                        {item.title}
                      </div>
                    ))}
                    <button className="w-full p-3 rounded-lg hover:bg-gray-50 text-sm text-blue-600 font-medium transition-colors text-left">
                      Show more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            {/* Empty State */}
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What do you want to learn?
                </h2>
                <p className="text-gray-600 mb-8">
                  Upload documents, paste links, or record content to start learning with AI assistance.
                </p>

                {/* Content Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <Card 
                    className="hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 bg-white" 
                    onClick={() => router.push("/reading/document-viewer?title=Uploaded+Document&url=/sample-document.pdf")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Upload</h3>
                      <p className="text-gray-500 text-sm text-center">File, audio, video</p>
                    </CardContent>
                  </Card>
                  <Card 
                    className="hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 bg-white"
                    onClick={() => router.push("/reading/document-viewer?title=Web+Content&url=/sample-website.pdf")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <Link className="h-6 w-6 text-gray-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Paste</h3>
                      <p className="text-gray-500 text-sm text-center">YouTube, website, text</p>
                    </CardContent>
                  </Card>
                  <Card 
                    className="hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 bg-white"
                    onClick={() => router.push("/reading/document-viewer?title=Recorded+Content&url=/sample-recording.pdf")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <Mic className="h-6 w-6 text-gray-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Record</h3>
                      <p className="text-gray-500 text-sm text-center">Record class, video call</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Search Input */}
                <div className="relative max-w-md mx-auto">
                  <Input 
                    placeholder="Learn anything" 
                    className="py-4 px-6 text-base rounded-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-300"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-200">
                    <ArrowUp className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>


      </div>
    </DocumentProvider>
  )
}

export default ReadingPage
