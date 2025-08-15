import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // ensure Node (Edge cannot read process.env safely)

// Relaxed Zod schema with nullable optionals
const YM = z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM");
const nullableYM = z.union([YM, z.literal(""), z.null(), z.undefined()]).transform(v => (!v || v === "" ? null : v));

const Body = z.object({
  userId: z.string().uuid(),
  signals: z.object({
    roleId: z.string().min(1),
    roleFamily: z.string().min(1),
    shineKeys: z.array(z.string()).max(3).default([]),
    busyKeys: z.array(z.string()).max(2).default([]),
    vibeKey: z.string().optional().nullable(),
    orgName: z.string().optional().nullable(),
    startDate: nullableYM,
    endDate: nullableYM,
    highlightText: z.string().optional().nullable(),
    responsibilities: z.array(z.string()).default([]),
  }).strict(),
});

function getServerEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return { error: "MISSING_ENV" };
  }
  if (url.includes("<your-ref>") || (serviceKey ?? "").includes("<service_role_key>")) {
    return { error: "PLACEHOLDER_ENV" };
  }
  return { url, serviceKey };
}

export async function POST(req: Request) {
  try {
    if (process.env.NODE_ENV === "production") {
      return new Response("Not Found", { status: 404 });
    }

    const envResult = getServerEnv();
    if ('error' in envResult) {
      return new Response(JSON.stringify({ ok: false, error: "BAD_REQUEST", reason: envResult.error }), { status: 400 });
    }
    const { url, serviceKey } = envResult;

    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ ok: false, error: "BAD_REQUEST", details: parsed.error.flatten() }), { status: 400 });
    }
    const { userId, signals } = parsed.data;

    // map to DB
    const payload = {
      user_id: userId,
      role_id: signals.roleId,
      role_family: signals.roleFamily,
      org_name: signals.orgName ?? null,
      start_ym: signals.startDate, // already null-or-YYYY-MM
      end_ym: signals.endDate,
      highlight_text: signals.highlightText ?? null,
      responsibilities: signals.responsibilities ?? [],
      shine_keys: signals.shineKeys ?? [],
      busy_keys: signals.busyKeys ?? [],
      vibe_key: signals.vibeKey ?? null,
      status: "final",
    };

    const supabase = createServiceClient(url, serviceKey);
    const { data, error } = await supabase
      .from("user_roles")
      .insert(payload)
      .select("id")
      .single();
    if (error) return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ ok: true, id: data.id }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? "INTERNAL_ERROR" }), { status: 500 });
  }
}

function createServiceClient(url: string, key: string) {
  // tiny helper to avoid inlining createClient everywhere
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
