import { NextResponse } from "next/server";
import { z } from "zod";
import { RESPONSIBILITIES } from "@/content/responsibilities";
import { tagsFromHighlight } from "@/lib/highlightKeywords";

// Zod schemas for input/output validation
const InputSchema = z.object({
  role: z.string().min(1),
  roleFamily: z.enum(["bar", "service", "frontdesk", "coffee", "kitchen", "management"]),
  shineKeys: z.array(z.string()).min(1).max(3),
  busyKeys: z.array(z.string()).min(1).max(4),
  vibeKey: z.string().optional(),
  selectedHighlight: z.string().optional(),
  maxSelection: z.number().min(1).max(20).default(15),
});

const OutputSchema = z.object({
  groups: z.array(z.object({
    id: z.string(),
    title: z.string(),
    items: z.array(z.object({
      id: z.string(),
      label: z.string(),
    })),
  })),
  pinned: z.array(z.string()),
  recommendedMix: z.array(z.string()),
});

type Input = z.infer<typeof InputSchema>;
type Output = z.infer<typeof OutputSchema>;

/**
 * Rank responsibilities based on onboarding signals
 * Scoring weights: shine=3, busy=2, vibe=1, highlightTags=3
 */
function rankResponsibilities(
  groups: Array<{ id: string; title: string; items: Array<{ id: string; label: string; tags: string[] }> }>,
  shineKeys: string[],
  busyKeys: string[],
  vibeKey?: string,
  selectedHighlight?: string
): {
  rankedGroups: Array<{ id: string; title: string; items: Array<{ id: string; label: string; score: number }> }>;
  pinned: string[];
  recommendedMix: string[];
} {
  // Extract highlight keywords
  const highlightTags = selectedHighlight ? tagsFromHighlight(selectedHighlight) : [];

  // Score and rank items
  const scoredGroups = groups.map(group => ({
    ...group,
    items: group.items.map(item => {
      let score = 0;
      
      // Shine keys get highest weight (3)
      shineKeys.forEach(key => {
        if (item.tags.includes(key)) score += 3;
      });
      
      // Busy keys get medium weight (2)
      busyKeys.forEach(key => {
        if (item.tags.includes(key)) score += 2;
      });
      
      // Vibe key gets lowest weight (1)
      if (vibeKey && item.tags.includes(vibeKey)) {
        score += 1;
      }
      
      // Highlight keywords get high weight (3)
      highlightTags.forEach(tag => {
        if (item.tags.includes(tag)) score += 3;
      });
      
      return { ...item, score };
    }).sort((a, b) => b.score - a.score), // Sort by score descending
  }));

  // Get pinned items (top 15 overall)
  const allItems = scoredGroups.flatMap(group => group.items);
  const pinned = allItems
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(item => item.id);

  // Get recommended mix (highest scoring groups for balance)
  const groupScores = scoredGroups.map(group => ({
    id: group.id,
    avgScore: group.items.reduce((sum, item) => sum + item.score, 0) / group.items.length,
  }));
  groupScores.sort((a, b) => b.avgScore - a.avgScore);
  
  const recommendedMix = groupScores.slice(0, 3).map(group => group.id);

  return {
    rankedGroups: scoredGroups,
    pinned,
    recommendedMix,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = InputSchema.parse(body);
    
    // Get responsibilities for the role family
    const groups = RESPONSIBILITIES[input.roleFamily] || RESPONSIBILITIES.bar;
    
    // Rank responsibilities based on onboarding signals
    const { rankedGroups, pinned, recommendedMix } = rankResponsibilities(
      groups,
      input.shineKeys,
      input.busyKeys,
      input.vibeKey,
      input.selectedHighlight
    );
    
    // Prepare output
    const output: Output = {
      groups: rankedGroups.map(group => ({
        id: group.id,
        title: group.title,
        items: group.items.map(item => ({ 
          id: item.id, 
          label: item.label 
        })),
      })),
      pinned,
      recommendedMix,
    };
    
    // Validate output with Zod before returning
    const validatedOutput = OutputSchema.parse(output);
    
    return NextResponse.json(validatedOutput);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.message },
        { status: 400 }
      );
    }
    
    console.error("Responsibilities API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
