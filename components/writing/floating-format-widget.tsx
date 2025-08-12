"use client";

import React, { useState, useEffect } from "react";
import { 
  Wand2, 
  ChevronDown, 
  ShrinkIcon, 
  ExpandIcon, 
  CheckCircle,
  Book
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FloatingFormatWidgetProps {
  onParaphrase: () => void;
  onToneChange: (tone: string) => void;
  onShorten: () => void;
  onExpand: () => void;
  selectedText: string;
  selectedTone: string;
  isVisible: boolean;
}

const FloatingFormatWidget: React.FC<FloatingFormatWidgetProps> = ({
  onParaphrase,
  onToneChange,
  onShorten,
  onExpand,
  selectedText,
  selectedTone,
  isVisible
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toneOptions = ["Formal", "Informal", "Academic", "Casual"];
  
  useEffect(() => {
    const updatePosition = () => {
      const selection = window.getSelection();
      
      if (selection && selection.rangeCount > 0 && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Position the widget above the selection
        setPosition({
          top: window.scrollY + rect.top - 45, // 45px above selection
          left: window.scrollX + rect.left + (rect.width / 2) - 100 // Centered
        });
      }
    };
    
    // Update position whenever selection changes
    document.addEventListener('selectionchange', updatePosition);
    updatePosition(); // Initial position
    
    return () => {
      document.removeEventListener('selectionchange', updatePosition);
    };
  }, [selectedText]);
  
  if (!isVisible || !selectedText) return null;
  
  return (
    <div 
      className="fixed z-50 bg-white border shadow-lg rounded-lg py-1 px-2 flex items-center gap-1"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <button
        className="p-1 hover:bg-gray-100 rounded text-purple-600"
        onClick={onParaphrase}
        title="Paraphrase"
      >
        <Wand2 className="h-4 w-4" />
      </button>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded text-blue-600 flex items-center gap-0.5">
          <Book className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {toneOptions.map((tone) => (
            <DropdownMenuItem
              key={tone}
              onClick={() => onToneChange(tone)}
              className="text-sm flex items-center"
            >
              {tone === selectedTone && (
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              )}
              {tone}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <button
        className="p-1 hover:bg-gray-100 rounded text-orange-600"
        onClick={onShorten}
        title="Shorten Text"
      >
        <ShrinkIcon className="h-4 w-4" />
      </button>
      
      <button
        className="p-1 hover:bg-gray-100 rounded text-green-600"
        onClick={onExpand}
        title="Expand Text"
      >
        <ExpandIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FloatingFormatWidget;
