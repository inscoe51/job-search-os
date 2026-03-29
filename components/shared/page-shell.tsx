import Link from "next/link";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/new-analysis", label: "New Analysis" },
  { href: "/tracker", label: "Tracker" }
];

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,111,95,0.14),_transparent_38%),linear-gradient(180deg,_#fbf8f1_0%,_#f1ede2_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-ink/10 bg-panel/95 p-6 shadow-card">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-ink/60">
                Job Search OS MVP
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Rules-first job analysis and weekly review
              </h1>
              <p className="text-sm leading-6 text-ink/75">
                Single-user scaffold for disciplined job intake, analysis,
                decision, and tracker follow-through.
              </p>
            </div>
            <nav className="flex flex-wrap gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-ink/10 bg-surface px-4 py-2 text-sm font-medium text-ink no-underline hover:border-accent hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
