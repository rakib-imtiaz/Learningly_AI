// Core legal platform types
export interface Case {
  id: string
  title: string
  clientName: string
  caseType: 'civil' | 'criminal' | 'immigration' | 'litigation' | 'divorce' | 'contract'
  status: 'active' | 'closed' | 'pending' | 'review'
  createdAt: Date
  updatedAt: Date
  summary?: string
  legalIssues?: string[]
  documents?: Document[]
  successRate?: number
  opposingArguments?: string[]
  requiredDocuments?: string[]
  similarCases?: string[]
  assignedJudges?: Judge[]
}

export interface Document {
  id: string
  filename: string
  type: 'upload' | 'generated' | 'template'
  size: number
  uploadedAt: Date
  content?: string
  tags?: string[]
  caseId?: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  cases: string[] // Case IDs
  intakeNotes?: string
  createdAt: Date
}

export interface Judge {
  id: string
  name: string
  court: string
  jurisdiction: string
  successRate: number
  specialties: string[]
}

export interface LegalResearch {
  id: string
  query: string
  response: string
  citations: Citation[]
  opposingArguments?: string[]
  confidence: number
  timestamp: Date
}

export interface Citation {
  id: string
  title: string
  court: string
  year: number
  url?: string
  isValid: boolean
  relevanceScore: number
}

export interface AIResponse {
  content: string
  citations?: Citation[]
  confidence: number
  timestamp: Date
  type: 'summary' | 'analysis' | 'research' | 'draft'
}

export interface IntakeSession {
  id: string
  clientId: string
  transcript: string
  summary: {
    brief: string
    mainGoal: string
    fullContext: string
  }
  recordingUrl?: string
  duration: number
  timestamp: Date
  status: 'processing' | 'completed' | 'error'
}

export interface DocumentTemplate {
  id: string
  name: string
  category: string
  description: string
  content: string
  variables: TemplateVariable[]
  createdAt: Date
}

export interface TemplateVariable {
  name: string
  type: 'text' | 'date' | 'number' | 'select'
  required: boolean
  placeholder?: string
  options?: string[] // for select type
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    caseUpdates: boolean
    systemAlerts: boolean
  }
  defaultCaseType: Case['caseType']
  autoSave: boolean
}

// Component prop types
export interface SidebarProps {
  activeItem?: string
  onItemSelect?: (item: string) => void
}

export interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  acceptedTypes?: string[]
  maxSize?: number
  multiple?: boolean
}

export interface ChatMessage {
  id: string
  content: string
  type: 'user' | 'ai'
  timestamp: Date
  citations?: Citation[]
}