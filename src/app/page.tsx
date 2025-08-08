// app/page.tsx — production Coming Soon gate (no middleware needed)
// Renders "Coming Soon" on / when deployed to Vercel Production,
// unless a preview bypass cookie is present: servinly_preview=1
// Local dev & Vercel preview behave as normal app shell.

import { cookies } from 'next/headers';

const IS_PROD = process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production';

export default async function Page() {
  const bypass = cookies().get('servinly_preview')?.value === '1';

  if (IS_PROD && !bypass) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Servinly</h1>
          <p className="mt-4 text-lg opacity-90">
            We&apos;re building something innovative. Stay tuned — launching soon.
          </p>
          <p className="mt-6 text-sm opacity-70">
            (This Coming Soon screen only appears on production. Set cookie <code>servinly_preview=1</code> to bypass.)
          </p>
        </div>
      </main>
    );
  }

  // Non-production or bypass: render a very light app shell placeholder.
  // Replace this with your real app content as needed.
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center px-6 py-8">
        <h1 className="text-2xl font-semibold">Servinly App</h1>
        <p className="mt-3 text-base opacity-80">
          App shell loaded (non‑production or preview bypass). Replace with your home experience.
        </p>
      </div>
    </main>
  );
}
