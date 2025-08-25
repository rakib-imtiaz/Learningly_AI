import { HighlightRect } from '@/components/reading/highlight-context';

export interface SelectionData {
  text: string;
  rects: HighlightRect[];
}

/**
 * Convert ClientRect objects to percentage-based coordinates
 */
export function convertRectsToPercentage(
  rects: DOMRectList,
  pageContainer: HTMLElement
): HighlightRect[] {
  const containerRect = pageContainer.getBoundingClientRect();
  const percentageRects: HighlightRect[] = [];

  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    const percentageRect: HighlightRect = {
      x: (rect.left - containerRect.left) / containerRect.width,
      y: (rect.top - containerRect.top) / containerRect.height,
      width: rect.width / containerRect.width,
      height: rect.height / containerRect.height,
    };
    percentageRects.push(percentageRect);
  }

  return percentageRects;
}

/**
 * Convert percentage-based coordinates to pixel positions for rendering
 */
export function convertPercentageToPixels(
  percentageRects: HighlightRect[],
  pageWidth: number,
  pageHeight: number
): Array<{ left: string; top: string; width: string; height: string }> {
  return percentageRects.map(rect => ({
    left: `${rect.x * pageWidth}px`,
    top: `${rect.y * pageHeight}px`,
    width: `${rect.width * pageWidth}px`,
    height: `${rect.height * pageHeight}px`,
  }));
}

/**
 * Validate if a text selection meets minimum requirements
 */
export function validateSelection(selection: Selection): boolean {
  const text = selection.toString().trim();
  
  // Minimum text length
  if (text.length < 2) return false;
  
  // Check if selection is not just whitespace
  if (!/\S/.test(text)) return false;
  
  // Check if selection has valid range
  if (selection.rangeCount === 0) return false;
  
  const range = selection.getRangeAt(0);
  const rects = range.getClientRects();
  
  // Ensure at least one rect exists
  if (rects.length === 0) return false;
  
  return true;
}

/**
 * Generate a unique highlight ID
 */
export function generateHighlightId(): string {
  return `highlight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize selected text for storage
 */
export function sanitizeHighlightText(text: string): string {
  // Remove excessive whitespace and normalize
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Simple hash function for generating stable IDs
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate consistent localStorage key for highlights
 */
export function getHighlightStorageKey(documentUrl: string): string {
  const cleanUrl = documentUrl.split('?')[0];
  const id = simpleHash(cleanUrl);
  return `learningly-highlights-${id}`;
}

/**
 * Check if a selection is within the bounds of a container
 */
export function isSelectionInBounds(
  selection: Selection,
  container: HTMLElement
): boolean {
  if (selection.rangeCount === 0) return false;
  
  const containerRect = container.getBoundingClientRect();
  const range = selection.getRangeAt(0);
  const rects = range.getClientRects();
  
  // Ensure at least one rect is within the container bounds
  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    if (
      rect.left >= containerRect.left &&
      rect.right <= containerRect.right &&
      rect.top >= containerRect.top &&
      rect.bottom <= containerRect.bottom
    ) {
      return true;
    }
  }
  
  return false;
}

/**
 * Merge overlapping or adjacent highlight rectangles
 */
export function mergeHighlightRects(rects: HighlightRect[]): HighlightRect[] {
  if (rects.length <= 1) return rects;
  
  const sortedRects = [...rects].sort((a, b) => a.y - b.y || a.x - b.x);
  const merged: HighlightRect[] = [];
  
  for (const rect of sortedRects) {
    if (merged.length === 0) {
      merged.push(rect);
      continue;
    }
    
    const lastRect = merged[merged.length - 1];
    
    // Check if rectangles are on the same line and close enough to merge
    const sameLine = Math.abs(rect.y - lastRect.y) < 0.01; // 1% tolerance
    const adjacent = Math.abs(rect.x - (lastRect.x + lastRect.width)) < 0.02; // 2% tolerance
    
    if (sameLine && adjacent) {
      // Merge rectangles
      lastRect.width = rect.x + rect.width - lastRect.x;
      lastRect.height = Math.max(lastRect.height, rect.height);
    } else {
      merged.push(rect);
    }
  }
  
  return merged;
}
