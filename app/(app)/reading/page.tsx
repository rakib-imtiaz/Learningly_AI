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
  BookMarked,
  Brain,
  Zap,
  Target,
  Globe,
  Video,
  Headphones,
  Clock,
  TrendingUp,
  Users,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

import { DocumentProvider } from "@/components/reading/document-context"

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

  const quickActions = [
    {
      icon: Brain,
      title: "AI Study Guide",
      description: "Generate comprehensive study materials",
      color: "from-purple-500 to-pink-500",
      action: () => router.push("/reading/ai-study-guide")
    },
    {
      icon: Target,
      title: "Practice Quiz",
      description: "Test your knowledge with AI-generated questions",
      color: "from-blue-500 to-cyan-500",
      action: () => router.push("/reading/practice-quiz")
    },
    {
      icon: BookMarked,
      title: "Reading Notes",
      description: "Smart note-taking with AI assistance",
      color: "from-green-500 to-teal-500",
      action: () => router.push("/reading/notes")
    },
    {
      icon: Zap,
      title: "Quick Summary",
      description: "Get instant document summaries",
      color: "from-orange-500 to-red-500",
      action: () => router.push("/reading/quick-summary")
    }
  ]

  const studyStats = [
    { label: "Documents Read", value: "47", icon: FileText, change: "+12%" },
    { label: "Study Hours", value: "24.5h", icon: Clock, change: "+8%" },
    { label: "Quiz Score", value: "89%", icon: Award, change: "+5%" },
    { label: "Streak", value: "7 days", icon: TrendingUp, change: "New!" }
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
        
        {/* Clean Professional Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button 
                className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">Reading</h1>
              </div>
            </div>
            
            {/* Clean Stats Display */}
            <div className="hidden md:flex items-center gap-6">
              {studyStats.slice(0, 2).map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Clean Professional Sidebar */}
          <aside className="hidden xl:block w-80 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-6">
              
              {/* Study Progress */}
              <div className="mb-8 p-5 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Reading Goal</span>
                      <span className="font-semibold text-gray-900">3/5 documents</span>
                    </div>
                    <Progress value={60} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-blue-600">2.5h</div>
                      <div className="text-sm text-gray-500">Study Time</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-green-600">12</div>
                      <div className="text-sm text-gray-500">Notes Made</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Documents */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <History className="h-5 w-5 mr-2 text-gray-600" />
                  Recent Documents
                </h2>
                <div className="space-y-3">
                  {recentReadings.slice(0, 4).map((item) => (
                    <div key={item.id} className="group">
                      <div className="p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100 hover:border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-2 line-clamp-2">
                              {item.title}
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                          </div>
                          <FileText className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full p-4 rounded-lg border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-blue-600 font-medium transition-colors">
                    View All Documents
                  </button>
                </div>
              </div>

              {/* Study Spaces */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FolderPlus className="h-5 w-5 mr-2 text-gray-600" />
                  Study Spaces
                </h2>
                <Button 
                  variant="outline" 
                  className="w-full mb-4 h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create New Space
                </Button>
                <div className="space-y-3">
                  {[
                    { name: "Introduction to Biology", docs: 8, color: "bg-green-100 text-green-700" },
                    { name: "COMPSCI 224", docs: 15, color: "bg-purple-100 text-purple-700" },
                    { name: "Stanford Behavioral Economics", docs: 6, color: "bg-orange-100 text-orange-700" }
                  ].map((space) => (
                    <div key={space.name} className="p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100 hover:border-gray-200 group">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${space.color.split(' ')[0]}`} />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{space.name}</div>
                          <div className="text-sm text-gray-500">{space.docs} documents</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Clean Mobile History Drawer */}
          {showHistory && (
            <div className="xl:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowHistory(false)}>
              <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                      Reading Hub
                    </h2>
                    <button 
                      onClick={() => setShowHistory(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ArrowRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {studyStats.slice(0, 4).map((stat, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <stat.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Recent Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <History className="h-5 w-5 text-gray-600" />
                      Recent Documents
                    </h3>
                    <div className="space-y-3">
                      {recentReadings.slice(0, 5).map((item) => (
                        <div key={item.id} className="p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100">
                          <div className="font-medium text-gray-900 mb-1">{item.title}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{item.type}</Badge>
                            <span className="text-sm text-gray-500">{item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clean Professional Main Content */}
          <main className="flex-1 min-h-screen bg-gray-50">
            <div className="p-8 max-w-6xl mx-auto">
              
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  What would you like to learn today?
                </h2>
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Transform any content into an interactive learning experience with AI-powered insights, summaries, and personalized study materials.
                </p>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {quickActions.map((action, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-gray-200 bg-white" onClick={action.action}>
                    <CardContent className="p-0 text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Content Upload Section */}
              <div className="bg-white rounded-2xl p-8 mb-12 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Get Started</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Upload,
                      title: "Upload Files",
                      description: "PDF, DOCX, images, audio, and video files",
                      action: () => router.push("/reading/document-viewer?title=Uploaded+Document&url=/sample-document.pdf")
                    },
                    {
                      icon: Globe,
                      title: "Import from Web",
                      description: "YouTube videos, articles, and websites",
                      action: () => router.push("/reading/document-viewer?title=Web+Content&url=/sample-website.pdf")
                    },
                    {
                      icon: Headphones,
                      title: "Record Content",
                      description: "Live lectures, meetings, and conversations",
                      action: () => router.push("/reading/document-viewer?title=Recorded+Content&url=/sample-recording.pdf")
                    }
                  ].map((option, index) => (
                    <Card key={index} className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-gray-200 bg-gray-50" onClick={option.action}>
                      <CardContent className="p-0 text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                          <option.icon className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{option.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{option.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Search Section */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                  <div className="flex">
                    <Input 
                      placeholder="Ask me anything or describe what you'd like to learn..." 
                      className="flex-1 text-lg border-0 focus:ring-0 focus-visible:ring-0 placeholder:text-gray-400"
                    />
                    <Button className="ml-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </div>
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
