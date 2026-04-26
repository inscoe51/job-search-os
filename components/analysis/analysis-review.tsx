import type { ReactNode } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDisplayLabel, formatResumeDirectionLabel } from "@/lib/display/labels";
import type { AnalysisSession } from "@/lib/validation/schemas";

type AnalysisReviewProps = {
  session: AnalysisSession;
};

export function AnalysisReview({ session }: AnalysisReviewProps) {
  const { analysis } = session;
  const positiveSignals = analysis.positiveSignals.slice(0, 3);
  const proofItems = analysis.strongestMatchingProof.slice(0, 3);
  const bridgeItems = analysis.translationAreas.slice(0, 2);
  const gapItems = analysis.gaps.slice(0, 3);
  const emphasizeItems = analysis.resumeDirection.emphasize.slice(0, 3);
  const deEmphasizeItems = analysis.resumeDirection.deEmphasize.slice(0, 2);
  const safeToolClaims = analysis.resumeDirection.allowedToolClaims.slice(0, 3);
  const tailoringPriorities = analysis.resumeTailoringPriorities.slice(0, 3);
  const beforeApplyingItems = analysis.nextAction.preApplyRequirements.slice(0, 2);
  const fitRating = formatDisplayLabel(analysis.fitVerdict.rating);
  const lifeFit = formatDisplayLabel(analysis.fitVerdict.lifeFitLabel);
  const recommendedMove = formatDisplayLabel(analysis.nextAction.recommendation);
  const recommendedMoveClassName =
    analysis.nextAction.recommendation === "pass"
      ? "text-danger"
      : analysis.nextAction.recommendation === "hold"
        ? "text-caution"
        : "text-accent";
  const resumeVariant = formatResumeDirectionLabel(
    analysis.resumeDirection.recommendedVariant
  );
  const jobSnapshotItems = [
    { label: "Company", value: displayUnknown(analysis.jobSnapshot.company) },
    { label: "Role", value: analysis.jobSnapshot.title },
    {
      label: "Role type",
      value: analysis.jobSnapshot.normalizedRoleType
    },
    { label: "Location", value: displayUnknown(analysis.jobSnapshot.location) },
    { label: "Pay", value: displayUnknown(analysis.jobSnapshot.pay) },
    {
      label: "Work mode",
      value: displayUnknown(
        analysis.jobSnapshot.workMode === "unknown"
          ? null
          : formatDisplayLabel(analysis.jobSnapshot.workMode)
      )
    }
  ];
  const rationale = analysis.fitVerdict.summary.trim();
  const caution = analysis.nextAction.why.trim();

  return (
    <div className="space-y-4">
      <section className="app-panel overflow-hidden p-0">
        <div className="border-b border-slate-300/45 px-5 py-4 sm:px-6 sm:py-5">
          <p className="app-kicker">Analysis Review</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-[2rem]">
            Decision summary
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-ink/72">
            Review the fit, lane, resume direction, and next action before saving this job to
            the tracker.
          </p>
        </div>

        <div className="bg-[linear-gradient(150deg,rgba(246,250,252,0.98),rgba(239,246,248,0.95)_56%,rgba(233,241,245,0.92))] px-5 py-5 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
            <div className="rounded-[1.35rem] border border-emerald-200/60 bg-white/58 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700/58">
                Fit summary
              </p>
              <div className="mt-3 flex items-end gap-3">
                <p className="text-[4rem] font-semibold leading-none text-ink sm:text-[4.5rem]">
                  {session.score}
                </p>
                <div className="pb-1">
                  <p className="text-lg font-semibold text-accent">{fitRating}</p>
                  <p className="mt-1 text-sm leading-5 text-ink/66">Life-fit: {lifeFit}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge value={analysis.fitVerdict.rating} kind="fit" />
                <StatusBadge value={analysis.fitVerdict.lifeFitLabel} kind="life" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700/58">
                  Job context
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink">
                  {analysis.jobSnapshot.title}
                </h3>
                <p className="mt-1 text-sm leading-5 text-ink/72">
                  {displayUnknown(analysis.jobSnapshot.company)} &middot;{" "}
                  {analysis.jobSnapshot.normalizedRoleType}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-5 text-ink/75">
                  {analysis.jobSnapshot.summary}
                </p>
              </div>

              <dl className="grid gap-3 md:grid-cols-3">
                <DecisionMetric
                  label="Matched lane"
                  value={analysis.positioningStrategy.recommendedLane}
                />
                <DecisionMetric label="Resume direction" value={resumeVariant} />
                <DecisionMetric
                  label="Next action"
                  value={recommendedMove}
                  valueClassName={recommendedMoveClassName}
                />
              </dl>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-300/45 pt-4">
            <MetadataList items={jobSnapshotItems} />
            <p className="mt-2.5 text-sm leading-5 text-slate-700/54">
              Unknown posting details stay visible as unknown instead of being filled in by
              assumption.
            </p>
          </div>

          <div className="mt-5 border-t border-slate-300/45 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700/58">
              Evidence summary
            </p>
            <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)]">
              <CompactCallout label="Fit rationale" text={rationale} />
              <div className="rounded-r-[1rem] border-l-2 border-emerald-500/55 bg-white/46 pl-2.5 pr-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700/58">
                  Strongest proof
                </p>
                <ProofList
                  items={proofItems}
                  totalCount={analysis.strongestMatchingProof.length}
                />
              </div>
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <SignalList
                title="Supporting signals"
                items={positiveSignals}
                empty="No strong positive signals were detected from the current posting text."
                compact
                maxItems={3}
                totalCount={analysis.positiveSignals.length}
              />
              <CompactCallout label="Main caution" text={caution} />
            </div>
          </div>
        </div>
      </section>

      <FullAnalysisSupport
        gapCount={analysis.gaps.length}
        nonNegotiableCount={analysis.nonNegotiablesCheck.length}
      >
        <SupportDisclosure title="Risk and gap check" defaultOpen>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <SignalList
              title="Risk signals"
              items={analysis.riskFlags}
              empty="No explicit risk flags surfaced from the first-pass posting text."
              compact
              maxItems={3}
              totalCount={analysis.riskFlags.length}
            />
            <SignalList
              title="Bridges"
              items={bridgeItems.map(formatBridgeText)}
              empty="No translation areas were needed for the current first-pass read."
              compact
              maxItems={2}
              totalCount={analysis.translationAreas.length}
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700/60">Gaps</p>
              {gapItems.length ? (
                <div className="mt-2 space-y-1.5">
                  {gapItems.map((gap, index) => (
                    <div
                      key={`${gap.detail}-${index}`}
                      className="rounded-r-[0.9rem] border-l-2 border-slate-400/55 bg-slate-50/40 pl-2.5 pr-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-ink/85">{gap.gapType}</p>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-700/54">
                          {gap.severity}
                        </p>
                      </div>
                      <p className="mt-0.5 text-sm leading-5 text-ink/75">{gap.detail}</p>
                    </div>
                  ))}
                  <TruncationNote shownCount={gapItems.length} totalCount={analysis.gaps.length} />
                </div>
              ) : (
                <p className="mt-2 rounded-r-[0.9rem] border-l-2 border-slate-400/55 bg-slate-50/40 pl-3 pr-2 text-sm text-ink/65">
                  No material gaps were recorded.
                </p>
              )}
            </div>
          </div>
        </SupportDisclosure>

        <SupportDisclosure title="Resume tailoring">
          <div className="space-y-3">
            <p className="text-sm leading-5 text-ink/80">
              {analysis.positioningStrategy.positioningParagraph}
            </p>
            <div className="grid gap-2.5 lg:grid-cols-2">
              <div className="space-y-2.5">
                <SignalList
                  title="Emphasize"
                  items={emphasizeItems}
                  compact
                  maxItems={3}
                  totalCount={analysis.resumeDirection.emphasize.length}
                />
                <SignalList
                  title="De-emphasize"
                  items={deEmphasizeItems}
                  compact
                  maxItems={2}
                  totalCount={analysis.resumeDirection.deEmphasize.length}
                />
              </div>
              <div className="space-y-2.5">
                <SignalList
                  title="Safe tool claims"
                  items={safeToolClaims}
                  empty="No posting-specific confirmed tool claims surfaced."
                  compact
                  maxItems={3}
                  totalCount={analysis.resumeDirection.allowedToolClaims.length}
                />
                <SignalList
                  title="Tailoring priorities"
                  items={tailoringPriorities}
                  compact
                  maxItems={3}
                  totalCount={analysis.resumeTailoringPriorities.length}
                />
                <SignalList
                  title="Pre-apply checks"
                  items={beforeApplyingItems}
                  empty="No extra pre-apply requirements were generated."
                  compact
                  maxItems={2}
                  totalCount={analysis.nextAction.preApplyRequirements.length}
                />
              </div>
            </div>
          </div>
        </SupportDisclosure>

        <SupportDisclosure title="Rule checks">
          <ul className="divide-y divide-line/50 rounded-[1.25rem] border border-line/45 bg-surface/25">
            {analysis.nonNegotiablesCheck.map((item) => (
              <li key={item.rule} className="px-3 py-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink/86">{item.rule}</p>
                    <p className="mt-0.5 text-sm leading-5 text-ink/68">{item.notes}</p>
                  </div>
                  <StatusBadge value={item.status} kind="fit" />
                </div>
              </li>
            ))}
          </ul>
        </SupportDisclosure>
      </FullAnalysisSupport>

    </div>
  );
}

function DecisionMetric({
  label,
  value,
  valueClassName
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-[1rem] border border-slate-300/42 bg-white/46 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.46)]">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700/58">
        {label}
      </dt>
      <dd className={`mt-1.5 break-words text-sm font-semibold leading-5 text-ink/88 ${valueClassName ?? ""}`}>
        {value}
      </dd>
    </div>
  );
}

function ProofList({
  items,
  totalCount
}: {
  items: AnalysisSession["analysis"]["strongestMatchingProof"];
  totalCount: number;
}) {
  if (!items.length) {
    return (
      <p className="mt-1.5 text-sm leading-5 text-ink/65">
        No defensible strongest proof surfaced from the approved candidate record for this
        posting yet. Keep the role review anchored on gaps and translation areas instead of
        filling this with assumed proof.
      </p>
    );
  }

  return (
    <div className="mt-1.5 space-y-1.5">
      <ul className="space-y-1.5">
        {items.map((proof, index) => (
          <li key={`${proof.claim}-${index}`}>
            <p className="text-sm leading-5 text-ink/80">{proof.claim}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-slate-700/54">
              {proof.sourceType.replace(/_/g, " ")} | {proof.confidence.replace(/_/g, " ")}
            </p>
          </li>
        ))}
      </ul>
      <TruncationNote shownCount={items.length} totalCount={totalCount} maxItems={3} />
    </div>
  );
}

function displayUnknown(value: string | null): string {
  return value ?? "Unknown";
}

function formatBridgeText(
  area: AnalysisSession["analysis"]["translationAreas"][number]
): string {
  return `${area.jobNeed}: ${formatBridgeAngle(area.candidateAngle)}${area.warning ? ` | ${area.warning}` : ""}`;
}

function formatBridgeAngle(text: string): string {
  const trimmed = text.trim();

  if (!trimmed) {
    return trimmed;
  }

  return `${trimmed.charAt(0).toLocaleLowerCase()}${trimmed.slice(1)}`;
}

function FullAnalysisSupport({
  gapCount,
  nonNegotiableCount,
  children,
}: {
  gapCount: number;
  nonNegotiableCount: number;
  children: ReactNode;
}) {
  return (
    <section className="app-panel p-4 sm:p-5">
      <div className="flex flex-col gap-3 border-b border-slate-300/45 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700/62">
            Decision evidence
          </p>
          <h3 className="mt-1 text-lg font-semibold text-ink">Supporting evidence</h3>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-ink/70">
            Risks, gaps, tailoring, and rule checks stay available underneath the main decision
            layer.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <OverviewPill label="Gaps" value={gapCount} />
          <OverviewPill label="Rule checks" value={nonNegotiableCount} />
        </div>
      </div>
      <div className="mt-4 space-y-3.5">{children}</div>
    </section>
  );
}

function SupportDisclosure({
  title,
  children,
  defaultOpen = false
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group/support-disclosure rounded-[1.15rem] border border-slate-300/55 bg-[linear-gradient(180deg,rgba(250,252,253,0.92),rgba(241,246,248,0.82))] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <h4 className="text-base font-semibold text-slate-900/88">{title}</h4>
        <span className="app-disclosure-toggle">
          <span className="inline group-open/support-disclosure:hidden">Show details</span>
          <span className="hidden group-open/support-disclosure:inline">Hide details</span>
        </span>
      </summary>
      <div className="mt-3.5">{children}</div>
    </details>
  );
}

function OverviewPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-full border border-slate-300/55 bg-slate-100/70 px-3 py-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700/60">
        {label}
      </span>
      <span className="ml-1.5 text-sm font-semibold text-ink/84">{value}</span>
    </div>
  );
}

function MetadataList({
  items
}: {
  items: Array<{
    label: string;
    value: ReactNode;
  }>;
}) {
  return (
    <dl className="grid gap-x-4 gap-y-1.5 text-sm md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex gap-2 leading-5 text-ink/78">
          <dt className="min-w-[72px] text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700/58">
            {item.label}
          </dt>
          <dd className="min-w-0 font-medium text-ink/84">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SignalList({
  title,
  items,
  empty,
  compact = false,
  maxItems,
  totalCount
}: {
  title: string;
  items: string[];
  empty?: string;
  compact?: boolean;
  maxItems?: number;
  totalCount?: number;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700/60">{title}</p>
      {items.length ? (
        compact ? (
          <div className="mt-1.5 space-y-1.5">
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li
                  key={item}
                  className="rounded-r-[0.9rem] border-l-2 border-slate-400/55 bg-slate-50/40 pl-2.5 pr-2 text-sm leading-5 text-ink/80"
                >
                  {item}
                </li>
              ))}
            </ul>
            <TruncationNote shownCount={items.length} totalCount={totalCount ?? items.length} maxItems={maxItems} />
          </div>
        ) : (
          <ul className="mt-1.5 space-y-1.5">
            {items.map((item) => (
              <li key={item} className="app-card px-3 py-2 text-sm leading-5 text-ink/80">
                {item}
              </li>
            ))}
          </ul>
        )
      ) : (
        <p
          className={`${compact ? "mt-1.5 rounded-r-[0.9rem] border-l-2 border-slate-400/55 bg-slate-50/40 pl-2.5 pr-2" : "app-card mt-1.5 px-3 py-2"} text-sm leading-5 text-ink/65`}
        >
          {empty ?? "No items recorded."}
        </p>
      )}
    </div>
  );
}

function TruncationNote({
  shownCount,
  totalCount,
  maxItems
}: {
  shownCount: number;
  totalCount: number;
  maxItems?: number;
}) {
  if (!maxItems || totalCount <= shownCount) {
    return null;
  }

  return (
    <p className="text-xs uppercase tracking-[0.16em] text-slate-700/56">
      Showing {shownCount} of {totalCount}
    </p>
  );
}

function CompactCallout({
  label,
  text
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-r-[1rem] border-l-2 border-slate-400/55 bg-slate-50/45 pl-2.5 pr-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700/58">{label}</p>
      <p className="mt-1 text-sm leading-5 text-ink/78">{text}</p>
    </div>
  );
}
