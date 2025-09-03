"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/header"

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const dates = Array.from({ length: 35 }, (_, i) => i - 4) // Dummy dates for a 5-week view

const events: { [key: number]: { title: string; color: string }[] } = {
  10: [{ title: "Midterm Exam", color: "bg-destructive" }],
  15: [{ title: "Project Due", color: "bg-primary" }],
  22: [{ title: "Study Session", color: "bg-accent" }],
}

const CalendarPage = () => {
  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Calendar" 
        subtitle="Manage your academic schedule and deadlines."
      />

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="border-border">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-foreground">October 2024</h2>
            <Button variant="outline" size="icon" className="border-border">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Connect Google Calendar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px border-l border-t border-border">
            {days.map((day) => (
              <div key={day} className="py-3 text-center font-semibold text-muted-foreground border-r border-b border-border bg-muted/30">
                {day}
              </div>
            ))}
            {dates.map((date, index) => (
              <div
                key={index}
                className={`p-2 h-32 border-r border-b border-border ${
                  date <= 0 || date > 31 ? "bg-muted/20" : "bg-background"
                }`}
              >
                {date > 0 && date <= 31 && (
                  <>
                    <span className="font-semibold text-foreground text-sm">{date}</span>
                    <div className="mt-1 space-y-1">
                      {events[date] && events[date].map((event, eventIndex) => (
                        <Badge 
                          key={eventIndex} 
                          className={`${event.color} text-primary-foreground text-xs px-2 py-1 block truncate`}
                        >
                          {event.title}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CalendarPage
