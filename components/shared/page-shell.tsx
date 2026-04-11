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
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="app-panel mb-8 overflow-hidden p-6 sm:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="app-kicker">
                Job Search OS MVP
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-[2.1rem]">
                Rules-first job analysis and weekly review
              </h1>
              <p className="max-w-xl text-sm leading-6 text-ink/72">
                Single-user scaffold for disciplined job intake, analysis,
                decision, and tracker follow-through.
              </p>
            </div>
            <nav className="flex flex-wrap gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="app-button-secondary px-4 py-2"
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
