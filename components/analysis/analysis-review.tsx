import Link from "next/link";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import type { AnalysisSession } from "@/lib/validation/schemas";

type AnalysisReviewProps = {
  session: AnalysisSession;
};

export function AnalysisReview({ session }: AnalysisReviewProps) {
  const { analysis } = session;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-ink/10 bg-panel p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/55">
              Screen 2
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Analysis Review</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Review the rules-based output before saving anything into the tracker.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={analysis.fitVerdict.rating} kind="fit" />
            <StatusBadge value={analysis.fitVerdict.lifeFitLabel} kind="life" />
            <span className="inline-flex rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Score {session.score}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Company" value={analysis.jobSnapshot.company ?? "Unknown"} />
          <SummaryCard label="Role" value={analysis.jobSnapshot.title} />
          <SummaryCard label="Lane" value={analysis.positioningStrategy.recommendedLane} />
          <SummaryCard label="Resume Variant" value={analysis.resumeDirection.recommendedVariant} />
        </div>

        <div className="mt-6 rounded-2xl bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-ink/55">Verdict summary</p>
          <p className="mt-3 text-sm leading-7 text-ink/80">
            {analysis.fitVerdict.summary}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Non-negotiables">
          <ul className="space-y-3">
            {analysis.nonNegotiablesCheck.map((item) => (
              <li key={item.rule} className="rounded-2xl bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{item.rule}</p>
                  <StatusBadge value={item.status} kind="fit" />
                </div>
                <p className="mt-2 text-sm text-ink/70">{item.notes}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Signals and risks">
          <div className="grid gap-4">
            <SignalList
              title="Positive signals"
              items={analysis.positiveSignals}
              empty="No strong positive signals were detected from the current posting text."
            />
            <SignalList
              title="Risk flags"
              items={analysis.riskFlags}
              empty="No explicit risk flags surfaced from the first-pass posting text."
            />
          </div>
        </Panel>

        <Panel title="Strongest proof">
          <ul className="space-y-3">
            {analysis.strongestMatchingProof.map((proof, index) => (
              <li key={`${proof.claim}-${index}`} className="rounded-2xl bg-surface p-4">
                <p className="text-sm leading-6 text-ink/80">{proof.claim}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ink/55">
                  {proof.sourceType.replace(/_/g, " ")} | {proof.confidence.replace(/_/g, " ")}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Translation areas and gaps">
          <div className="space-y-4">
            <SignalList
              title="Translation areas"
              items={analysis.translationAreas.map(
                (area) => `${area.jobNeed} -> ${area.candidateAngle}${area.warning ? ` (${area.warning})` : ""}`
              )}
              empty="No translation areas were needed for the current first-pass read."
            />
            <ul className="space-y-3">
              {analysis.gaps.map((gap, index) => (
                <li key={`${gap.detail}-${index}`} className="rounded-2xl bg-surface p-4">
                  <p className="text-sm font-semibold">{gap.gapType}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/75">{gap.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ink/55">
                    Severity {gap.severity}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel title="Positioning and tailoring">
          <div className="space-y-4">
            <p className="text-sm leading-7 text-ink/80">
              {analysis.positioningStrategy.positioningParagraph}
            </p>
            <SignalList title="Emphasize" items={analysis.resumeDirection.emphasize} />
            <SignalList title="De-emphasize" items={analysis.resumeDirection.deEmphasize} />
            <SignalList
              title="Allowed tool claims"
              items={analysis.resumeDirection.allowedToolClaims}
              empty="No posting-specific confirmed tool claims surfaced."
            />
            <SignalList
              title="Tailoring priorities"
              items={analysis.resumeTailoringPriorities}
            />
          </div>
        </Panel>

        <Panel title="Next action">
          <div className="space-y-4">
            <StatusBadge value={analysis.nextAction.recommendation} kind="fit" />
            <p className="text-sm leading-7 text-ink/80">{analysis.nextAction.why}</p>
            <SignalList
              title="Pre-apply requirements"
              items={analysis.nextAction.preApplyRequirements}
              empty="No extra pre-apply requirements were generated."
            />
            <Link
              href="/new-analysis"
              className="inline-flex rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold no-underline"
            >
              Start another analysis
            </Link>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/55">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink/85">{value}</p>
    </div>
  );
}

function Panel({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-ink/10 bg-panel p-6 shadow-card">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SignalList({
  title,
  items,
  empty
}: {
  title: string;
  items: string[];
  empty?: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-ink/55">{title}</p>
      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="rounded-2xl bg-surface px-4 py-3 text-sm leading-6 text-ink/80">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-2xl bg-surface px-4 py-3 text-sm text-ink/65">
          {empty ?? "No items recorded."}
        </p>
      )}
    </div>
  );
}
