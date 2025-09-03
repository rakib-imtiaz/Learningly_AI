"use client"

import * as React from "react"
import Link from "next/link"
import {
  Search, Bell, BookOpen, PencilRuler, ScanSearch, GraduationCap, Lightbulb, TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/ui/header"
import { motion } from "framer-motion"
import { useAuthContext } from "@/components/auth/auth-provider"
import { getUserMetadata } from "@/types/auth"

const featureCards = [
  {
    icon: BookOpen,
    title: "Reading",
    description: "Summarize documents, generate notes, and create quizzes.",
    href: "/reading",
    cta: "Start Reading",
  },
  {
    icon: PencilRuler,
    title: "Writing",
    description: "Improve your essays with grammar checks and paraphrasing.",
    href: "/writing",
    cta: "Start Writing",
  },
  {
    icon: Lightbulb,
    title: "Solver",
    description: "Get step-by-step solutions to complex problems.",
    href: "/solver",
    cta: "Start Solving",
  },
  {
    icon: ScanSearch,
    title: "Search",
    description: "Find customized AI-powered answers from your documents.",
    href: "/search",
    cta: "Start Searching",
  },
  {
    icon: GraduationCap,
    title: "Exam Prep",
    description: "Generate practice exams and track your study progress.",
    href: "/exam-prep",
    cta: "Start Preparing",
    className: "lg:col-span-2",
  },
];

interface MainContentProps {
  sidebarCollapsed: boolean;
}

export default function MainContent({ sidebarCollapsed }: MainContentProps) {
  const { user } = useAuthContext()
  
  // Extract user information
  const userMetadata = user ? getUserMetadata(user) : null
  const displayName = userMetadata?.full_name || userMetadata?.name || user?.email?.split('@')[0] || 'User'
  const firstName = userMetadata?.given_name || displayName.split(' ')[0] || 'User'
  
  // Generate initials from display name
  const getInitials = (name: string) => {
    const nameParts = name.split(' ')
    if (nameParts.length >= 2) {
      return nameParts[0][0] + nameParts[1][0]
    }
    return name.substring(0, 2)
  }
  
  const initials = getInitials(displayName).toUpperCase()
  
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="h-[70px] border-b border-border bg-background/80 backdrop-blur-lg px-6 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search anything..."
              className="pl-10 w-[300px] bg-muted border-border text-foreground focus:border-primary focus:ring-primary rounded-full"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-background"></span>
          </Button>
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={userMetadata?.avatar_url || userMetadata?.picture} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-6 space-y-8">
        <Header 
          title={`Welcome back, ${firstName}`} 
          subtitle="Let's make learning easier and faster today."
        />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={card.className}
            >
              <Card className="h-full group bg-card hover:bg-accent/50 border-border rounded-lg transition-all duration-300 shadow-sm hover:shadow-md">
                <Link href={card.href} className="block h-full p-6">
                  <div className="flex items-start">
                    <div className="p-2 bg-primary/10 rounded-lg mr-4">
                      <card.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-xl text-foreground mb-1">{card.title}</h4>
                      <p className="text-sm text-muted-foreground flex-1 mb-4">{card.description}</p>
                      <div className="text-sm font-medium text-primary group-hover:underline flex items-center">
                        {card.cta} <TrendingUp className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
