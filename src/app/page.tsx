export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-2xl text-center px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
          <span>🚀 Servinly</span>
          <span className="opacity-70">is launching soon</span>
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Hospitality careers, upgraded.
        </h1>

        <p className="mt-4 text-gray-600">
          We’re crafting a smarter way to showcase your experience, surface your strengths,
          and connect you with great roles — all powered by AI.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="mailto:hello@servinly.com"
            className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring"
          >
            Contact us
          </a>
          <span className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 bg-white">
            Learn more (soon)
          </span>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          © {new Date().getFullYear()} Servinly. All rights reserved.
        </p>
      </div>
    </main>
  );
}