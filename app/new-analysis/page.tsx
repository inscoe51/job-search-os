import { NewAnalysisWorkspace } from "@/components/intake/new-analysis-workspace";

export default function NewAnalysisPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="app-kicker">Screen 1</p>
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">New Analysis</h1>
        <p className="max-w-3xl text-sm leading-6 text-ink/74">
          Review one structured posting against the approved candidate profile and
          guardrails, then route the result into the existing first-pass analysis flow.
        </p>
      </header>
      <NewAnalysisWorkspace />
    </section>
  );
}
