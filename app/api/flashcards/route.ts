import { NextResponse } from "next/server";
import { openai, DEFAULT_MODEL } from "@/lib/openai";
import { FLASHCARDS_TOOL_SYSTEM } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { topic = "C programming basics", count = 8, difficulty = "easy" } = await req.json();

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: FLASHCARDS_TOOL_SYSTEM },
        { role: "user", content: `Create ${count} cards on "${topic}" (difficulty: ${difficulty}).` }
      ],
      temperature: 0.6,
    });

    const json = completion.choices[0]?.message?.content || "{}";
    return NextResponse.json(JSON.parse(json));
  } catch (error) {
    console.error("Flashcards error:", error);
    return NextResponse.json(
      { cards: [] },
      { status: 500 }
    );
  }
}
