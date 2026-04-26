"use client";

import {
  type DemoScenarioSummary,
  type DemoScenarioId
} from "@/lib/demo/sample-job-posting";

type DemoGuideProps = {
  scenarios: DemoScenarioSummary[];
  selectedScenarioId: DemoScenarioId | null;
  onLoadScenario: (scenarioId: DemoScenarioId) => void;
};

export function DemoGuide({
  scenarios,
  selectedScenarioId,
  onLoadScenario
}: DemoGuideProps) {
  return (
    <section
      id="guided-demo-launcher"
      className="relative overflow-hidden rounded-[30px] border border-emerald-300/70 bg-[linear-gradient(135deg,rgba(239,248,255,0.98),rgba(255,255,255,0.97)_46%,rgba(236,253,245,0.96))] p-6 shadow-card ring-1 ring-emerald-200/70 sm:p-7"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-500 via-emerald-500 to-transparent" />
      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
          <div className="space-y-3">
            <p className="app-kicker">Proof-of-concept Handshake demo</p>
            <h1 className="text-[1.8rem] font-semibold text-ink sm:text-[2.15rem]">
              Before you scroll
            </h1>
            <p className="max-w-[52rem] text-sm leading-6 text-ink/76">
              Job Search OS is about to run a guided proof-of-concept demo. One candidate profile is already preloaded, and the job posting below is evaluated against that profile.
            </p>
            <p className="max-w-[52rem] text-sm leading-6 text-ink/72">
              The point is to show how the same review loop handles different outcome types, including strong fit, medium fit, and poor fit examples.
            </p>
          </div>

          <div className="rounded-[24px] border border-sky-200/80 bg-white/72 p-5 shadow-sm">
            <p className="app-mini-label text-sky-800">How to start</p>
            <p className="mt-3 text-sm leading-6 text-ink/78">
              Choose one of three demo scenarios. The selected scenario loads the visible posting fields below.
            </p>
            <p className="mt-3 text-sm leading-6 text-ink/72">
              For the smoothest walkthrough, keep the strong-fit example selected.
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {scenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;
            const option = getScenarioOptionCopy(scenario.id);

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onLoadScenario(scenario.id)}
                className={`min-h-[10.5rem] rounded-[24px] border p-4 text-left transition duration-150 ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-50/90 shadow-sm ring-2 ring-emerald-200/80"
                    : "border-slate-200 bg-white/76 hover:border-sky-300 hover:bg-sky-50/60"
                }`}
              >
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/58">
                  {isSelected ? "Selected - fields below are loaded" : "Choose scenario"}
                </span>
                <span className="mt-3 block text-xl font-semibold text-ink">
                  {option.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-ink/74">
                  {option.description}
                </span>
                <span className="mt-3 block text-sm font-semibold text-sky-950">
                  {scenario.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getScenarioOptionCopy(scenarioId: DemoScenarioId) {
  switch (scenarioId) {
    case "strong-fit-example":
      return {
        title: "Strong fit",
        description: "Recommended path for the smoothest walkthrough."
      };
    case "borderline-workable-fit-example":
      return {
        title: "Medium fit",
        description: "Shows a workable match with tradeoffs and gaps."
      };
    case "poor-fit-pass-example":
      return {
        title: "Poor fit",
        description: "Shows why the review can recommend passing."
      };
  }
}

