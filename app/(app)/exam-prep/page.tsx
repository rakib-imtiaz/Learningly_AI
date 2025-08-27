"use client"

import * as React from "react"
import {
  GraduationCap,
  Sparkles,
  Plus,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/ui/header"
import { motion } from "framer-motion"

const ExamPrepPage = () => {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [testReady, setTestReady] = React.useState(false)
  const [selectedTopic, setSelectedTopic] = React.useState("")
  const [selectedType, setSelectedType] = React.useState("")
  const [selectedQuestions, setSelectedQuestions] = React.useState("")

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setTestReady(true)
    }, 2500)
  }

  return (
    <div className="p-6 space-y-8">
      <Header 
        title="Exam Preparation" 
        subtitle="Generate custom practice exams from your study materials."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create New Exam Card */}
        <div className="lg:col-span-1">
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg text-foreground">
                <Plus className="mr-2 h-5 w-5" />
                Create New Exam
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Topic</label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-full border-border">
                    <SelectValue placeholder="Select Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="algebra">Algebra</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Question Types</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full border-border">
                    <SelectValue placeholder="Question Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                    <SelectItem value="short_answer">Short Answer</SelectItem>
                    <SelectItem value="essay">Essay Questions</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Number of Questions</label>
                <Select value={selectedQuestions} onValueChange={setSelectedQuestions}>
                  <SelectTrigger className="w-full border-border">
                    <SelectValue placeholder="Number of Questions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="30">30 Questions</SelectItem>
                    <SelectItem value="50">50 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !selectedTopic || !selectedType || !selectedQuestions} 
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Exam
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Exam Display */}
        <div className="lg:col-span-2">
          {testReady ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">Your Practice Exam is Ready!</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    {selectedQuestions} {selectedType === 'mcq' ? 'Multiple Choice' : selectedType === 'short_answer' ? 'Short Answer' : selectedType} questions on {selectedTopic}
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Good luck! You can review your results and get detailed explanations afterward.
                  </p>
                  <Button size="lg" className="px-8">
                    Start Exam
                    <TrendingUp className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg bg-muted/30">
              <div className="text-center space-y-3">
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-foreground font-medium">Your generated exam will appear here</p>
                    Fill out the form and click &quot;Generate Exam&quot; to get started
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Tracking Section */}
      <div className="space-y-6">
        <Header 
          title="Progress Tracking" 
          subtitle="Monitor your performance across different subjects"
        />
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-medium">Biology</span>
                <span className="font-semibold text-primary">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-medium">History</span>
                <span className="font-semibold text-primary">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-medium">Chemistry</span>
                <span className="font-semibold text-primary">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ExamPrepPage