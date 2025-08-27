"use client"

import * as React from "react"
import { Search, Sparkles, Filter, FileText, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/header"
import { motion } from "framer-motion"
import { ClickSpark } from "@/components/react-bits/click-spark"

interface SearchResult {
  title: string;
  source: string;
  snippet: string;
}

const searchResults: SearchResult[] = [
  {
    title: "The Impact of AI on Modern Education",
    source: "research-paper.pdf",
    snippet:
      "AI is transforming education by providing personalized learning experiences...",
  },
  {
    title: "Key Concepts in Quantum Physics",
    source: "physics-notes.docx",
    snippet:
      "Quantum physics deals with the behavior of matter and energy at the atomic level...",
  },
]

const SearchPage = () => {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSearch = () => {
    if (!query.trim()) return
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setResults(searchResults)
      setIsProcessing(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Customized AI Search" 
        subtitle="Find AI-powered answers from your uploaded documents."
      />

      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your documents..."
              className="pl-10 border-border focus:border-primary"
            />
          </div>
          <ClickSpark>
            <Button 
              onClick={handleSearch} 
              disabled={isProcessing || !query.trim()}
              className="min-w-[100px]"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  Search
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </ClickSpark>
          <Button variant="outline" className="border-border">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div>
          {isProcessing ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Searching through your documents...</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-foreground">{result.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground leading-relaxed">{result.snippet}</p>
                      <div className="flex items-center space-x-2 pt-2 border-t border-border">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          {result.source}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
              <div className="text-center space-y-3">
                <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="space-y-1">
                  <p className="text-foreground font-medium">No search results yet</p>
                  <p className="text-muted-foreground text-sm">Enter a question to search through your documents</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
