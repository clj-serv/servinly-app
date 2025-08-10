// app/page.tsx – Production-only Coming Soon page (no debug text)
import { cookies } from 'next/headers';

export default function Page() {
  const isProd = process.env.VERCEL_ENV === 'production';
  const bypass = cookies().get('servinly_preview')?.value === '1';

  if (isProd && !bypass) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-6">
        <section className="max-w-xl text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold">Servinly</h1>
          <p className="text-neutral-300">
            We're building something innovative. Stay tuned — launching soon.
          </p>
        </section>
      </main>
    );
  }

  // Non-production (or bypass cookie set): render a minimal app shell for preview/dev
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="max-w-xl text-center space-y-2">
        <h1 className="text-xl font-medium">Servinly App (Preview/Dev)</h1>
        <p className="text-neutral-600 text-sm">Environment allows full app preview.</p>
      </section>
    </main>
  );
}