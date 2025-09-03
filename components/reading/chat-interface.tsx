"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, FileText, Upload, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocument } from './document-context';
import { FadeContent } from '@/components/react-bits/fade-content';
import { ClickSpark } from '@/components/react-bits/click-spark';
import { ChatMessage } from '@/components/ui/chat-message';

interface ChipProps {
  text: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

function Chip({ text, onClick, icon }: ChipProps) {
  return (
    <ClickSpark>
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className="rounded-full text-sm px-4 py-2.5 hover:bg-blue-50 hover:text-blue-800 border-blue-200 text-blue-700 whitespace-nowrap flex items-center gap-2 transition-all duration-200 [&:hover]:text-blue-800 hover:shadow-md hover:scale-105 font-medium"
      >
        {icon}
        {text}
      </Button>
    </ClickSpark>
  );
}

export function ChatInterface() {
  const { messages, sendMessage, isLoading, document } = useDocument();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleChipClick = async (chipText: string) => {
    await sendMessage(chipText);
  };

  const quickActions = [
    {
      text: "Summarize this document",
      icon: <Sparkles className="h-3 w-3" />,
      action: "Summarize this document"
    },
    {
      text: "What are the key points?",
      icon: <BookOpen className="h-3 w-3" />,
      action: "What are the key points?"
    },
    {
      text: "Explain the main concepts",
      icon: <FileText className="h-3 w-3" />,
      action: "Explain the main concepts"
    },
    {
      text: "Create flashcards",
      icon: <Sparkles className="h-3 w-3" />,
      action: "Create flashcards from this document"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && !isLoading && (
          <FadeContent>
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                {document ? "Document loaded successfully! 🎉" : "Upload a document to start"}
              </h3>
              <p className="text-gray-600 text-sm mb-6 px-4 leading-relaxed">
                {document ? 
                  `I'm ready to help you with "${document.title}". Ask me anything or choose from the options below.` :
                  "Upload a document to start our conversation."
                }
              </p>
              
              {!document && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 mb-2 font-medium">💡 Try asking me math questions like:</p>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p>• "What is the quadratic formula?"</p>
                    <p>• "Explain Euler's identity"</p>
                    <p>• "How do I solve $x^2 + 5x + 6 = 0$?"</p>
                  </div>
                </div>
              )}
              
              {document ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {quickActions.map((action, index) => (
                      <Chip 
                        key={index}
                        text={action.text} 
                        onClick={() => handleChipClick(action.action)}
                        icon={action.icon}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    Or type your own question below
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">
                    No document loaded. Please upload a document to start chatting.
                  </p>
                </div>
              )}
            </div>
          </FadeContent>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
          >
            <ChatMessage 
              content={message.content}
              role={message.role}
            />
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={document ? `Ask me anything about "${document.title}"...` : "Upload a document to start chatting"}
            disabled={!document || isLoading}
            className="flex-1 text-sm rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading || !document}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        {!document && (
          <p className="text-sm text-gray-500 mt-2 text-center font-medium">
            Open a document to ask questions
          </p>
        )}
      </div>
    </div>
  );
}
