"use client";

import React from "react";
import {
  RefreshCw,
  CheckCircle,
  ChevronDown,
  Download,
  Save,
  Book,
  Wand2,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AIStatusIndicator from "./ai-status-indicator";

interface WritingToolbarProps {
  onParaphrase: () => void;
  onCheckGrammar: () => void;
  onSaveDraft: () => void;
  onExport: (format: string) => void;
  onToneChange: (tone: string) => void;
  onLengthAdjustClick: (action: 'shorten' | 'expand') => void;
  selectedTone: string;
  isProcessing: boolean;
  hasContent: boolean;
  lastProcessedFeature?: string;
}

const WritingToolbar: React.FC<WritingToolbarProps> = ({
  onParaphrase,
  onCheckGrammar,
  onSaveDraft,
  onExport,
  onToneChange,
  onLengthAdjustClick,
  selectedTone,
  isProcessing,
  hasContent,
  lastProcessedFeature,
}) => {
  const toneOptions = ["Formal", "Informal", "Academic", "Casual"];
  
  return (
    <div className="flex flex-wrap gap-2 items-center justify-between py-2 px-1 bg-white border-b">
      <div className="flex flex-wrap gap-2 items-center">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onParaphrase}
              disabled={isProcessing || !hasContent}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-1" />
                  Paraphrase
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rewrite selected text with AI assistance</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onCheckGrammar}
              disabled={isProcessing || !hasContent}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Check Grammar
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Check grammar and get suggestions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="mx-1 h-6 border-r border-gray-300"></div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Book className="h-4 w-4 mr-1" />
                  {selectedTone}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {toneOptions.map((tone) => (
                  <DropdownMenuItem
                    key={tone}
                    onClick={() => onToneChange(tone)}
                    className={tone === selectedTone ? "bg-muted" : ""}
                  >
                    {tone}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change writing tone</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Length
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onLengthAdjustClick('shorten')}>
                  Make it Shorter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLengthAdjustClick('expand')}>
                  Make it Longer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adjust text length</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="mx-1 h-6 border-r border-gray-300"></div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onSaveDraft}>
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save your current draft</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onExport("pdf")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2">
                    <path fill="currentColor" d="M12 16.5l4-4h-3v-9h-2v9H8l4 4zm9-13.5H3v18h18V3zm-2 16H5V5h14v14z"/>
                  </svg>
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("docx")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2">
                    <path fill="#2A5699" d="M23 1v22H7V1h16zm-7 10H9v1h7v-1zm0-2H9v1h7V9zm0-2H9v1h7V7zm-7 8h7v-1H9v1zm-8 8V1h4v22H1v-4zm4-6H1v4h4v-4z"/>
                  </svg>
                  Word Document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("txt")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2">
                    <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                  </svg>
                  Plain Text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("gdocs")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2">
                    <path fill="#4285F4" d="M4.01 8.54c1.84 0 3.09 1.29 3.09 3.09s-1.25 3.09-3.09 3.09c-1.84 0-3.09-1.29-3.09-3.09s1.25-3.09 3.09-3.09zm6.42 3.09c0-3.33-2.76-6.03-6.16-6.03s-6.16 2.71-6.16 6.03c0 3.33 2.76 6.03 6.16 6.03s6.16-2.71 6.16-6.03zm8.48-6.03c1.84 0 3.09 1.29 3.09 3.09v6.03c0 1.8-1.25 3.09-3.09 3.09h-6.16c-1.8 0-3.09-1.29-3.09-3.09v-6.03c0-1.8 1.29-3.09 3.09-3.09h6.16zm-11.57 0v12.06h11.57c3.33 0 6.16-2.71 6.16-6.03v-6.03h-11.57c-3.33 0-6.16 2.71-6.16 6.03v-6.03z"/>
                  </svg>
                  Open in Google Docs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export your document</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      </div>
      <AIStatusIndicator 
        isProcessing={isProcessing}
        lastProcessedFeature={lastProcessedFeature}
        model="Gemini 2.5 Flash"
      />
    </div>
  );
};

export default WritingToolbar;
