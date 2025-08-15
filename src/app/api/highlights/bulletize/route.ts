import { NextResponse } from "next/server";
import { z } from "zod";

// Input schema
const ReqSchema = z.object({
  text: z.string().min(1).max(600),
  role: z.string().optional(),
  maxBullets: z.number().min(1).max(5).default(3),
});

// Output schema
const ResSchema = z.object({
  bullets: z.array(z.string()),
  usedAI: z.boolean(),
});

// Action verbs for fallback bulletization
const ACTION_VERBS = [
  "Delivered", "Managed", "Created", "Implemented", "Developed",
  "Coordinated", "Streamlined", "Enhanced", "Optimized", "Established",
  "Facilitated", "Generated", "Improved", "Increased", "Reduced",
  "Trained", "Mentored", "Led", "Organized", "Executed"
];

/**
 * Deterministic fallback bulletizer that works without AI
 */
function createFallbackBullets(text: string, maxBullets: number): string[] {
  // Split by common sentence endings and clean
  const sentences = text
    .split(/[.!?;]\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .slice(0, maxBullets);

  const bullets: string[] = [];

  for (const sentence of sentences) {
    if (bullets.length >= maxBullets) break;

    // Clean the text
    let cleaned = sentence
      .replace(/^[-\s*•]*/, '') // Remove list markers
      .replace(/^[Ii]\s+(was\s+)?/, '') // Remove "I" and "I was"
      .trim();

    if (!cleaned) continue;

    // Capitalize first word
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

    // Check if it starts with a verb (basic check)
    const firstWord = cleaned.split(' ')[0].toLowerCase();
    const isVerb = ACTION_VERBS.some(verb => 
      verb.toLowerCase() === firstWord || 
      firstWord.endsWith('ed') || 
      firstWord.endsWith('ing')
    );

    // If not verb-led, prepend a neutral verb
    if (!isVerb) {
      cleaned = "Delivered " + cleaned;
    }

    // Clamp to ≤16 words
    const words = cleaned.split(' ');
    if (words.length > 16) {
      cleaned = words.slice(0, 16).join(' ');
    }

    // Remove trailing punctuation
    cleaned = cleaned.replace(/[.!?;]+$/, '');

    bullets.push(cleaned);
  }

  // Ensure we have at least one bullet
  if (bullets.length === 0) {
    bullets.push("Delivered exceptional service and results");
  }

  return bullets;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = ReqSchema.parse(body);

    const { text, role, maxBullets } = input;
    let bullets: string[];
    let usedAI = false;

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (apiKey) {
      try {
        // OpenAI prompt for JSON-only response
        const systemPrompt = `You rewrite hospitality career highlights into concise resume bullets. Rules: 1-3 bullets, each ≤16 words, action verb first, ATS-friendly, no pronouns/emojis. Return JSON only: {"bullets":["..."]}.`;

        const userPrompt = JSON.stringify({
          role: role || "Hospitality Professional",
          text: text,
          maxBullets: maxBullets
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
            max_tokens: 240,
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
              if (parsed.bullets && Array.isArray(parsed.bullets)) {
                // Validate and clean AI-generated bullets
                bullets = parsed.bullets
                  .filter((b: string) => typeof b === 'string' && b.trim().length > 0)
                  .map((b: string) => {
                    let bullet = b.trim();
                    // Ensure ≤16 words
                    const words = bullet.split(' ');
                    if (words.length > 16) {
                      bullet = words.slice(0, 16).join(' ');
                    }
                    return bullet;
                  })
                  .slice(0, maxBullets);
                
                usedAI = true;
              } else {
                throw new Error("Invalid AI response format");
              }
            } catch (parseError) {
              throw new Error("Failed to parse AI response");
            }
          } else {
            throw new Error("Empty AI response");
          }
        } else {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      } catch (aiError) {
        console.warn("AI bulletization failed, falling back to deterministic method:", aiError);
        // Fall through to deterministic method
      }
    }

    // Use fallback if AI failed or wasn't available
    if (!usedAI) {
      bullets = createFallbackBullets(text, maxBullets);
    }

    // Ensure we have valid bullets
    if (!bullets || bullets.length === 0) {
      bullets = ["Delivered exceptional service and results"];
    }

    const result = ResSchema.parse({ bullets, usedAI });
    return NextResponse.json(result);

  } catch (error) {
    console.error("Bulletize API error:", error);
    
    // Always return valid JSON even on error
    const fallbackBullets = createFallbackBullets(
      "Delivered exceptional service and results", 
      3
    );
    
    return NextResponse.json({
      bullets: fallbackBullets,
      usedAI: false
    });
  }
}
