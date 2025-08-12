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
import FloatingFormatWidget from "@/components/writing/floating-format-widget"
import { convertToRaw, ContentState, EditorState, SelectionState } from "draft-js"
import draftToHtml from "draftjs-to-html"
import { getMockUserId } from "@/lib/mock-user"
import { openInGoogleDocs, downloadFile } from "@/components/writing/google-docs-export"

interface GrammarIssue {
  id: string;
  original: string;
  suggestion: string;
  type: "grammar" | "spelling" | "style" | "clarity";
  description: string;
}

const WritingPage = () => {
  const [editorContent, setEditorContent] = useState<string>("")
  const [editorRawContent, setEditorRawContent] = useState<any>(null)
  const [selectedText, setSelectedText] = useState<string>("")
  const [suggestedText, setSuggestedText] = useState<string>("")
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([])
  const [tone, setTone] = useState<string>("Formal")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [collapseSuggestions, setCollapseSuggestions] = useState<boolean>(false)
  const [saveStatus, setSaveStatus] = useState<string>("")
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [lastProcessedFeature, setLastProcessedFeature] = useState<string>("")
  const [lengthAdjustDialogOpen, setLengthAdjustDialogOpen] = useState<boolean>(false)
  const [lengthAdjustAction, setLengthAdjustAction] = useState<'shorten' | 'expand'>('shorten')
  const [editorRef, setEditorRef] = useState<any>(null)
  const [showFormatWidget, setShowFormatWidget] = useState<boolean>(false)
  
  // Function to handle paraphrasing
  const handleParaphrase = async () => {
    if (!selectedText.trim()) {
      // Instead of alert, set an informative message in the suggestions panel
      setSuggestedText("");
      setGrammarIssues([]);
      setLastProcessedFeature("Selection Required");
      setSaveStatus("Please select text before clicking 'Paraphrase'");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call our API for paraphrasing
      const response = await fetch('/api/writing/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: selectedText, 
          tone,
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
    } catch (error) {
      console.error("Error during paraphrasing:", error);
      setIsProcessing(false);
      alert("An error occurred while paraphrasing.");
    }
  };

  // Function to handle grammar checking
  const handleGrammarCheck = async () => {
    if (!selectedText.trim()) {
      // Instead of alert, set an informative message in the suggestions panel
      setSuggestedText("");
      setGrammarIssues([]);
      setLastProcessedFeature("Selection Required");
      setSaveStatus("Please select text before clicking 'Check Grammar'");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call our API for grammar checking
      const response = await fetch('/api/writing/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: selectedText,
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
      } else {
        setGrammarIssues([]);
        alert('No grammar issues found.');
        setLastProcessedFeature("Grammar Check (No issues)");
      }
      setIsProcessing(false);
    } catch (error) {
      console.error("Error during grammar check:", error);
      setIsProcessing(false);
      alert("An error occurred while checking grammar.");
    }
  };

  // Helper function to find text in editor content and create a selection
  const findTextInEditorContent = (text: string) => {
    if (!editorRef) return null;
    
    const currentState = editorRef.getEditorState();
    const contentState = currentState.getCurrentContent();
    const blocks = contentState.getBlockMap();
    
    // Search for text in blocks
    let foundBlock = null;
    let startOffset = -1;
    
    blocks.forEach((block) => {
      if (foundBlock) return; // Already found
      
      const blockText = block.getText();
      const index = blockText.indexOf(text);
      
      if (index >= 0) {
        foundBlock = block;
        startOffset = index;
      }
    });
    
    // If text found, create a selection
    if (foundBlock && startOffset >= 0) {
      const blockKey = foundBlock.getKey();
      const selectionState = SelectionState.createEmpty(blockKey);
      
      return selectionState.merge({
        anchorKey: blockKey,
        anchorOffset: startOffset,
        focusKey: blockKey,
        focusOffset: startOffset + text.length,
      });
    }
    
    return null;
  };

  // Function to handle accepting suggestions
  const handleAcceptSuggestion = (newText: string) => {
    // For grammar suggestions, we use the suggestion directly
    const issue = grammarIssues.find(issue => issue.suggestion === newText);
    const textToReplace = issue?.original || selectedText;
    
    if (editorRef && textToReplace) {
      try {
        // Get current state and content
        const currentState = editorRef.getEditorState();
        const contentState = currentState.getCurrentContent();
        let selection = currentState.getSelection();
        
        // For grammar issues, find the text to replace
        if (issue) {
          const foundSelection = findTextInEditorContent(textToReplace);
          if (foundSelection) {
            selection = foundSelection;
          }
        }
        
        // Check if we have a valid selection
        if (selection && !selection.isCollapsed()) {
          // Get the selected text range
          const startKey = selection.getStartKey();
          const endKey = selection.getEndKey();
          const startOffset = selection.getStartOffset();
          const endOffset = selection.getEndOffset();
          
          // Create new content state with replaced text
          const contentWithReplacedText = ContentState.createFromText(newText);
          
          // Update editor state with new content
          const newContentState = contentState.replaceText(
            selection, 
            newText
          );
          
          const newEditorState = EditorState.push(
            currentState,
            newContentState,
            'insert-characters'
          );
          
          // Update the editor
          editorRef.setEditorState(newEditorState);
          
          // Clear suggestions
          setSuggestedText("");
          
          // Success message
          setSaveStatus("Text updated successfully!");
          setTimeout(() => setSaveStatus(""), 2000);
        } else {
          // If no text is selected
          alert("No text is currently selected. Please select text first.");
        }
      } catch (error) {
        console.error("Error replacing text:", error);
        alert("An error occurred while updating the text. Please try again.");
      }
    } else {
      // If no editor reference or selected text
      alert("Unable to determine where to replace text. Please select text again.");
    }
  };

  // Function to handle rejecting suggestions
  const handleRejectSuggestion = () => {
    setSuggestedText("");
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
      alert("Nothing to save. Please add some content first.");
      return;
    }

    setSaveStatus("Saving...");
    
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
      
      setSaveStatus(`Draft ${data.isNewDraft ? 'created' : 'updated'} successfully!`);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error saving draft:", error);
      setSaveStatus("Error saving draft");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // Function to handle exporting
  const handleExport = async (format: string) => {
    if (!editorContent.trim()) {
      alert("Nothing to export. Please add some content first.");
      return;
    }
    
    setSaveStatus(`Preparing ${format.toUpperCase()} export...`);
    
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
      
      setSaveStatus(`${format.toUpperCase()} export ready!`);
      setTimeout(() => setSaveStatus(""), 3000);
      
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
          userId: "mock-user-id",
          summaryId: currentDraftId || null // In production, this would track which summary was downloaded
        })
      });
    } catch (error) {
      console.error("Error exporting document:", error);
      setSaveStatus("Export failed");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // Function to handle tone changes
  const handleToneChange = (newTone: string) => {
    setTone(newTone);
  };

    // Function to open length adjust dialog
  const openLengthAdjustDialog = (action: 'shorten' | 'expand') => {
    if (!selectedText.trim()) {
      // Instead of alert, set an informative message in the suggestions panel
      setSuggestedText("");
      setGrammarIssues([]);
      setLastProcessedFeature("Selection Required");
      setSaveStatus(`Please select text before using the ${action === 'shorten' ? 'shorten' : 'expand'} feature`);
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    
    setLengthAdjustAction(action);
    setLengthAdjustDialogOpen(true);
  };
  
  // Function to handle length adjustments with percentage parameter
  const handleLengthAdjust = async (action: 'shorten' | 'expand', percentage: number = 50) => {
    if (!selectedText.trim()) {
      alert(`Please select text to ${action}`);
      return;
    }

    setIsProcessing(true);
    
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
    } catch (error) {
      console.error(`Error ${action}ing text:`, error);
      setIsProcessing(false);
      alert(`An error occurred while ${action}ing the text.`);
    }
  };

  // Handle editor content changes
  const handleEditorChange = (html: string, raw: any) => {
    setEditorContent(html);
    setEditorRawContent(raw);
  };

  // Function to get selected text from editor
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const text = selection.toString();
      setSelectedText(text);
      setShowFormatWidget(text.trim().length > 0);
    } else {
      setShowFormatWidget(false);
    }
  };

  // Function to handle loading a draft
  const handleLoadDraft = async (draftId: string) => {
    setSaveStatus("Loading draft...");
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
      
      setSaveStatus("Draft loaded successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error loading draft:", error);
      setSaveStatus("Error loading draft");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Add event listener for text selection
  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Writing Assistant</h1>
          <DraftsManager 
            userId={getMockUserId()} 
            onLoadDraft={handleLoadDraft} 
          />
        </div>
        <p className="text-gray-500 mt-1 mb-4">
          Write, edit, and improve your text with AI assistance. Powered by Gemini 2.5 Flash.
        </p>
        <div className="flex items-center mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
            Gemini 2.5 Flash
          </span>
          <span className="text-xs text-gray-500">
            Enhanced paraphrasing, grammar checking, and text improvement
          </span>
        </div>
        {saveStatus && (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md mb-4 animate-fade-in">
            {saveStatus}
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Editor */}
        <div className={`flex-1 p-6 pt-0 overflow-auto transition-all ${collapseSuggestions ? 'w-full' : 'md:w-3/5'}`}>
          <Card className="h-full shadow-sm">
            <CardHeader className="p-0">
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
            <CardContent className="p-0 flex flex-col">
              <div onMouseUp={handleTextSelection} className="h-full flex-grow">
                <RichTextEditor
                  onChange={handleEditorChange}
                  height="calc(100vh - 240px)"
                  onSelectedTextChange={setSelectedText}
                  setEditorRef={setEditorRef}
                />
              </div>
              <div className="py-2 px-4 border-t">
                <WordCounter text={editorContent} />
              </div>
            </CardContent>
        </Card>
        </div>

        {/* Collapse/Expand Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="h-12 w-6 p-0"
            onClick={() => setCollapseSuggestions(!collapseSuggestions)}
          >
            {collapseSuggestions ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>

        {/* Right Panel - Suggestions */}
        {!collapseSuggestions && (
          <div className="md:w-2/5 p-6 pt-0 overflow-auto">
            <AISuggestionsPanel
              selectedText={selectedText}
              onAccept={handleAcceptSuggestion}
              onReject={handleRejectSuggestion}
              onClear={handleClearSuggestions}
              isProcessing={isProcessing}
              suggestedText={suggestedText}
              grammarIssues={grammarIssues}
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
      
      {/* Floating format widget */}
      <FloatingFormatWidget
        onParaphrase={handleParaphrase}
        onToneChange={handleToneChange}
        onShorten={() => openLengthAdjustDialog('shorten')}
        onExpand={() => openLengthAdjustDialog('expand')}
        selectedText={selectedText}
        selectedTone={tone}
        isVisible={showFormatWidget}
      />
    </div>
  )
}

export default WritingPage