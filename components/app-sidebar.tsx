"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, LogOut, Settings, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

interface AppSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  navigationItems: NavigationItem[];
  workspaceItems: NavigationItem[];
  isMobile?: boolean;
}

export default function AppSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  navigationItems,
  workspaceItems,
  isMobile = false,
}: AppSidebarProps) {
  const commonClasses = "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"

  return (
    <div
      className={`
        fixed h-screen
        ${isMobile ? 'flex' : 'hidden sm:flex'}
        flex-col bg-[#1C1C1C] text-white z-40 transition-all duration-300
        ${sidebarCollapsed ? 'w-[60px]' : 'w-[250px]'}
        ${isMobile ? 'w-full' : ''}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center p-4 border-b border-white/10 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-teal-500">
              <BrainCircuit className="h-5 w-5 text-black" />
            </div>
            <div>
              <div className="text-base font-bold">Learningly</div>
              <div className="text-xs text-gray-400">AI Learning Platform</div>
            </div>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between p-2">
        <div>
          {/* Main Features */}
          {!sidebarCollapsed && (
            <div className="text-xs font-semibold text-gray-400 mb-2 px-3 mt-4">FEATURES</div>
          )}
          <nav className="space-y-1 mt-2">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`
                    ${commonClasses}
                    ${item.active ? 'bg-green-600/90 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
              </Link>
            ))}
          </nav>

          {/* Workspace */}
          {!sidebarCollapsed && (
            <div className="text-xs font-semibold text-gray-400 mb-2 px-3 mt-6">WORKSPACE</div>
          )}
          <nav className="space-y-1 mt-2">
            {workspaceItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={`${commonClasses} text-gray-300 hover:bg-white/10 hover:text-white ${sidebarCollapsed ? 'justify-center' : ''}`}>
                  <item.icon className="h-5 w-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Settings & Logout */}
        <div className="p-2 border-t border-white/10">
          <Link href="/settings">
            <div className={`${commonClasses} text-gray-300 hover:bg-white/10 hover:text-white ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <Settings className="h-5 w-5" />
              {!sidebarCollapsed && <span>Settings</span>}
            </div>
          </Link>
          <Link href="/">
            <div className={`${commonClasses} text-gray-300 hover:bg-white/10 hover:text-white ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <LogOut className="h-5 w-5" />
              {!sidebarCollapsed && <span>Logout</span>}
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}