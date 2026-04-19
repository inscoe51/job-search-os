"use client";

import {
  getPrimaryDemoScenarioSummary,
  type DemoScenarioSummary,
  type DemoScenarioId
} from "@/lib/demo/sample-job-posting";

type DemoGuideProps = {
  scenarios: DemoScenarioSummary[];
  entryPath: "guided" | "manual";
  selectedScenarioId: DemoScenarioId | null;
  onChooseGuided: () => void;
  onChooseManual: () => void;
  onLoadScenario: (scenarioId: DemoScenarioId) => void;
};

export function DemoGuide({
  scenarios,
  entryPath,
  selectedScenarioId,
  onChooseGuided,
  onChooseManual,
  onLoadScenario
}: DemoGuideProps) {
  const primaryScenario = getPrimaryDemoScenarioSummary();
  const alternateScenarios = scenarios.filter(
    (scenario) => scenario.id !== primaryScenario.id
  );
  const guidedActive = entryPath === "guided";
  const manualActive = entryPath === "manual";

  return (
    <section className="space-y-4">
      <details className="rounded-[30px] border border-emerald-300/70 bg-[linear-gradient(135deg,rgba(239,248,255,0.99),rgba(236,253,245,0.97))] p-4 shadow-card ring-1 ring-emerald-200/70 sm:p-5">
        <summary className="cursor-pointer list-none">
          <div className="space-y-2 rounded-[24px] border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(224,242,254,0.82),rgba(220,252,231,0.82))] px-4 py-3 shadow-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">
                How This Demo Works
              </p>
              <h3 className="text-xl font-semibold text-ink">Before You Scroll</h3>
              <p className="text-sm leading-6 text-ink/68">
                Open this quick guide before choosing a path.
              </p>
            </div>
            <div>
              <span className="rounded-full bg-emerald-800 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                Expand Here
              </span>
            </div>
          </div>
        </summary>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[24px] border border-sky-300 bg-sky-50/90 p-5 shadow-sm">
              <p className="app-mini-label text-sky-800">Start here</p>
              <p className="mt-3 text-sm leading-6 text-sky-950">
                The recommended template is already loaded and ready to analyze. To go straight to results, click &ldquo;Review this job&rdquo; at the bottom of the page.
              </p>
            </div>
            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/85 p-5 shadow-sm">
              <p className="app-mini-label text-emerald-800">Other demo paths</p>
              <p className="mt-3 text-sm leading-6 text-ink/78">
                To try a different job scenario, click &ldquo;More Example Scenarios&rdquo; at the bottom of the Primary Path section.
              </p>
            </div>
            <div className="rounded-[24px] border border-sky-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,248,255,0.92))] p-5 shadow-sm">
              <p className="app-mini-label text-sky-800">Manual option</p>
              <p className="mt-3 text-sm leading-6 text-ink/78">
                To enter a custom job posting, click &ldquo;Open manual form&rdquo; inside the Primary Path section.
              </p>
            </div>
          </div>
          <p className="px-1 text-xs leading-5 text-ink/56">
            Full version direction: future versions could support personal profiles, pasted jobs, and ATS-safe wording help without inventing claims.
          </p>
        </div>
      </details>

      <div className="space-y-2">
        <p className="app-kicker">Next Step</p>
        <h2 className="max-w-3xl text-2xl font-semibold text-ink sm:text-[2rem]">
          Start with the guided demo or enter your own job
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-ink/74">
          The recommended example is already loaded, so the fastest path is to stay on the guided demo and click Review this job below.
        </p>
      </div>

      <div className="space-y-4">
        <section
          id="guided-demo-launcher"
          className={`relative overflow-hidden rounded-[30px] border p-6 sm:p-7 ${
            guidedActive
              ? "border-emerald-300/70 bg-[linear-gradient(135deg,rgba(239,248,255,0.98),rgba(236,253,245,0.98))] shadow-card ring-1 ring-emerald-200/70"
              : "border-line/70 bg-white/88 shadow-sm"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-500 via-emerald-500 to-transparent" />
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="app-kicker">Primary Path</p>
                <h3 className="text-[1.6rem] font-semibold text-ink">Try the guided demo</h3>
                <p className="max-w-2xl text-sm leading-6 text-ink/76">
                  Start with the strongest example, review the result, and save it to the tracker in the usual demo path.
                </p>
              </div>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                Recommended
              </span>
            </div>

            <div className="space-y-3 rounded-[24px] bg-white/56 px-1 py-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-ink">{primaryScenario.label}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/72">{primaryScenario.emphasis}</p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Strong fit
                </span>
              </div>
              <p className="text-sm leading-6 text-ink/78">{primaryScenario.preview}</p>
              <p className="text-sm leading-6 text-sky-950">{primaryScenario.expectedFitLabel}</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm leading-6 text-ink/68">{primaryScenario.presenterNote}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onChooseGuided}
                    className="app-button-primary"
                  >
                    {selectedScenarioId === primaryScenario.id && guidedActive
                      ? "Recommended demo loaded"
                      : "Load recommended demo"}
                  </button>
                  <button
                    type="button"
                    onClick={onChooseManual}
                    className={manualActive ? "app-button-primary" : "app-button-secondary"}
                  >
                    Open manual form
                  </button>
                </div>
              </div>
            </div>

            <details className="group rounded-[24px] border border-sky-200/80 bg-white/78 p-4 shadow-sm">
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:hidden">
                <span className="inline-flex items-center gap-2">
                  More example scenarios
                  <span className="text-ink/45 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <div className="mt-4 grid gap-3">
                {alternateScenarios.map((scenario) => {
                  const isSelected = scenario.id === selectedScenarioId;

                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => onLoadScenario(scenario.id)}
                      className={`rounded-[24px] border p-4 text-left transition duration-150 ${
                        isSelected
                          ? "border-sky-300 bg-sky-50 shadow-sm"
                          : "border-slate-200 bg-slate-50/80 hover:border-sky-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-ink">{scenario.label}</p>
                          <p className="mt-1 text-sm leading-6 text-ink/72">{scenario.preview}</p>
                        </div>
                        <span className="rounded-full border border-line/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                          {isSelected ? "Loaded" : "Example"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </details>
          </div>
        </section>
      </div>

    </section>
  );
}

