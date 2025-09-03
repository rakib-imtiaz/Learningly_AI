// lib/openai.ts
import OpenAI from "openai";

export const openai = new OpenAI({ 
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY 
});

export const DEFAULT_MODEL = "gpt-4o-mini"; // fast, low-cost, great for JSON+chat
