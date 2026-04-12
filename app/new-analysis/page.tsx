import { NewAnalysisWorkspace } from "@/components/intake/new-analysis-workspace";

export default function NewAnalysisPage() {
  return (
    <section className="space-y-6">
      <header className="app-page-hero">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_320px] xl:items-end">
          <div className="space-y-3">
            <p className="app-kicker">Screen 1</p>
            <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
              New Analysis
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-ink/74">
              Review one structured posting against the approved candidate profile and
              guardrails, then route the result into the existing first-pass analysis flow.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="app-hero-stat">
              <p className="app-mini-label">Mode</p>
              <p className="mt-2 text-base font-semibold text-ink">Competition-guided demo</p>
            </div>
            <div className="app-hero-stat">
              <p className="app-mini-label">Boundaries</p>
              <p className="mt-2 text-base font-semibold text-ink">Single profile, fixed guardrails</p>
            </div>
            <div className="app-hero-stat">
              <p className="app-mini-label">Outcome</p>
              <p className="mt-2 text-base font-semibold text-ink">Defensible first-pass decision</p>
            </div>
          </div>
        </div>
      </header>
      <NewAnalysisWorkspace />
    </section>
  );
}
