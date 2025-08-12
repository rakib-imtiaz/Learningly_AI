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
    if (initialContent && !editorState.getCurrentContent().hasText()) {
      const contentBlock = htmlToDraft(initialContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [initialContent]);
  
  // Track selected text
  useEffect(() => {
    const handleSelectionChange = () => {
      if (onSelectedTextChange) {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          onSelectedTextChange(selection.toString());
        }
      }
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
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

  // Configure toolbar options for the editor
  const toolbarOptions = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'history'],
    inline: {
      inDropdown: false,
      options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'],
    },
    blockType: {
      inDropdown: true,
      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
    },
    fontSize: {
      inDropdown: true,
      options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48],
      className: 'font-size-dropdown',
    },
    fontFamily: {
      inDropdown: true,
      options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    },
    list: {
      inDropdown: false,
      options: ['unordered', 'ordered', 'indent', 'outdent'],
    },
    textAlign: {
      inDropdown: false,
      options: ['left', 'center', 'right', 'justify'],
    },
    colorPicker: {
      colors: ['rgb(0,0,0)', 'rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 
               'rgb(44,130,201)', 'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 
               'rgb(65,168,95)', 'rgb(0,168,133)', 'rgb(61,142,185)', 'rgb(41,105,176)', 
               'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(247,218,100)', 'rgb(251,160,38)', 
               'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)', 'rgb(239,239,239)', 
               'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)', 
               'rgb(124,112,107)', 'rgb(209,213,216)'],
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
