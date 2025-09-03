import { NextResponse } from "next/server";
import { openai, DEFAULT_MODEL } from "@/lib/openai";
import { MEME_TOOL_SYSTEM } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { topic = "Pointers" } = await req.json();

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: MEME_TOOL_SYSTEM },
        { role: "user", content: `topic: ${topic}` }
      ],
      temperature: 0.9,
    });

    const json = completion.choices[0]?.message?.content || "{}";
    return NextResponse.json(JSON.parse(json));
  } catch (error) {
    console.error("Meme error:", error);
    return NextResponse.json(
      { topText: "Error generating meme", bottomText: "Please try again" },
      { status: 500 }
    );
  }
}
