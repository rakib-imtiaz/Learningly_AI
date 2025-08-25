'use client';

import { useEffect, useRef, useCallback } from 'react';
import { SelectionData, convertRectsToPercentage, sanitizeHighlightText, validateSelection, isSelectionInBounds } from '@/lib/highlight-utils';

interface UseTextSelectionProps {
  pageRef: React.RefObject<HTMLElement>;
  onHighlightCreate: (selection: SelectionData) => void;
}

export function useTextSelection({
  pageRef,
  onHighlightCreate,
}: UseTextSelectionProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseUp = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const selection = window.getSelection();
      
      if (!selection || !pageRef.current) return;
      
      const text = selection.toString().trim();
      
      if (!validateSelection(selection)) return;
      
      if (!isSelectionInBounds(selection, pageRef.current)) return;
      
      const range = selection.getRangeAt(0);
      const rects = range.getClientRects();
      
      if (rects.length === 0) return;
      
      const percentageRects = convertRectsToPercentage(rects, pageRef.current);
      
      if (percentageRects.length === 0) return;
      
      const selectionData: SelectionData = {
        text: sanitizeHighlightText(text),
        rects: percentageRects,
      };
      
      onHighlightCreate(selectionData);
      
      // Clear the selection
      selection.removeAllRanges();
    }, 150); // 150ms debounce
  }, [pageRef, onHighlightCreate]);

  useEffect(() => {
    const pageElement = pageRef.current;
    if (!pageElement) return;

    pageElement.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      pageElement.removeEventListener('mouseup', handleMouseUp);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [pageRef, handleMouseUp]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
}


