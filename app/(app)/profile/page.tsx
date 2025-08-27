"use client"

import * as React from "react"
import { User, Edit, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/ui/header"
import { useAuthContext } from "@/components/auth/auth-provider"
import { getUserMetadata, getAuthProviderFromUser } from "@/types/auth"

const ProfilePage = () => {
  const [isEditing, setIsEditing] = React.useState(false)
  const { user } = useAuthContext()
  
  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <Header 
          title="Profile" 
          subtitle="Please sign in to view your profile."
        />
      </div>
    )
  }

  const userMetadata = getUserMetadata(user)
  const authProvider = getAuthProviderFromUser(user)
  const displayName = userMetadata?.full_name || userMetadata?.name || user.email?.split('@')[0] || 'User'

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="My Profile" 
        subtitle="View and manage your profile information."
      />

      <Card className="border-border max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center text-foreground">
            <User className="mr-2 h-5 w-5" />
            Profile Information
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
            className="border-border"
          >
            {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
            {isEditing ? "Save" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-2 border-border">
              <AvatarImage src={userMetadata?.avatar_url || userMetadata?.picture} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label htmlFor="name" className="text-foreground">Name</Label>
              <Input 
                id="name" 
                defaultValue={displayName} 
                disabled={!isEditing}
                className="border-border focus:border-primary"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input 
              id="email" 
              type="email" 
              defaultValue={user.email || ''} 
              disabled 
              className="border-border bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-foreground">Sign-in Method</Label>
            <Input 
              id="provider" 
              defaultValue={authProvider.charAt(0).toUpperCase() + authProvider.slice(1)} 
              disabled 
              className="border-border bg-muted"
            />
          </div>
          
          {authProvider === 'github' && userMetadata?.user_name && (
            <div className="space-y-2">
              <Label htmlFor="github" className="text-foreground">GitHub Username</Label>
              <Input 
                id="github" 
                defaultValue={`@${userMetadata.user_name}`} 
                disabled 
                className="border-border bg-muted"
              />
            </div>
          )}
          
          {isEditing && (
            <Button className="w-full">
              Change Password
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
