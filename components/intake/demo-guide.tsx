"use client";

import type { DemoScenarioSummary, DemoScenarioId } from "@/lib/demo/sample-job-posting";

type DemoGuideProps = {
  scenarios: DemoScenarioSummary[];
  selectedScenarioId: DemoScenarioId | null;
  onLoadScenario: (scenarioId: DemoScenarioId) => void;
};

const tuningPoints = [
  "Single candidate profile",
  "Operations and coordination-focused roles",
  "Evidence-first fit analysis",
  "Life-fit and schedule guardrails",
  "No invented qualifications or inflated claims"
];

export function DemoGuide({
  scenarios,
  selectedScenarioId,
  onLoadScenario
}: DemoGuideProps) {
  return (
    <section className="app-accent-panel space-y-6 p-6 sm:p-7">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_320px] xl:items-start">
        <div className="space-y-3">
          <p className="app-kicker">Demo Guide</p>
          <h2 className="max-w-3xl text-2xl font-semibold text-ink sm:text-[2rem]">
            Competition-ready guided testing
          </h2>
          <p className="app-copy">
            This prototype translates a structured ChatGPT-built project framework
            into a working app experience. It is intentionally tuned to one
            candidate profile, one approved set of guardrails, and evidence-first
            decision rules.
          </p>
        </div>
        <div className="app-callout">
          <p className="app-mini-label">Judge Path</p>
          <p className="mt-2 text-sm leading-6 text-ink/78">
            Use a seeded scenario below to populate the live intake flow, then run
            analysis exactly as a judge would.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="app-subpanel space-y-3 p-5 sm:p-6">
          <div className="space-y-1">
            <p className="app-kicker">About This Demo</p>
            <h3 className="text-xl font-semibold text-ink">Structured prototype, bounded scope</h3>
          </div>
          <p className="app-copy">
            The app is designed to show how a constrained job-search operating
            system can turn a vetted project framework into a credible first-pass
            analysis experience without expanding into unsupported product scope.
          </p>
        </section>

        <section className="app-subpanel space-y-3 p-5 sm:p-6">
          <div className="space-y-1">
            <p className="app-kicker">What This Engine Is Tuned For</p>
            <h3 className="text-xl font-semibold text-ink">Core guardrails at a glance</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {tuningPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-line/60 bg-panel/88 px-4 py-3 text-sm font-medium text-ink/82 shadow-sm"
              >
                {point}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="space-y-3">
        <div className="space-y-1">
          <p className="app-kicker">Try Me</p>
          <h3 className="text-xl font-semibold text-ink">Load a realistic seeded posting</h3>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {scenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onLoadScenario(scenario.id)}
                className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition duration-150 sm:p-6 ${
                  isSelected
                    ? "border-accent bg-white shadow-card ring-1 ring-accent/10"
                    : "border-line/70 bg-surface/82 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-panel hover:shadow-card"
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent/70 via-accent/20 to-transparent" />
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-ink">{scenario.label}</p>
                      <p className="mt-1 text-sm leading-6 text-ink/72">{scenario.emphasis}</p>
                    </div>
                    <span className="rounded-full border border-line/70 bg-panel/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                      {isSelected ? "Loaded" : "Demo"}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ink/76">{scenario.preview}</p>
                  <div className="rounded-2xl border border-line/60 bg-panel/92 px-4 py-3 text-sm leading-6 text-ink/80">
                    {scenario.expectedFitLabel}
                  </div>
                  <span className="inline-flex text-sm font-semibold text-accent-strong">
                    {isSelected ? "Loaded into intake" : "Load into intake"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </section>
  );
}
