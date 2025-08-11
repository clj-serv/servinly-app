// src/app/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Servinly — Coming Soon",
  description: "We’re building something innovative. Stay tuned.",
};

export default function Page() {
  const isProd = process.env.VERCEL_ENV === "production";
  const bypass = cookies().get("servinly_preview")?.value === "1";

  // Show landing in production (unless you set servinly_preview=1 for yourself).
  if (isProd && !bypass) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-8">
        <section className="max-w-xl text-center space-y-5">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Servinly</h1>
          <p className="text-neutral-300 text-lg">
            We’re building something innovative. Launching soon.
          </p>
          <p className="text-neutral-400 text-sm">
            Want early access?{" "}
            <a
              href="mailto:hello@servinly.com?subject=Early%20Access"
              className="underline underline-offset-4"
            >
              hello@servinly.com
            </a>
          </p>
        </section>
      </main>
    );
  }

  // Preview/Dev: keep a minimal shell so your team can navigate features.
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <section className="max-w-xl text-center space-y-3">
        <h1 className="text-xl font-medium">Servinly App (Preview/Dev)</h1>
        <p className="text-neutral-600 text-sm">
          You’re in a non‑production environment.
        </p>
      </section>
    </main>
  );
}
