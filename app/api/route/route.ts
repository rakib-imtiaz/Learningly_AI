import { NextResponse } from "next/server";
import { openai, DEFAULT_MODEL } from "@/lib/openai";
import { ROUTER_SYSTEM } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ROUTER_SYSTEM },
        ...history,
        { role: "user", content: message }
      ],
      temperature: 0
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const routed = JSON.parse(raw);
    return NextResponse.json(routed);
  } catch (error) {
    console.error("Router error:", error);
    return NextResponse.json(
      { action: "chat", params: {}, question: null },
      { status: 500 }
    );
  }
}
