import { NewAnalysisWorkspace } from "@/components/intake/new-analysis-workspace";

export default function NewAnalysisPage() {
  return (
    <section className="space-y-6">
      <header className="app-page-hero">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_320px] xl:items-end">
          <div className="space-y-3">
            <p className="app-kicker">New Analysis</p>
            <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
              Analyze one job posting — fast, defensible first-pass
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-ink/74">
              Get a defensible first-pass decision for a single posting against the approved profile.
            </p>
            <p className="text-sm text-ink/60">Boundaries: single profile · fixed guardrails</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="app-hero-stat">
              <p className="app-mini-label">Mode</p>
              <p className="mt-2 text-base font-semibold text-ink">Competition-guided demo</p>
            </div>
            <div className="app-hero-stat">
              <p className="app-mini-label">Outcome</p>
              <p className="mt-2 text-base font-semibold text-ink">Defensible first-pass decision</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex gap-3">
              <button className="app-button-primary">Try the demo</button>
              <button className="app-button-secondary">Enter a job manually</button>
            </div>
            <div className="flex gap-4 items-center text-sm text-ink/72">
              <div className="px-3 py-2 rounded-lg bg-muted/5">✅ Uses approved profile</div>
              <div className="px-3 py-2 rounded-lg bg-muted/5">🔎 No invented fields</div>
              <div className="px-3 py-2 rounded-lg bg-muted/5">🧾 Audit trail retained</div>
            </div>
          </div>
        </div>
      </header>

      <NewAnalysisWorkspace />
    </section>
  );
}
