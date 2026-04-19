import Link from "next/link";
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
  const recommendationSummaryItems = [
    {
      label: "Fit",
      value: formatDisplayLabel(analysis.fitVerdict.rating),
      valueClassName: "text-base text-accent"
    },
    {
      label: "Life-Fit",
      value: formatDisplayLabel(analysis.fitVerdict.lifeFitLabel),
      valueClassName: "text-sm"
    },
    {
      label: "Score",
      value: String(session.score),
      valueClassName: "text-[1.65rem] leading-none text-ink"
    },
    {
      label: "Recommended move",
      value: formatDisplayLabel(analysis.nextAction.recommendation),
      valueClassName:
        analysis.nextAction.recommendation === "pass"
          ? "text-base text-danger"
          : analysis.nextAction.recommendation === "hold"
            ? "text-base text-caution"
            : "text-base text-accent"
    },
    {
      label: "Lane",
      value: analysis.positioningStrategy.recommendedLane,
      valueClassName: "text-sm text-ink/72 font-medium"
    },
    {
      label: "Resume variant",
      value: formatResumeDirectionLabel(analysis.resumeDirection.recommendedVariant),
      valueClassName: "text-sm text-ink/72 font-medium"
    }
  ];
  const primaryDecisionItems = recommendationSummaryItems.filter((item) =>
    ["Fit", "Life-Fit", "Score"].includes(item.label)
  );
  const secondaryInterpretationItems = recommendationSummaryItems.filter((item) =>
    ["Recommended move", "Lane", "Resume variant"].includes(item.label)
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
      <section className="app-panel p-4 sm:p-5">
        <div>
          <p className="app-kicker">Screen 2</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-[2rem]">Analysis Review</h2>
          <p className="mt-1.5 text-sm leading-5 text-ink/72">
            Review the recommendation before saving it to your tracker.
          </p>
        </div>

        <div className="mt-3 overflow-hidden rounded-[28px] border border-slate-300/60 bg-[linear-gradient(150deg,rgba(246,250,252,0.98),rgba(239,246,248,0.95)_56%,rgba(233,241,245,0.92))] p-4 shadow-[0_18px_40px_rgba(24,38,48,0.07),inset_0_1px_0_rgba(255,255,255,0.55)] sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700/62">Recommendation summary</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <StatusBadge value={analysis.fitVerdict.rating} kind="fit" />
            <StatusBadge value={analysis.fitVerdict.lifeFitLabel} kind="life" />
          </div>
          <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <SummaryCluster title="Decision" tone="primary">
              <dl className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(112px,0.72fr)]">
                <div className="space-y-2.5">
                  {primaryDecisionItems
                    .filter((item) => item.label !== "Score")
                    .map((item) => (
                      <SummaryValue key={item.label} item={item} strong />
                    ))}
                </div>
                <SummaryValue
                  item={primaryDecisionItems.find((item) => item.label === "Score")!}
                  score
                />
              </dl>
            </SummaryCluster>

            <SummaryCluster title="Interpretation" tone="secondary">
              <dl className="grid gap-2.5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <SummaryValue
                    item={secondaryInterpretationItems.find(
                      (item) => item.label === "Recommended move"
                    )!}
                    strong
                  />
                </div>
                {secondaryInterpretationItems
                  .filter((item) => item.label !== "Recommended move")
                  .map((item) => (
                    <SummaryValue key={item.label} item={item} compact />
                  ))}
              </dl>
            </SummaryCluster>
          </div>
          <div className="mt-5 border-t border-slate-300/45 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700/58">Job snapshot</p>
            <div className="mt-2.5 space-y-2.5">
              <p className="max-w-2xl text-sm leading-5 text-ink/75">{analysis.jobSnapshot.summary}</p>
              <div className="rounded-[1rem] border border-slate-300/45 bg-white/40 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                <MetadataList items={jobSnapshotItems} />
              </div>
            </div>
          </div>
          <p className="mt-2.5 text-sm leading-5 text-slate-700/54">
            Unknown posting details stay visible as unknown instead of being filled in by
            assumption.
          </p>
        </div>
      </section>

      <FullAnalysisSupport
        proofCount={analysis.strongestMatchingProof.length}
        gapCount={analysis.gaps.length}
        nonNegotiableCount={analysis.nonNegotiablesCheck.length}
      >
        <SupportDisclosure title="Why this recommendation" defaultOpen>
          <div className="space-y-3">
            <div className="grid gap-2 md:grid-cols-2">
              <CompactCallout label="Rationale" text={rationale} />
              <CompactCallout label="Caution" text={caution} />
            </div>
            <div className="grid gap-2.5 lg:grid-cols-2">
              <SignalList
                title="Positive signals"
                items={positiveSignals}
                empty="No strong positive signals were detected from the current posting text."
                compact
                maxItems={3}
                totalCount={analysis.positiveSignals.length}
              />
              <SignalList
                title="Signals and risks"
                items={analysis.riskFlags}
                empty="No explicit risk flags surfaced from the first-pass posting text."
                compact
                maxItems={3}
                totalCount={analysis.riskFlags.length}
              />
            </div>
          </div>
        </SupportDisclosure>

        <SupportDisclosure title="Proof">
          {proofItems.length ? (
            <div className="space-y-1.5">
              <ul className="space-y-1.5">
                {proofItems.map((proof, index) => (
                  <li
                    key={`${proof.claim}-${index}`}
                    className="rounded-r-[0.9rem] border-l-2 border-slate-400/55 bg-slate-50/40 pl-2.5 pr-2"
                  >
                    <p className="text-sm leading-5 text-ink/80">{proof.claim}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-slate-700/54">
                      {proof.sourceType.replace(/_/g, " ")} | {proof.confidence.replace(/_/g, " ")}
                    </p>
                  </li>
                ))}
              </ul>
              <TruncationNote
                shownCount={proofItems.length}
                totalCount={analysis.strongestMatchingProof.length}
              />
            </div>
          ) : (
            <p className="rounded-r-[0.9rem] border-l-2 border-slate-400/55 bg-slate-50/40 pl-3 pr-2 text-sm leading-6 text-ink/65">
              No defensible strongest proof surfaced from the approved candidate record for this
              posting yet. Keep the role review anchored on gaps and translation areas instead of
              filling this with assumed proof.
            </p>
          )}
        </SupportDisclosure>

        <SupportDisclosure title="Bridges and gaps">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <SignalList
              title="Bridges"
              items={bridgeItems.map(
                (area) =>
                  `${area.jobNeed} -> ${area.candidateAngle}${area.warning ? ` | ${area.warning}` : ""}`
              )}
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

        <SupportDisclosure title="Tailoring">
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
                  title="Tailor first"
                  items={tailoringPriorities}
                  compact
                  maxItems={3}
                  totalCount={analysis.resumeTailoringPriorities.length}
                />
                <SignalList
                  title="Before applying"
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

        <SupportDisclosure title="Non-negotiables">
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

      <div className="flex justify-start">
        <Link href="/new-analysis" className="app-button-secondary px-4 py-2">
          Start another analysis
        </Link>
      </div>
    </div>
  );
}

function SummaryCluster({
  title,
  tone,
  children
}: {
  title: string;
  tone: "primary" | "secondary";
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-[1.2rem] px-3.5 py-3 ${
        tone === "primary"
          ? "border border-emerald-200/40 bg-[linear-gradient(180deg,rgba(248,252,249,0.92),rgba(238,247,242,0.82))] shadow-[inset_0_1px_0_rgba(255,255,255,0.48)]"
          : "border border-slate-300/40 bg-[linear-gradient(180deg,rgba(251,253,253,0.92),rgba(243,247,249,0.8))] shadow-[inset_0_1px_0_rgba(255,255,255,0.46)]"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
          tone === "primary" ? "text-emerald-900/56" : "text-slate-700/56"
        }`}
      >
        {title}
      </p>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function SummaryValue({
  item,
  strong = false,
  compact = false,
  score = false
}: {
  item: {
    label: string;
    value: string;
    valueClassName?: string;
  };
  strong?: boolean;
  compact?: boolean;
  score?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-[1rem] px-3 py-2.5 ${
        score
          ? "border border-slate-300/35 bg-white/58 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.46)]"
          : strong
            ? "border border-slate-300/30 bg-white/38 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]"
            : "bg-transparent"
      }`}
    >
      <dt
        className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
          compact ? "text-slate-700/54" : "text-slate-700/58"
        }`}
      >
        {item.label}
      </dt>
      <dd
        className={`mt-1.5 break-words text-sm font-semibold leading-5 text-ink/88 ${
          score ? "text-[1.75rem] leading-none" : ""
        } ${item.valueClassName ?? ""}`}
      >
        {item.value}
      </dd>
    </div>
  );
}

function displayUnknown(value: string | null): string {
  return value ?? "Unknown";
}

function FullAnalysisSupport({
  proofCount,
  gapCount,
  nonNegotiableCount,
  children,
}: {
  proofCount: number;
  gapCount: number;
  nonNegotiableCount: number;
  children: ReactNode;
}) {
  return (
    <section className="app-panel p-4 sm:p-5">
      <details className="group/full-analysis" open>
        <summary className="list-none cursor-pointer">
          <div className="flex flex-col gap-3 rounded-[1.15rem] border border-slate-300/60 bg-[linear-gradient(145deg,rgba(245,249,251,0.96),rgba(236,243,246,0.9))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.52)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700/62">Support detail</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">Full analysis support</h3>
              <p className="mt-1 text-sm leading-5 text-ink/70">
                Open the preserved rationale, proof, gaps, tailoring, and rule checks when you
                want the full supporting read.
              </p>
            </div>
            <span className="app-disclosure-toggle">
              <span className="inline group-open/full-analysis:hidden">EXPAND</span>
              <span className="hidden group-open/full-analysis:inline">COLLAPSE</span>
            </span>
          </div>
        </summary>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <OverviewPill label="Proof" value={proofCount} />
          <OverviewPill label="Gaps" value={gapCount} />
          <OverviewPill label="Non-negotiables" value={nonNegotiableCount} />
        </div>
        <div className="mt-4 space-y-3">{children}</div>
      </details>
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
      className="group/support-disclosure rounded-[1.15rem] border border-slate-300/55 bg-[linear-gradient(180deg,rgba(250,252,253,0.92),rgba(241,246,248,0.82))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <h4 className="text-base font-semibold text-slate-900/88">{title}</h4>
        <span className="app-disclosure-toggle">
          <span className="inline group-open/support-disclosure:hidden">EXPAND</span>
          <span className="hidden group-open/support-disclosure:inline">COLLAPSE</span>
        </span>
      </summary>
      <div className="mt-3">{children}</div>
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
