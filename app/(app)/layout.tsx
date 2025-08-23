"use client"

import * as React from "react"
import {
  Menu,
  Home,
  BookOpen,
  PencilRuler,
  Lightbulb,
  ScanSearch,
  GraduationCap,
  Calculator,
  User,
  Calendar,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AppSidebar from "@/components/app-sidebar"
import { usePathname } from 'next/navigation'
import { useDeviceSize } from "@/hooks/use-device-size"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const pathname = usePathname()
  const deviceSize = useDeviceSize()
  
  // Auto-collapse sidebar on smaller screens like laptops
  React.useEffect(() => {
    if (deviceSize === 'laptop') {
      setSidebarCollapsed(true)
    } else if (deviceSize === 'desktop') {
      setSidebarCollapsed(false)
    }
  }, [deviceSize])

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: pathname === '/dashboard' },
    { icon: BookOpen, label: "Reading", href: "/reading", active: pathname === '/reading' },
    { icon: PencilRuler, label: "Writing", href: "/writing", active: pathname === '/writing' },
    { icon: Lightbulb, label: "Solver", href: "/solver", active: pathname === '/solver' },
    { icon: ScanSearch, label: "Search", href: "/search", active: pathname === '/search' },
    { icon: GraduationCap, label: "Exam Prep", href: "/exam-prep", active: pathname === '/exam-prep' },
    { icon: Calculator, label: "Math Visualization", href: "/math-viz", active: pathname === '/math-viz' },
  ]

  const workspaceItems = [
    { icon: User, label: "Account", href: "/account" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  // Determine content padding based on screen size
  const getContentPadding = () => {
    switch(deviceSize) {
      case 'mobile':
        return 'p-3';
      case 'tablet':
        return 'p-4';
      case 'laptop':
        return 'p-5';
      case 'desktop':
        return 'p-6';
      default:
        return 'p-4';
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="hidden sm:block">
        <AppSidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          navigationItems={navigationItems}
          workspaceItems={workspaceItems}
        />
      </div>
      
      <main 
        className={`
          ${sidebarCollapsed ? 'sm:ml-[60px]' : 'sm:ml-[250px]'} 
          transition-all duration-300
          ${getContentPadding()}
        `}
      >
        {children}
      </main>

      {/* Mobile Sidebar */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 text-black">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] bg-[#1C1C1C] p-0">
            <AppSidebar
              sidebarCollapsed={false}
              setSidebarCollapsed={() => {}}
              navigationItems={navigationItems}
              workspaceItems={workspaceItems}
              isMobile
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
