import { NextResponse } from "next/server";
import { z } from "zod";
import type { TOnboardingSignals } from "@/contracts/onboarding";

const AssessSchema = z.object({
  userId: z.string(),
  signals: z.object({
    roleId: z.string(),
    roleFamily: z.string(),
    shineKeys: z.array(z.string()),
    busyKeys: z.array(z.string()),
    vibeKey: z.string().optional(),
    highlightText: z.string().optional(),
    responsibilities: z.array(z.string())
  }),
  schema: z.enum(["big5a@v1", "hexaco@v1"])
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = AssessSchema.parse(body);
    
    // Deterministic assessment first
    const assessment = {
      userId: input.userId,
      schema: input.schema,
      scores: {
        openness: 0.7,
        conscientiousness: 0.8,
        extraversion: 0.6,
        agreeableness: 0.7,
        neuroticism: 0.3
      },
      traits: ["detail-oriented", "customer-focused", "reliable"]
    };
    
    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json(
      { error: "Assessment failed" },
      { status: 500 }
    );
  }
}
