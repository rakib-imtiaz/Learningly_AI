"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import RichTextEditor from "@/components/writing/rich-text-editor"
import WritingToolbar from "@/components/writing/writing-toolbar"
import AISuggestionsPanel from "@/components/writing/ai-suggestions-panel"
import DraftsManager from "@/components/writing/drafts-manager"
import WordCounter from "@/components/writing/word-counter"
import LengthAdjustDialog from "@/components/writing/length-adjust-dialog"
import { convertToRaw, ContentState, EditorState, SelectionState } from "draft-js"
import draftToHtml from "draftjs-to-html"
import { getMockUserId } from "@/lib/mock-user"
import { openInGoogleDocs, downloadFile } from "@/components/writing/google-docs-export"
import { useToast } from "@/hooks/use-toast"
import Toast from "@/components/ui/toast"

interface GrammarIssue {
  id: string;
  original: string;
  suggestion: string;
  type: "grammar" | "spelling" | "style" | "clarity";
  description: string;
}

const WritingPageClient = () => {
  const [editorContent, setEditorContent] = useState<string>("")
  const [editorRawContent, setEditorRawContent] = useState<any>(null)
  const [selectedText, setSelectedText] = useState<string>("")
  const [suggestedText, setSuggestedText] = useState<string>("")
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([])
  const [tone, setTone] = useState<string>("Formal")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [collapseSuggestions, setCollapseSuggestions] = useState<boolean>(false)
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [lastProcessedFeature, setLastProcessedFeature] = useState<string>("")
  const [lengthAdjustDialogOpen, setLengthAdjustDialogOpen] = useState<boolean>(false)
  const [lengthAdjustAction, setLengthAdjustAction] = useState<'shorten' | 'expand'>('shorten')
  const [editorRef, setEditorRef] = useState<any>(null)
  const [editorKey, setEditorKey] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>("paraphrase")
  const [lastSelectedText, setLastSelectedText] = useState<string>("") // Backup for selected text
  
  const { toasts, showSuccess, showError, showInfo, showWarning, hideToast } = useToast()
  
  // Function to handle paraphrasing
  const handleParaphrase = async () => {
    // Try to get current selection if selectedText is empty
    let textToParaphrase = selectedText;
    if (!textToParaphrase.trim()) {
      if (typeof window !== 'undefined') {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          textToParaphrase = selection.toString().trim();
          setSelectedText(textToParaphrase);
        }
      }
      
      if (!textToParaphrase.trim() && lastSelectedText.trim()) {
        // Fall back to last known selection
        textToParaphrase = lastSelectedText;
        setSelectedText(textToParaphrase);
      }
    }
    
    if (!textToParaphrase.trim()) {
      setSuggestedText("");
      setGrammarIssues([]);
      setLastProcessedFeature("Selection Required");
      showWarning("Please select text before clicking 'Paraphrase'");
      return;
    }

    // Auto-switch to paraphrase tab
    setActiveTab("paraphrase");
    setIsProcessing(true);
    
    try {
      console.log('Paraphrasing with tone:', tone); // Debug log
      // Call our API for paraphrasing
      const response = await fetch('/api/writing/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: textToParaphrase, 
          tone: tone.toLowerCase(), // Ensure consistent case
          userId: getMockUserId()
        })
      });
      
      if (!response.ok) {
        throw new Error('Paraphrasing request failed');
      }
      
      const data = await response.json();
      setSuggestedText(data.result);
      setLastProcessedFeature("Paraphrase");
      setIsProcessing(false);
      showInfo(`Paraphrase generated successfully in ${tone} tone!`);
    } catch (error) {
      console.error("Error during paraphrasing:", error);
      setIsProcessing(false);
      showError("An error occurred while paraphrasing. Please try again.");
    }
  };

  // Function to handle grammar checking
  const handleGrammarCheck = async () => {
    // Try to get current selection if selectedText is empty
    let textToCheck = selectedText;
    if (!textToCheck.trim()) {
      if (typeof window !== 'undefined') {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          textToCheck = selection.toString().trim();
          setSelectedText(textToCheck);
        }
      }
      
      if (!textToCheck.trim() && lastSelectedText.trim()) {
        // Fall back to last known selection
        textToCheck = lastSelectedText;
        setSelectedText(textToCheck);
      }
    }
    
    if (!textToCheck.trim()) {
      setSuggestedText("");
      setGrammarIssues([]);
      setLastProcessedFeature("Selection Required");
      showWarning("Please select text before clicking 'Check Grammar'");
      return;
    }

    // Auto-switch to grammar tab
    setActiveTab("grammar");
    setIsProcessing(true);
    
    try {
      // Call our API for grammar checking
      const response = await fetch('/api/writing/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: textToCheck,
          userId: getMockUserId()
        })
      });
      
      if (!response.ok) {
        throw new Error('Grammar check request failed');
      }
      
      const data = await response.json();
      if (data.grammarIssues && data.grammarIssues.length > 0) {
        setGrammarIssues(data.grammarIssues);
        setLastProcessedFeature("Grammar Check");
        showInfo(`Found ${data.grammarIssues.length} grammar issue${data.grammarIssues.length > 1 ? 's' : ''} to review`);
      } else {
        setGrammarIssues([]);
        setLastProcessedFeature("Grammar Check (No issues)");
        showSuccess('No grammar issues found. Your text looks great!');
      }
      setIsProcessing(false);
    } catch (error) {
      console.error("Error during grammar check:", error);
      setIsProcessing(false);
      showError("An error occurred while checking grammar. Please try again.");
    }
  };

  // Helper function to strip HTML tags for text matching
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  // Function to handle accepting all grammar suggestions
  const handleAcceptAll = async () => {
    if (grammarIssues.length === 0) return;
    
    let updatedContent = editorContent;
    let appliedCount = 0;
    
    // Apply each grammar fix sequentially
    for (const issue of grammarIssues) {
      try {
        if (updatedContent.includes(issue.original)) {
          updatedContent = updatedContent.replace(
            new RegExp(issue.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 
            issue.suggestion
          );
          appliedCount++;
        } else {
          // Try flexible pattern matching
          const plainTextContent = stripHtmlTags(updatedContent);
          if (plainTextContent.includes(issue.original)) {
            const flexiblePattern = issue.original
              .split(' ')
              .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
              .join('\\s+(?:<[^>]*>\\s*)*');
            
            updatedContent = updatedContent.replace(
              new RegExp(flexiblePattern),
              issue.suggestion
            );
            appliedCount++;
          }
        }
      } catch (error) {
        console.error(`Error applying fix for "${issue.original}":`, error);
      }
    }
    
    if (appliedCount > 0) {
      setEditorContent(updatedContent);
      setEditorKey(prev => prev + 1);
      setGrammarIssues([]);
      setSelectedText("");
      setLastSelectedText(""); // Clear backup
      showSuccess(`All ${appliedCount} grammar issue${appliedCount > 1 ? 's' : ''} fixed successfully!`);
    } else {
      showError("Could not apply grammar fixes. Please try individual fixes.");
    }
  };

  // Function to handle accepting suggestions - improved approach
  const handleAcceptSuggestion = (newText: string) => {
    // Check if this is a grammar suggestion or paraphrase
    const issue = grammarIssues.find(issue => issue.suggestion === newText);
    const isParaphrase = !issue && newText === suggestedText;
    const textToReplace = issue?.original || selectedText;
    
    if (editorContent && textToReplace && textToReplace.trim()) {
      try {
        // Try multiple replacement strategies for better accuracy
        let updatedContent = editorContent;
        
        // Strategy 1: Direct replacement in HTML
        if (editorContent.includes(textToReplace)) {
          updatedContent = editorContent.replace(
            new RegExp(textToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 
            newText
          );
        } else {
          // Strategy 2: Check if we need to find the text in plain text and replace in HTML
          const plainTextContent = stripHtmlTags(editorContent);
          if (plainTextContent.includes(textToReplace)) {
            // Create a more flexible regex that accounts for HTML tags
            const flexiblePattern = textToReplace
              .split(' ')
              .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
              .join('\\s+(?:<[^>]*>\\s*)*');
            
            updatedContent = editorContent.replace(
              new RegExp(flexiblePattern),
              newText
            );
          }
        }
        
        // Only proceed if content actually changed
        if (updatedContent !== editorContent) {
          // Force editor to update by setting content and incrementing key
          setEditorContent(updatedContent);
          setEditorKey(prev => prev + 1);
          
          // Also update raw content if available
          if (editorRawContent) {
            const updatedRawContent = { ...editorRawContent };
            setEditorRawContent(updatedRawContent);
          }
          
          if (isParaphrase) {
            // Clear paraphrase suggestions
            setSuggestedText("");
            setSelectedText("");
            setLastSelectedText(""); // Clear backup too
            showSuccess("Text paraphrased successfully!");
          } else if (issue) {
            // Only remove the specific grammar issue that was accepted
            const updatedGrammarIssues = grammarIssues.filter(gi => gi.id !== issue.id);
            setGrammarIssues(updatedGrammarIssues);
            setSelectedText("");
            
            // Success message for grammar
            const remainingCount = grammarIssues.length - 1;
            if (remainingCount > 0) {
              showSuccess(`Grammar issue fixed! ${remainingCount} remaining.`);
            } else {
              showSuccess("Grammar issue fixed! All issues resolved.");
              setLastSelectedText(""); // Clear backup when all issues resolved
            }
          }
        } else {
          showWarning("Could not find the exact text to replace. Please try selecting the text again.");
        }
        
      } catch (error) {
        console.error("Error replacing text:", error);
        showError("An error occurred while updating the text. Please try again.");
      }
    } else {
      // If no content or text to replace
      showWarning("Unable to determine where to replace text. Please select text again.");
    }
  };

  // Function to handle rejecting suggestions
  const handleRejectSuggestion = (issueId?: string) => {
    if (issueId) {
      // Remove only the specific grammar issue
      const updatedGrammarIssues = grammarIssues.filter(gi => gi.id !== issueId);
      setGrammarIssues(updatedGrammarIssues);
      if (updatedGrammarIssues.length > 0) {
        showInfo(`Grammar issue ignored. ${updatedGrammarIssues.length} remaining.`);
      } else {
        showSuccess("Grammar issue ignored. All issues resolved.");
      }
    } else {
      // Clear all suggestions (for paraphrase rejection)
      setSuggestedText("");
      setGrammarIssues([]);
      setSelectedText("");
    }
  };
  
  // Function to clear all suggestions
  const handleClearSuggestions = () => {
    setSuggestedText("");
    setGrammarIssues([]);
    setLastProcessedFeature("");
  };

  // Function to handle saving drafts
  const handleSaveDraft = async () => {
    if (!editorContent.trim()) {
      showWarning("Nothing to save. Please add some content first.");
      return;
    }

    showInfo("Saving draft...");
    
    try {
      const response = await fetch('/api/writing/drafts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: editorContent,
          rawContent: editorRawContent,
          tone,
          userId: "mock-user-id", // In production, this would be the actual user ID
          draftId: currentDraftId // This will be null for new drafts
        })
      });
      
      if (!response.ok) {
        throw new Error('Draft saving failed');
      }
      
      const data = await response.json();
      
      // Update the current draft ID if this is a new draft
      if (data.isNewDraft) {
        setCurrentDraftId(data.id);
      }
      
      showSuccess(`Draft ${data.isNewDraft ? 'created' : 'updated'} successfully!`);
    } catch (error) {
      console.error("Error saving draft:", error);
      showError("Error saving draft. Please try again.");
    }
  };

  // Function to handle exporting
  const handleExport = async (format: string) => {
    if (!editorContent.trim()) {
      showWarning("Nothing to export. Please add some content first.");
      return;
    }
    
    // Handle Google Docs export separately (client-side)
    if (format === "gdocs") {
      showInfo("Opening in Google Docs...");
      try {
        openInGoogleDocs(editorContent);
        showSuccess("Opened in Google Docs successfully!");
        
        // Log the export
        await fetch('/api/writing/drafts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            downloadFormat: "gdocs",
            userId: getMockUserId(),
            summaryId: currentDraftId || null
          })
        });
      } catch (error) {
        console.error("Error opening in Google Docs:", error);
        showError("Failed to open in Google Docs. Please try again.");
      }
      return;
    }
    
    // For simple text download, handle it client-side
    if (format === "txt") {
      showInfo(`Preparing TXT export...`);
      try {
        // Strip HTML tags for plain text
        const plainText = editorContent.replace(/<[^>]*>?/gm, '');
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `document-${timestamp}.txt`;
        
        // Download the file
        downloadFile(plainText, filename, "text/plain");
        
        showSuccess(`Text file downloaded successfully!`);
        
        // Log the download
        await fetch('/api/writing/drafts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            downloadFormat: format,
            userId: getMockUserId(),
            summaryId: currentDraftId || null
          })
        });
        
        return;
      } catch (error) {
        console.error("Error downloading text file:", error);
        showError("Text export failed. Please try again.");
        return;
      }
    }
    
    // For PDF and DOCX, use the server API
    showInfo(`Preparing ${format.toUpperCase()} export...`);
    
    try {
      const response = await fetch('/api/writing/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: editorContent,
          format,
          title: `Document-${new Date().toLocaleDateString()}`,
          userId: getMockUserId()
        })
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const data = await response.json();
      
      showSuccess(`${format.toUpperCase()} export ready! Download started.`);
      
      // Create an invisible link to trigger download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Also log the download in our database
      await fetch('/api/writing/drafts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          downloadFormat: format,
          userId: getMockUserId(),
          summaryId: currentDraftId || null // In production, this would track which summary was downloaded
        })
      });
    } catch (error) {
      console.error("Error exporting document:", error);
      showError(`${format.toUpperCase()} export failed. Please try again.`);
    }
  };

  // Function to handle tone changes
  const handleToneChange = (newTone: string) => {
    setTone(newTone);
  };

    // Function to open length adjust dialog
  const openLengthAdjustDialog = (action: 'shorten' | 'expand') => {
    if (!selectedText.trim()) {
      setSuggestedText("");
      setGrammarIssues([]);
      setLastProcessedFeature("Selection Required");
      showWarning(`Please select text before using the ${action === 'shorten' ? 'shorten' : 'expand'} feature`);
      return;
    }
    
    setLengthAdjustAction(action);
    setLengthAdjustDialogOpen(true);
  };
  
  // Function to handle length adjustments with percentage parameter
  const handleLengthAdjust = async (action: 'shorten' | 'expand', percentage: number = 50) => {
    if (!selectedText.trim()) {
      showWarning(`Please select text to ${action}`);
      return;
    }

    setIsProcessing(true);
    setActiveTab("paraphrase"); // Switch to paraphrase tab for length adjust results
    
    try {
      const response = await fetch('/api/writing/adjust-length', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: selectedText,
          action,
          percentage,
          userId: getMockUserId()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Text ${action} request failed`);
      }
      
      const data = await response.json();
      setSuggestedText(data.result);
      setLastProcessedFeature(`${action === 'shorten' ? 'Shortened' : 'Expanded'} Text (${percentage}%)`);
      setIsProcessing(false);
      showInfo(`Text ${action}ed successfully by ${percentage}%!`);
    } catch (error) {
      console.error(`Error ${action}ing text:`, error);
      setIsProcessing(false);
      showError(`An error occurred while ${action}ing the text. Please try again.`);
    }
  };

  // Handle editor content changes
  const handleEditorChange = (html: string, raw: any) => {
    setEditorContent(html);
    setEditorRawContent(raw);
  };

  // Function to get selected text from editor
  const handleTextSelection = () => {
    if (typeof window === 'undefined') return; // SSR guard
    
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim();
      setSelectedText(text);
      setLastSelectedText(text); // Keep a backup
    }
    // Don't clear selectedText immediately - let user actions handle it
  };

  // Function to handle loading a draft
  const handleLoadDraft = async (draftId: string) => {
    showInfo("Loading draft...");
    setIsProcessing(true);
    
    try {
      const response = await fetch(`/api/writing/drafts/load?userId=mock-user-id&draftId=${draftId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load draft');
      }
      
      const data = await response.json();
      
      // Update the editor content and other state
      setEditorContent(data.content);
      setEditorRawContent(data.rawContent || null);
      setTone(data.tone || "Formal");
      setCurrentDraftId(data.id);
      setEditorKey(prev => prev + 1); // Force editor re-render
      
      showSuccess("Draft loaded successfully!");
    } catch (error) {
      console.error("Error loading draft:", error);
      showError("Error loading draft. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Add event listener for text selection
  useEffect(() => {
    if (typeof document === 'undefined') return; // SSR guard
    
    const handleSelectionWithDelay = () => {
      // Add a small delay to avoid conflicts with button clicks
      setTimeout(handleTextSelection, 100);
    };
    
    // Use selectionchange event which is more reliable for text selection
    document.addEventListener('selectionchange', handleSelectionWithDelay);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionWithDelay);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">
                Writing Assistant
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Write, edit, and improve your text with AI assistance. Powered by Gemini 2.5 Flash.
              </p>
            </div>
            <div className="ml-4">
              <DraftsManager 
                userId={getMockUserId()} 
                onLoadDraft={handleLoadDraft} 
              />
            </div>
          </div>
          
          {/* AI Status Bar */}
          <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">AI Ready</span>
              </div>
              <span className="text-gray-500 font-medium">•</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                <span className="h-2 w-2 rounded-full bg-gray-600 mr-2"></span>
                Gemini 2.5 Flash
              </span>
            </div>
            <span className="text-sm text-gray-700">
              Enhanced paraphrasing, grammar checking, and text improvement
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Editor */}
        <div className={`flex-1 p-6 pt-4 overflow-auto transition-all duration-300 ease-in-out ${collapseSuggestions ? 'w-full' : 'md:w-3/5'}`}>
          <Card className="h-full shadow-lg border-0 bg-white rounded-xl overflow-hidden">
            <CardHeader className="p-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <WritingToolbar
                onParaphrase={handleParaphrase}
                onCheckGrammar={handleGrammarCheck}
                onSaveDraft={handleSaveDraft}
                onExport={handleExport}
                onToneChange={handleToneChange}
                onLengthAdjustClick={openLengthAdjustDialog}
                selectedTone={tone}
                isProcessing={isProcessing}
                hasContent={editorContent.trim().length > 0}
                lastProcessedFeature={lastProcessedFeature}
              />
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-full">
              <div className="flex-grow relative">
                <RichTextEditor
                  key={`editor-${editorKey}`}
                  initialContent={editorContent}
                  onChange={handleEditorChange}
                  height="calc(100vh - 280px)"
                  onSelectedTextChange={setSelectedText}
                  setEditorRef={setEditorRef}
                />
              </div>
              <div className="py-3 px-4 border-t border-gray-100 bg-gray-50">
                <WordCounter text={editorContent} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collapse/Expand Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-16 w-8 p-0 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
            onClick={() => setCollapseSuggestions(!collapseSuggestions)}
          >
            {collapseSuggestions ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Right Panel - Suggestions */}
        {!collapseSuggestions && (
          <div className="md:w-2/5 p-6 pt-4 overflow-auto">
            <AISuggestionsPanel
              selectedText={selectedText}
              onAccept={handleAcceptSuggestion}
              onReject={handleRejectSuggestion}
              onAcceptAll={handleAcceptAll}
              onClear={handleClearSuggestions}
              isProcessing={isProcessing}
              suggestedText={suggestedText}
              grammarIssues={grammarIssues}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        )}
      </div>
      
      {/* Length Adjustment Dialog */}
      <LengthAdjustDialog
        open={lengthAdjustDialogOpen}
        onOpenChange={setLengthAdjustDialogOpen}
        onAdjustLength={handleLengthAdjust}
        currentText={selectedText}
      />
      
      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default WritingPageClient
