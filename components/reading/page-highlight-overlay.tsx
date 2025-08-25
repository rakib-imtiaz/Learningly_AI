'use client';

import React from 'react';
import { Highlight } from './highlight-context';
import { convertPercentageToPixels } from '@/lib/highlight-utils';

interface PageHighlightOverlayProps {
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
  highlights: Highlight[];
  onRemoveHighlight: (id: string) => void;
}

export function PageHighlightOverlay({
  pageNumber,
  pageWidth,
  pageHeight,
  highlights,
  onRemoveHighlight,
}: PageHighlightOverlayProps) {
  const pageHighlights = highlights.filter(h => h.pageNumber === pageNumber);

  if (pageHighlights.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {pageHighlights.map((highlight) => (
        <div key={highlight.id}>
          {highlight.rects.map((rect, rectIndex) => {
            const pixelRects = convertPercentageToPixels([rect], pageWidth, pageHeight);
            const pixelRect = pixelRects[0];
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
                {/* Delete affordance - only visible on hover */}
                <div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 pointer-events-auto cursor-pointer transition-opacity duration-200"
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
