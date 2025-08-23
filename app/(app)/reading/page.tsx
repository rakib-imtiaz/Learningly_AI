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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FadeContent } from "@/components/react-bits/fade-content"
import { Bounce } from "@/components/react-bits/bounce"
import { useRouter } from "next/navigation"
import { FileUploaderComponent } from "@/components/reading/file-uploader"

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
  const [showUploader, setShowUploader] = React.useState(false)
  
  // Sample reading history data
  const recentReadings: ReadingItem[] = [
    {
      id: "1",
      title: "Generative AI Full Course",
      type: "PDF",
      date: "5 months ago",
      thumbnail: "/images/landing/features/features-ai-chat.png"
    },
    {
      id: "2",
      title: "Teaching CS50 with AI",
      type: "Article",
      date: "5 months ago",
      thumbnail: "/images/landing/features/features-smart-summaries.png"
    },
    {
      id: "3",
      title: "Neural Networks Explained",
      type: "PDF",
      date: "6 months ago",
      thumbnail: "/images/landing/features/features-interactive-quizzes.png"
    },
    {
      id: "4",
      title: "Understanding Chemistry Basics",
      type: "Article",
      date: "5 months ago",
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
    <div className="p-6 max-w-6xl mx-auto">
      {showUploader && <FileUploaderComponent onClose={() => setShowUploader(false)} />}
      <h1 className="text-4xl font-bold mb-8 text-center">What do you want to learn?</h1>

      {/* Input methods section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {/* Upload option */}
        <Card 
          className="hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setShowUploader(true)}
        >
          <CardContent className="p-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Upload</h3>
            <p className="text-gray-500 text-sm text-center">File, audio, video</p>
          </CardContent>
        </Card>

        {/* Paste option */}
        <Card 
          className="hover:shadow-xl transition-all cursor-pointer"
          onClick={() => {
            router.push("/reading/document-viewer?title=Web+Content&url=/sample-website.pdf");
          }}
        >
          <CardContent className="p-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Link className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Paste</h3>
            <p className="text-gray-500 text-sm text-center">YouTube, website, text</p>
          </CardContent>
        </Card>

        {/* Record option */}
        <Card 
          className="hover:shadow-xl transition-all cursor-pointer"
          onClick={() => {
            router.push("/reading/document-viewer?title=Recorded+Content&url=/sample-recording.pdf");
          }}
        >
          <CardContent className="p-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <Mic className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Record</h3>
            <p className="text-gray-500 text-sm text-center">Record class, video call</p>
          </CardContent>
        </Card>
      </div>

      {/* Search input */}
      <div className="relative mb-12">
        <Input 
          placeholder="Learn anything" 
          className="py-6 px-4 text-lg rounded-full border border-gray-300"
        />
        <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Spaces section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Spaces</h2>
        <div className="flex items-center gap-4">
          <Card className="w-64 hover:shadow-xl transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">My Space</h3>
                  <p className="text-xs text-gray-500">0 contents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button variant="outline" className="rounded-full w-10 h-10 p-0 border-dashed">
            <span className="text-xl">+</span>
          </Button>
        </div>
      </div>

      {/* Explore section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Explore</h2>
          <Button variant="link">View all</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentReadings.map(item => (
            <Card 
              key={item.id} 
              className="overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              onClick={() => {
                router.push(`/reading/document-viewer?title=${encodeURIComponent(item.title)}&url=/sample-${item.id}.pdf`);
              }}
            >
              <div className="relative h-40">
                {item.thumbnail && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.thumbnail})` }}
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3">
                  <h3 className="text-white font-medium text-sm line-clamp-1">{item.title}</h3>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center">▶</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Show more button */}
      <div className="mt-6 text-center">
        <Button variant="outline" className="rounded-full px-4">
          <span>Show more</span>
          <span className="ml-1">▼</span>
        </Button>
      </div>
    </div>
  )
}

export default ReadingPage
