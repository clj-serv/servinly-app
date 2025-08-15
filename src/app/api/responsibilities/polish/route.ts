import { NextResponse } from "next/server";
import { z } from "zod";

const InputSchema = z.object({
  role: z.string().min(1),
  selected: z.array(z.object({
    id: z.string(),
    label: z.string(),
  })).min(1),
});

const OutputSchema = z.object({
  polished: z.array(z.object({
    id: z.string(),
    label: z.string(),
  })),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = InputSchema.parse(body);
    
    const { role, selected } = input;
    
    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Return input as-is if no AI available
      return NextResponse.json({ polished: selected });
    }
    
    try {
      // OpenAI prompt for polishing
      const systemPrompt = `You polish hospitality responsibility descriptions to be more impactful and resume-ready. Keep the same meaning but make them more professional and action-oriented. Return JSON only: {"polished":[{"id":"...","label":"..."}]}.`;
      
      const userPrompt = JSON.stringify({
        role,
        selected,
        instructions: "Polish these responsibility descriptions to be more professional and impactful while keeping the same core meaning."
      });
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          max_tokens: 300,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (content) {
          try {
            const parsed = JSON.parse(content);
            if (parsed.polished && Array.isArray(parsed.polished)) {
              // Validate and return polished results
              const polished = parsed.polished
                .filter((p: any) => p.id && p.label && typeof p.label === 'string')
                .map((p: any) => ({
                  id: p.id,
                  label: p.label.trim(),
                }));
              
              const result = OutputSchema.parse({ polished });
              return NextResponse.json(result);
            }
          } catch (parseError) {
            console.warn("Failed to parse AI response:", parseError);
          }
        }
      }
    } catch (aiError) {
      console.warn("AI polishing failed:", aiError);
    }
    
    // Fallback: return input as-is
    return NextResponse.json({ polished: selected });
    
  } catch (error) {
    console.error("Polish API error:", error);
    return NextResponse.json(
      { error: "Failed to polish responsibilities" },
      { status: 400 }
    );
  }
}
