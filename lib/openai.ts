// lib/openai.ts
import OpenAI from "openai";

export const openai = new OpenAI({ 
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '' 
});

export const DEFAULT_MODEL = "gpt-4o-mini"; // fast, low-cost, great for JSON+chat

// Helper function to get OpenAI client only at runtime
export function getOpenAIClient() {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error('NEXT_PUBLIC_OPENAI_API_KEY environment variable is required');
  }
  return new OpenAI({ 
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY 
  });
}
