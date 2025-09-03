"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, X, RefreshCw, Eraser } from "lucide-react";

interface AISuggestionsPanelProps {
  selectedText: string;
  onAccept: (newText: string) => void;
  onReject: (issueId?: string) => void;
  onAcceptAll: () => void;
  onClear: () => void;
  isProcessing: boolean;
  suggestedText: string;
  grammarIssues: GrammarIssue[];
  activeTab: string;
  onTabChange: (tab: string) => void;
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
  onAcceptAll,
  onClear,
  isProcessing,
  suggestedText,
  grammarIssues = [],
  activeTab,
  onTabChange
}) => {
  
  return (
    <Card className="shadow-xl rounded-xl h-full border-0 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-b-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg mr-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">AI Suggestions</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onClear}
              className="text-white/80 hover:text-white hover:bg-white/20 border-0"
              disabled={isProcessing || (!suggestedText && grammarIssues.length === 0)}
            >
              <Eraser className="h-4 w-4 mr-1" /> Clear
            </Button>
            {!isProcessing && suggestedText && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onReject()}
                  className="text-red-200 hover:text-white hover:bg-red-500/20 border-0"
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onAccept(suggestedText)}
                  className="bg-white text-gray-900 hover:bg-gray-100 border-0 shadow-md"
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Accept
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="grid grid-cols-3 mb-4 bg-white/50 backdrop-blur-sm border border-gray-200">
              <TabsTrigger 
                value="paraphrase"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Paraphrase
              </TabsTrigger>
              <TabsTrigger 
                value="grammar"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Grammar
              </TabsTrigger>
              <TabsTrigger 
                value="original"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Original
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 px-4 pb-4 overflow-auto">
            <TabsContent value="paraphrase" className="h-full m-0">
              {isProcessing ? (
                <div className="flex items-center justify-center h-[calc(100vh-320px)] border-2 border-dashed border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="relative">
                      <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-gray-600" />
                      <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin"></div>
                    </div>
                    <p className="text-gray-700 font-medium">Generating suggestions...</p>
                    <p className="text-gray-500 text-sm mt-1">This may take a few seconds</p>
                  </div>
                </div>
              ) : suggestedText ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Suggestion</h4>
                    <div 
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: suggestedText }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReject()}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onAccept(suggestedText)}
                      className="flex-1 bg-gray-900 hover:bg-black text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Accept
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-320px)] border-2 border-dashed border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready for AI Magic</h3>
                    <p className="text-gray-600 mb-4">Select text and click "Paraphrase" to see suggestions</p>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-sm text-gray-600">
                        💡 <strong>Tip:</strong> You can also use the toolbar buttons to check grammar, shorten, or expand your text.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="grammar" className="h-full m-0">
              {isProcessing ? (
                <div className="flex items-center justify-center h-[calc(100vh-320px)] border-2 border-dashed border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="relative">
                      <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-gray-600" />
                      <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin"></div>
                    </div>
                    <p className="text-gray-700 font-medium">Checking grammar...</p>
                    <p className="text-gray-500 text-sm mt-1">Analyzing your text for errors</p>
                  </div>
                </div>
              ) : grammarIssues.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Found {grammarIssues.length} issue{grammarIssues.length !== 1 ? 's' : ''}
                    </h4>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={onAcceptAll}
                      className="bg-gray-900 hover:bg-black text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Fix All
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {grammarIssues.map((issue) => (
                      <div key={issue.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {issue.type}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onReject(issue.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                        <div className="space-y-1">
                          <p className="text-xs text-red-600 line-through">{issue.original}</p>
                          <p className="text-xs text-green-600 font-medium">{issue.suggestion}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAccept(issue.suggestion)}
                          className="mt-2 w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Apply Fix
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-320px)] border-2 border-dashed border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Grammar Check Complete</h3>
                    <p className="text-green-600">No issues found in your text!</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="original" className="h-full m-0">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-full">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Selected Text</h4>
                {selectedText ? (
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p className="whitespace-pre-wrap">{selectedText}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      No text selected. <br />
                      Select some text to see it here.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
};

export default AISuggestionsPanel;
