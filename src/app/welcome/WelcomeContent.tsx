// src/app/welcome/WelcomeContent.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import OnboardingShell from "@/components/layouts/OnboardingShell";
// If your client is exported elsewhere, adjust this path:
import { supabase } from "@/lib/supabaseClient";

type UserBits = { firstName?: string; email?: string };

export default function WelcomeContent() {
  const [{ firstName, email }, setUser] = useState<UserBits>({});

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        const rawName =
          (user?.user_metadata?.name as string | undefined) ??
          (user?.user_metadata?.full_name as string | undefined);
        const derivedFirst =
          rawName?.split(" ")?.[0] ||
          (user?.email ? user.email.split("@")[0] : undefined);

        if (ok) {
          setUser({
            firstName: derivedFirst ? cap(derivedFirst) : undefined,
            email: user?.email ?? undefined,
          });
        }
      } catch {
        // non-blocking; render generic welcome
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const title = `Welcome${firstName ? `, ${firstName}` : ""}! 👋`;

  return (
    <OnboardingShell title={title} subtitle="Let’s build your hospitality profile">
      {/* hero dot */}
      <div className="mx-auto mb-6 mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        <div className="h-5 w-5 rounded-full bg-blue-600" />
      </div>

      {/* info card */}
      <div className="rounded-2xl bg-blue-50 p-4 text-center shadow-sm ring-1 ring-inset ring-blue-100">
        <p className="text-sm leading-6 text-blue-700">
          In just a few quick steps, we&apos;ll create a tailored profile that shows off your
          strengths, experience, and personality — helping you stand out from the crowd
          and find the right opportunities faster.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <Link
                          href="#"
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 active:scale-[0.99]"
          aria-label="Get started with onboarding"
        >
          Get Started
        </Link>
      </div>

      {/* divider */}
      <hr className="my-8 border-t border-gray-100" />

      {/* email chip */}
      {email ? (
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-600">
            {email.charAt(0).toUpperCase()}
          </span>
          <span className="text-sm text-gray-500">{email}</span>
        </div>
      ) : null}
    </OnboardingShell>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}