"use client";

import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Card, CardContent } from "@/components/ui/card";

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (html: string, raw: any) => void;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
  onSelectedTextChange?: (selectedText: string) => void;
  setEditorRef?: (ref: any) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = "",
  onChange,
  placeholder = "Start writing or paste text here...",
  height = "400px",
  readOnly = false,
  onSelectedTextChange,
  setEditorRef,
}) => {
  // Create a reference to the editor
  const editorRef = React.useRef<any>(null);
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      const contentBlock = htmlToDraft(initialContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  // Set editor reference for parent components to use
  useEffect(() => {
    if (setEditorRef) {
      setEditorRef({
        getEditorState: () => editorState,
        setEditorState,
        getEditorInstance: () => editorRef.current?.editor,
      });
    }
  }, [setEditorRef, editorState]);
  
  // Update editor content when initialContent changes
  useEffect(() => {
    if (initialContent) {
      const contentBlock = htmlToDraft(initialContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    }
  }, [initialContent]);
  
  // Track selected text - using a more stable approach
  useEffect(() => {
    if (!onSelectedTextChange) return;
    
    const handleSelectionChange = () => {
      // Add a small delay to ensure selection is stable
      setTimeout(() => {
        if (typeof window === 'undefined') return; // SSR guard
        
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          onSelectedTextChange(selection.toString().trim());
        }
      }, 50);
    };
    
    // Use selectionchange event which is more reliable
    if (typeof document !== 'undefined') {
      document.addEventListener('selectionchange', handleSelectionChange);
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('selectionchange', handleSelectionChange);
      }
    };
  }, [onSelectedTextChange]);

  const onEditorStateChange = (newState: EditorState) => {
    setEditorState(newState);
    
    if (onChange) {
      const rawContent = convertToRaw(newState.getCurrentContent());
      const html = draftToHtml(rawContent);
      onChange(html, rawContent);
    }
  };

  // Configure simplified toolbar options for the editor
  const toolbarOptions = {
    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'history'],
    inline: {
      inDropdown: false,
      options: ['bold', 'italic', 'underline', 'strikethrough'],
    },
    blockType: {
      inDropdown: true,
      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
      className: 'blocktype-dropdown',
    },
    fontSize: {
      inDropdown: true,
      options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48],
      className: 'fontsize-dropdown',
    },
    list: {
      inDropdown: false,
      options: ['unordered', 'ordered', 'indent', 'outdent'],
    },
    textAlign: {
      inDropdown: false,
      options: ['left', 'center', 'right', 'justify'],
    },
    link: {
      inDropdown: false,
      showOpenOptionOnHover: true,
      defaultTargetOption: '_blank',
    },
  };

  return (
    <Card className="w-full border shadow-sm flex flex-col">
      <CardContent className="p-0 flex-grow flex flex-col">
        <div
          className={`editor-wrapper ${readOnly ? "read-only" : ""} flex-grow flex flex-col`}
          style={{ 
            height: height,
            maxHeight: height,
            overflow: "hidden" 
          }}
        >
          <Editor
            ref={editorRef}
            editorState={editorState}
            toolbarClassName="toolbar-class"
            wrapperClassName="wrapper-class flex-grow flex flex-col"
            editorClassName="editor-class p-4 flex-grow overflow-auto"
            onEditorStateChange={onEditorStateChange}
            placeholder={placeholder}
            readOnly={readOnly}
            toolbar={toolbarOptions}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
