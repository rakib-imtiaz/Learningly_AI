"use client"

import * as React from "react"
import { Bell, Palette, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/ui/header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SettingsPage = () => {
  return (
    <div className="p-6 space-y-8">
      <Header 
        title="Settings" 
        subtitle="Manage your application preferences."
      />

      <div className="space-y-6 max-w-3xl mx-auto">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Palette className="mr-2 h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="text-foreground">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger className="w-[180px] border-border">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-foreground">Email Notifications</Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="text-foreground">Push Notifications</Label>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Database className="mr-2 h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your personal data and history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full border-border">
              Export My Data
            </Button>
            <Button variant="destructive" className="w-full">
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage
