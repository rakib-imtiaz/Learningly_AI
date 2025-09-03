'use client';

import React, { useState } from 'react';
import { Highlight } from './highlight-context';
import { convertPercentageToPixels } from '@/lib/highlight-utils';
import { Pulse } from '@/components/react-bits/pulse';

interface PageHighlightOverlayProps {
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
  highlights: Highlight[];
  onRemoveHighlight: (id: string) => void;
  onQuestionRequest?: (highlight: Highlight) => void;
}

export function PageHighlightOverlay({
  pageNumber,
  pageWidth,
  pageHeight,
  highlights,
  onRemoveHighlight,
  onQuestionRequest,
}: PageHighlightOverlayProps) {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const longPressDelay = 500; // 500ms for long press

  const pageHighlights = highlights.filter(h => h.pageNumber === pageNumber);

  if (pageHighlights.length === 0) {
    return null;
  }

  const handleContextMenu = (e: React.MouseEvent, highlight: Highlight) => {
    e.preventDefault();
    if (onQuestionRequest) {
      onQuestionRequest(highlight);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, highlight: Highlight) => {
    const timer = setTimeout(() => {
      if (onQuestionRequest) {
        onQuestionRequest(highlight);
      }
    }, longPressDelay);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {pageHighlights.map((highlight) => (
        <div key={highlight.id}>
          {highlight.rects.map((rect, rectIndex) => {
            const pixelRects = convertPercentageToPixels([rect], pageWidth, pageHeight);
            const pixelRect = pixelRects[0];
            const hasQuestion = highlight.question;
            
            return (
              <div
                key={`${highlight.id}-${rectIndex}`}
                className="absolute rounded-sm pointer-events-none transition-all duration-200 group"
                style={{
                  left: pixelRect.left,
                  top: pixelRect.top,
                  width: pixelRect.width,
                  height: pixelRect.height,
                  backgroundColor: highlight.color,
                  opacity: 0.4,
                }}
                title={`Highlight: "${highlight.selectedText.substring(0, 50)}${highlight.selectedText.length > 50 ? '...' : ''}"`}
              >
                {/* Question indicator - shows if highlight has a question */}
                {hasQuestion && (
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs pointer-events-none">
                    <Pulse>
                      <span className="text-[10px]">?</span>
                    </Pulse>
                  </div>
                )}

                {/* Question affordance - visible on hover/touch */}
                <div 
                  className="absolute -bottom-1 -left-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px]"
                  onClick={() => onQuestionRequest?.(highlight)}
                  onContextMenu={(e) => handleContextMenu(e, highlight)}
                  onTouchStart={(e) => handleTouchStart(e, highlight)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                  title="Ask question about this highlight"
                >
                  ?
                </div>

                {/* Delete affordance - only visible on hover */}
                <div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 pointer-events-auto cursor-pointer transition-opacity duration-200 min-h-[44px] min-w-[44px]"
                  onClick={() => onRemoveHighlight(highlight.id)}
                  title="Remove highlight"
                >
                  ×
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
