import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Request: context from onboarding so we can tailor suggestions.
 */
const ReqSchema = z.object({
  role: z.string().optional(),
  traits: z.array(z.string()).optional(),
  scenario: z.string().optional(),
  vibe: z.string().optional(),
});

const ResSchema = z.object({
  suggestions: z.array(z.string().min(8)).min(6).max(12),
});

const FALLBACK = [
  "Created a signature cocktail that became a customer favorite",
  "Managed the bar during high‑volume events without delays",
  "Trained and mentored new bartending staff",
  "Introduced upselling techniques that boosted drink sales",
  "Designed and implemented a seasonal drinks menu",
  "Recognized for exceptional customer service",
  "Handled VIP guests with professionalism and discretion",
  "Reduced wastage through improved inventory management",
  "Maintained a spotless, organized bar throughout service",
  "Received positive reviews mentioning my bartending skills",
];

/**
 * Deterministic prompt -> JSON suggestions (OpenAI), but we always validate and
 * fallback to a safe set if anything goes wrong.
 */
export async function POST(req: Request) {
  console.log("🚨 POST function called!"); // Debug log
  
  try {
    const body = await req.json().catch(() => ({}));
    const input = ReqSchema.parse(body);

    console.log("🔍 Input received:", input);

    // If no API key, return fallback immediately
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log("❌ No API key, returning fallback");
      return NextResponse.json({ suggestions: FALLBACK });
    }

    console.log("✅ API key found, calling OpenAI...");
    console.log("🔍 API Key length:", apiKey.length);
    console.log(" API Key preview:", apiKey.substring(0, 10) + "...");
    
    // ---- OpenAI JSON generation ----
    const prompt = [
      `You are generating concise, resume-quality career highlight suggestions for hospitality roles.`,
      `Return STRICT JSON ONLY with the shape {"suggestions": string[]}.`,
      `Each suggestion: 8–14 words, action-led, specific, employer-friendly.`,
      `Avoid first-person. No emojis. No duplicated lines.`,
      `Context (optional):`,
      `role: ${input.role ?? "unknown"},`,
      `traits: ${input.traits?.join(", ") ?? "n/a"},`,
      `scenario: ${input.scenario ?? "n/a"},`,
      `vibe: ${input.vibe ?? "n/a"}.`,
      `Generate 8–10 suggestions relevant to the role.`,
    ].join("\n");

    console.log("🔍 Prompt being sent to OpenAI:", prompt);

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You return strict JSON only." },
          { role: "user", content: prompt },
        ],
      }),
    });

    console.log("🔍 OpenAI response status:", r.status);
    console.log(" OpenAI response ok:", r.ok);

    if (!r.ok) {
      // Network/limit/etc → fallback
      console.log("❌ OpenAI request failed, returning fallback");
      const errorText = await r.text();
      console.log("🔍 Error details:", errorText);
      return NextResponse.json({ suggestions: FALLBACK });
    }

    const data = await r.json();
    console.log("🔍 OpenAI response data:", JSON.stringify(data, null, 2));
    
    const raw = data.choices?.[0]?.message?.content ?? "{}";
    console.log("🔍 Raw content from OpenAI:", raw);
    
    const parsed = JSON.parse(raw);
    console.log("🔍 Parsed JSON:", parsed);
    
    const validated = ResSchema.safeParse(parsed);
    if (!validated.success) {
      console.log("❌ Validation failed, returning fallback");
      console.log("🔍 Validation errors:", validated.error);
      return NextResponse.json({ suggestions: FALLBACK });
    }

    console.log("✅ Successfully returning AI suggestions");
    return NextResponse.json(validated.data);
  } catch (error) {
    console.log("❌ Exception occurred:", error);
    return NextResponse.json({ suggestions: FALLBACK });
  }
}

export async function GET() {
  // Simple test endpoint to check environment variables
  return NextResponse.json({
    hasApiKey: !!process.env.OPENAI_API_KEY,
    apiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    apiKeyPreview: process.env.OPENAI_API_KEY ? 
      `${process.env.OPENAI_API_KEY.substring(0, 10)}...` : 
      'none',
    testVar: process.env.TEST_VAR || 'not set',
    timestamp: new Date().toISOString()
  });
}