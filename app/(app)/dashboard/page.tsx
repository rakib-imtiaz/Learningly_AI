"use client"

import * as React from "react"
import MainContent from "@/components/main-content"

export default function Dashboard() {
  // The sidebar state is now managed in the layout, so we don't need it here.
  // We can pass a dummy value for now, or refactor MainContent to not require it.
  // For now, let's assume MainContent might still expect it, so we'll pass false.
  return <MainContent sidebarCollapsed={false} />
}
