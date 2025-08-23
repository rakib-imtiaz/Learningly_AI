"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useDeviceSize } from "@/hooks/use-device-size"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  scaleFactor?: number
  maxWidth?: string
  maintainHeight?: boolean
  className?: string
}

/**
 * A container component that scales its contents based on the device size
 */
export function ResponsiveContainer({
  children,
  scaleFactor = 1,
  maxWidth,
  maintainHeight = false,
  className,
  ...props
}: ResponsiveContainerProps) {
  const deviceSize = useDeviceSize()
  
  // Base scale values for different device types
  const baseScales = {
    mobile: 0.85,
    tablet: 0.9,
    laptop: 1.0, // 13" screens get standard scaling
    desktop: 1.1,
    unknown: 1.0
  }
  
  // Calculate final scale based on device and optional additional factor
  const scale = baseScales[deviceSize] * scaleFactor
  
  // Define responsive spacing based on device
  const spacing = {
    mobile: 'p-2',
    tablet: 'p-3',
    laptop: 'p-4', 
    desktop: 'p-5',
    unknown: 'p-4'
  }

  return (
    <div
      className={cn(
        "w-full mx-auto transition-all",
        spacing[deviceSize],
        className
      )}
      style={{
        maxWidth: maxWidth || 'none',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        ...(maintainHeight ? { height: `calc(100% / ${scale})` } : {}),
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function ResponsiveText({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
}) {
  const deviceSize = useDeviceSize()
  
  // Define responsive text size classes based on device
  const baseTextClass = {
    mobile: 'text-sm',
    tablet: 'text-base',
    laptop: 'text-base', // 13" laptops
    desktop: 'text-lg',
    unknown: 'text-base'
  }
  
  return (
    <div
      className={cn(
        baseTextClass[deviceSize],
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}


