"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  const pathname = usePathname();
  const isTrackerRoute = pathname === "/tracker" || pathname.startsWith("/tracker/");

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        {isTrackerRoute ? (
          <header className="app-brand-header-compact mb-2.5">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="app-brand-header-compact-label">MVP Demo</p>
                <p className="app-brand-header-compact-name">Job Search OS</p>
              </div>
              <p className="app-brand-header-compact-status">Saved Follow-Up</p>
            </div>
          </header>
        ) : (
          <header className="app-brand-header mb-5 text-center">
            <div className="mx-auto max-w-3xl space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-900/68">
                MVP Demo
              </p>
              <h1 className="app-brand-wordmark">
                Job <span className="app-brand-wordmark-search">Search</span> OS
              </h1>
              <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-emerald-400/65 to-transparent" />
              <p className="app-brand-process">
                Review <span className="px-1.5 text-emerald-700/70">&rarr;</span> Recommendation <span className="px-1.5 text-emerald-700/70">&rarr;</span> Saved Follow-Up
              </p>
            </div>
          </header>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

