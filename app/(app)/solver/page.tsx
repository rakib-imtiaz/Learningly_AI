"use client"

import * as React from "react"
import {
  Lightbulb,
  BrainCircuit,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/ui/header"
import { motion } from "framer-motion"

interface SolutionStep {
  title: string;
  explanation: string;
}

interface Solution {
  finalAnswer: string;
  steps: SolutionStep[];
}

const steps: SolutionStep[] = [
  {
    title: "Identify the variables",
    explanation: "The key variables are distance (d), rate (r), and time (t).",
  },
  {
    title: "Apply the formula",
    explanation: "Use the formula d = r * t to find the solution.",
  },
  {
    title: "Calculate the result",
    explanation: "Substitute the values and solve for the unknown variable.",
  },
]

const SolverPage = () => {
  const [problem, setProblem] = React.useState("")
  const [solution, setSolution] = React.useState<Solution | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSolve = () => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setSolution({
        finalAnswer: "The answer is 42.",
        steps: steps,
      })
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Problem Solver" 
        subtitle="Get step-by-step solutions to your math and science problems."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Type className="mr-2 h-5 w-5" />
              Enter Your Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g., Solve for x in 2x + 5 = 15"
              className="h-48 resize-none border-border focus:border-primary"
            />
            <Button
              onClick={handleSolve}
              disabled={isProcessing || !problem.trim()}
              className="w-full"
            >
              {isProcessing ? "Solving..." : "Solve Problem"}
              {!isProcessing && <BrainCircuit className="ml-2 h-4 w-4" />}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Lightbulb className="mr-2 h-5 w-5" />
              Solution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Analyzing your problem...</p>
                </div>
              </div>
            ) : solution ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  {solution.steps.map((step, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <h3 className="font-semibold text-foreground mb-2 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm mr-3">
                          {index + 1}
                        </span>
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{step.explanation}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="font-semibold text-lg text-foreground mb-1">Final Answer</h3>
                    <p className="text-primary font-medium">{solution.finalAnswer}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg">
                <div className="text-center space-y-2">
                  <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Your step-by-step solution will appear here.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SolverPage
