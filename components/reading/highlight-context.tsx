'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { generateHighlightId, getHighlightStorageKey } from '@/lib/highlight-utils';

export interface HighlightRect {
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
}

export interface Highlight {
  id: string;
  pageNumber: number;
  rects: HighlightRect[];
  selectedText: string;
  color: string;
  createdAt: Date;
  question?: string;
  questionId?: string;
}

interface HighlightState {
  highlights: Highlight[];
  isLoading: boolean;
  error: string | null;
}

type HighlightAction =
  | { type: 'ADD_HIGHLIGHT'; payload: Highlight }
  | { type: 'REMOVE_HIGHLIGHT'; payload: string }
  | { type: 'ADD_QUESTION_TO_HIGHLIGHT'; payload: { highlightId: string; question: string; questionId: string } }
  | { type: 'REMOVE_QUESTION_FROM_HIGHLIGHT'; payload: string }
  | { type: 'LOAD_HIGHLIGHTS'; payload: Highlight[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: HighlightState = {
  highlights: [],
  isLoading: false,
  error: null,
};

function highlightReducer(state: HighlightState, action: HighlightAction): HighlightState {
  switch (action.type) {
    case 'ADD_HIGHLIGHT':
      return {
        ...state,
        highlights: [...state.highlights, action.payload],
        error: null,
      };
    case 'REMOVE_HIGHLIGHT':
      return {
        ...state,
        highlights: state.highlights.filter(h => h.id !== action.payload),
        error: null,
      };
    case 'ADD_QUESTION_TO_HIGHLIGHT':
      return {
        ...state,
        highlights: state.highlights.map(h => 
          h.id === action.payload.highlightId 
            ? { ...h, question: action.payload.question, questionId: action.payload.questionId }
            : h
        ),
        error: null,
      };
    case 'REMOVE_QUESTION_FROM_HIGHLIGHT':
      return {
        ...state,
        highlights: state.highlights.map(h => 
          h.id === action.payload 
            ? { ...h, question: undefined, questionId: undefined }
            : h
        ),
        error: null,
      };
    case 'LOAD_HIGHLIGHTS':
      return {
        ...state,
        highlights: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

interface HighlightContextType {
  state: HighlightState;
  addHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => void;
  removeHighlight: (id: string) => void;
  addQuestionToHighlight: (highlightId: string, question: string, questionId: string) => void;
  removeQuestionFromHighlight: (highlightId: string) => void;
  getHighlightsForPage: (pageNumber: number) => Highlight[];
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

interface HighlightProviderProps {
  children: React.ReactNode;
  documentUrl: string;
}

export function HighlightContextProvider({ children, documentUrl }: HighlightProviderProps) {
  const [state, dispatch] = useReducer(highlightReducer, initialState);

  const storageKey = getHighlightStorageKey(documentUrl);

  // Load highlights from localStorage on mount
  useEffect(() => {
    if (!documentUrl) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const highlights = JSON.parse(saved).map((h: any) => ({
          ...h,
          createdAt: new Date(h.createdAt),
        }));
        dispatch({ type: 'LOAD_HIGHLIGHTS', payload: highlights });
      } else {
        dispatch({ type: 'LOAD_HIGHLIGHTS', payload: [] });
      }
    } catch (error) {
      console.error('Failed to load highlights:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load highlights' });
      toast({
        title: 'Error',
        description: 'Failed to load saved highlights',
        variant: 'destructive',
      });
    }
  }, [documentUrl, storageKey]);

  // Save highlights to localStorage whenever they change
  useEffect(() => {
    if (!documentUrl || state.isLoading) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(state.highlights));
    } catch (error) {
      console.error('Failed to save highlights:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save highlights' });
      toast({
        title: 'Error',
        description: 'Failed to save highlights',
        variant: 'destructive',
      });
    }
  }, [state.highlights, documentUrl, storageKey, state.isLoading]);

  const addHighlight = (highlightData: Omit<Highlight, 'id' | 'createdAt'>) => {
    const newHighlight: Highlight = {
      ...highlightData,
      id: generateHighlightId(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_HIGHLIGHT', payload: newHighlight });
  };

  const removeHighlight = (id: string) => {
    dispatch({ type: 'REMOVE_HIGHLIGHT', payload: id });
  };

  const addQuestionToHighlight = (highlightId: string, question: string, questionId: string) => {
    dispatch({ 
      type: 'ADD_QUESTION_TO_HIGHLIGHT', 
      payload: { highlightId, question, questionId } 
    });
  };

  const removeQuestionFromHighlight = (highlightId: string) => {
    dispatch({ type: 'REMOVE_QUESTION_FROM_HIGHLIGHT', payload: highlightId });
  };

  const getHighlightsForPage = (pageNumber: number) => {
    return state.highlights.filter(h => h.pageNumber === pageNumber);
  };

  const value: HighlightContextType = {
    state,
    addHighlight,
    removeHighlight,
    addQuestionToHighlight,
    removeQuestionFromHighlight,
    getHighlightsForPage,
  };

  return (
    <HighlightContext.Provider value={value}>
      {children}
    </HighlightContext.Provider>
  );
}

export function useHighlights() {
  const context = useContext(HighlightContext);
  if (context === undefined) {
    throw new Error('useHighlights must be used within a HighlightContextProvider');
  }
  return context.state;
}

export function useHighlightActions() {
  const context = useContext(HighlightContext);
  if (context === undefined) {
    throw new Error('useHighlightActions must be used within a HighlightContextProvider');
  }
  return {
    addHighlight: context.addHighlight,
    removeHighlight: context.removeHighlight,
    addQuestionToHighlight: context.addQuestionToHighlight,
    removeQuestionFromHighlight: context.removeQuestionFromHighlight,
    getHighlightsForPage: context.getHighlightsForPage,
  };
}


