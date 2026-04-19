import { NewAnalysisWorkspace } from "@/components/intake/new-analysis-workspace";

export default function NewAnalysisPage() {
  return (
    <section className="space-y-5">
      <header className="app-page-hero border border-emerald-200/70 bg-[linear-gradient(160deg,rgba(232,248,255,0.98),rgba(255,255,255,0.97)_45%,rgba(233,250,241,0.96))] shadow-sm">
        <div className="grid gap-3">
          <div className="space-y-3">
            <p className="app-kicker">New Analysis</p>
            <h1 className="text-[1.8rem] font-semibold text-ink sm:text-[2.1rem]">
              Start with the demo. Then review your own job.
            </h1>
            <p className="max-w-[50rem] text-sm leading-6 text-ink/74">
              This demo uses one preloaded profile and one sample job to show how Job Search OS turns a posting into a fit review, next-step recommendation, and saved follow-up record.
            </p>
          </div>
        </div>
      </header>

      <NewAnalysisWorkspace />
    </section>
  );
}



