"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, X, RefreshCw, Eraser } from "lucide-react";
import RichTextEditor from "./rich-text-editor";
import { SlideIn } from "@/components/react-bits/slide-in";

interface AISuggestionsPanelProps {
  selectedText: string;
  onAccept: (newText: string) => void;
  onReject: () => void;
  onClear: () => void;
  isProcessing: boolean;
  suggestedText: string;
  grammarIssues: GrammarIssue[];
}

interface GrammarIssue {
  id: string;
  original: string;
  suggestion: string;
  type: "grammar" | "spelling" | "style" | "clarity";
  description: string;
}

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  selectedText,
  onAccept,
  onReject,
  onClear,
  isProcessing,
  suggestedText,
  grammarIssues = []
}) => {
  const [activeTab, setActiveTab] = useState("paraphrase");
  
  return (
    <Card className="shadow-lg rounded-xl h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            AI Suggestions
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onClear}
              className="text-gray-500 hover:text-gray-600 hover:bg-gray-50"
              disabled={isProcessing || (!suggestedText && grammarIssues.length === 0)}
            >
              <Eraser className="h-4 w-4 mr-1" /> Clear
            </Button>
            {!isProcessing && suggestedText && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onReject}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onAccept(suggestedText)}
                  className="text-green-500 bg-green-50 hover:bg-green-100 border border-green-200"
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Accept
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="paraphrase">Paraphrase</TabsTrigger>
            <TabsTrigger value="grammar">Grammar</TabsTrigger>
            <TabsTrigger value="original">Original</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paraphrase">
            {isProcessing ? (
              <div className="flex items-center justify-center h-[calc(100vh-320px)] border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                  <p className="text-gray-500">Generating suggestions...</p>
                </div>
              </div>
            ) : suggestedText ? (
              <SlideIn>
                <RichTextEditor
                  initialContent={suggestedText}
                  readOnly={true}
                  height="calc(100vh - 320px)"
                />
              </SlideIn>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-320px)] border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">
                  Select text and click "Paraphrase" to see suggestions.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="grammar">
            {grammarIssues.length > 0 ? (
              <div className="space-y-3 h-[calc(100vh-320px)] overflow-y-auto pr-2">
                {grammarIssues.map((issue) => (
                  <Card key={issue.id} className="p-3 border-l-4 border-l-amber-400">
                    <div className="grid grid-cols-[auto_1fr] gap-2">
                      <div className="text-amber-600 font-medium">Issue:</div>
                      <div className="font-medium">{issue.type}</div>
                      
                      <div className="text-gray-500">Original:</div>
                      <div className="text-gray-700">{issue.original}</div>
                      
                      <div className="text-gray-500">Suggestion:</div>
                      <div className="text-green-600">{issue.suggestion}</div>
                      
                      <div className="text-gray-500">Description:</div>
                      <div className="text-sm">{issue.description}</div>
                      
                      <div className="col-span-2 mt-2 flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onReject()}
                          className="text-red-500 hover:bg-red-50"
                        >
                          Ignore
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onAccept(issue.suggestion)}
                          className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                        >
                          Accept Suggestion
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-320px)] border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">
                  No grammar issues found in the selected text.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="original">
            <RichTextEditor
              initialContent={selectedText}
              readOnly={true}
              height="calc(100vh - 320px)"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AISuggestionsPanel;
