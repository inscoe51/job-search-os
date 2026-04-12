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
    <section className="app-panel space-y-6 overflow-hidden p-6 sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="app-kicker">Demo Guide</p>
          <h2 className="text-2xl font-semibold text-ink">Competition-ready guided testing</h2>
          <p className="app-copy">
            This prototype translates a structured ChatGPT-built project framework
            into a working app experience. It is intentionally tuned to one
            candidate profile, one approved set of guardrails, and evidence-first
            decision rules.
          </p>
        </div>
        <div className="rounded-3xl border border-line/70 bg-surface/70 px-4 py-3 text-sm text-ink/75 shadow-sm lg:max-w-sm">
          Use a seeded scenario below to populate the live intake flow, then run
          analysis exactly as a judge would.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="app-subpanel space-y-3 p-5">
          <div className="space-y-1">
            <p className="app-kicker">About This Demo</p>
            <h3 className="text-lg font-semibold text-ink">Structured prototype, bounded scope</h3>
          </div>
          <p className="app-copy">
            The app is designed to show how a constrained job-search operating
            system can turn a vetted project framework into a credible first-pass
            analysis experience without expanding into unsupported product scope.
          </p>
        </section>

        <section className="app-subpanel space-y-3 p-5">
          <div className="space-y-1">
            <p className="app-kicker">What This Engine Is Tuned For</p>
            <h3 className="text-lg font-semibold text-ink">Core guardrails at a glance</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {tuningPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-line/60 bg-panel/85 px-4 py-3 text-sm font-medium text-ink/80"
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
          <h3 className="text-lg font-semibold text-ink">Load a realistic seeded posting</h3>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {scenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onLoadScenario(scenario.id)}
                className={`group rounded-[26px] border p-5 text-left transition duration-150 ${
                  isSelected
                    ? "border-accent bg-white shadow-card"
                    : "border-line/70 bg-surface/78 hover:border-accent/35 hover:bg-panel"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-ink">{scenario.label}</p>
                      <p className="mt-1 text-sm text-ink/72">{scenario.emphasis}</p>
                    </div>
                    <span className="rounded-full border border-line/70 bg-panel/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                      Demo
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ink/76">{scenario.preview}</p>
                  <div className="rounded-2xl border border-line/60 bg-panel/88 px-4 py-3 text-sm text-ink/80">
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
