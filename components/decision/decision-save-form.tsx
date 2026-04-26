"use client";

import Link from "next/link";
import { useMemo, useState, startTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/shared/status-badge";
import { isPrimaryDemoSource } from "@/lib/demo/sample-job-posting";
import { formatDisplayLabel, formatResumeDirectionLabel } from "@/lib/display/labels";
import { attachDecisionToSession } from "@/lib/domain/analysis-session";
import {
  getApplicationStatusLabel,
  networkingStatusOptions
} from "@/lib/domain/tracker-status";
import { createBrowserAnalysisSessionRepository } from "@/lib/repository/browser-analysis-session-repository";
import { createBrowserTrackerRepository } from "@/lib/repository/browser-tracker-repository";
import { mapAnalysisSessionToTrackerRecord } from "@/lib/tracker/analysis-to-tracker-record";
import {
  createDefaultDecisionPayload,
  getDefaultDecisionRouting,
  getSaveApplicationStatusOptions,
  normalizeDecisionPayloadForSave
} from "@/lib/tracker/status-mapping";
import type { AnalysisSession } from "@/lib/validation/schemas";
import { analysisDecisionPayloadSchema } from "@/lib/validation/schemas";

type DecisionSaveFormProps = {
  session: AnalysisSession;
};

export function DecisionSaveForm({ session }: DecisionSaveFormProps) {
  const router = useRouter();
  const showPrimaryDemoCue = isPrimaryDemoSource(
    session.intakeInput.sourceUrlOrIdentifier
  );
  const trackerRepository = useMemo(() => createBrowserTrackerRepository(), []);
  const sessionRepository = useMemo(
    () => createBrowserAnalysisSessionRepository(),
    []
  );
  const defaultPayload = useMemo(
    () => createDefaultDecisionPayload(session),
    [session]
  );
  const defaultRouting = useMemo(
    () => getDefaultDecisionRouting(session),
    [session]
  );

  const [selectedRecommendation, setSelectedRecommendation] = useState(
    defaultPayload.selectedRecommendation
  );
  const [applicationStatus, setApplicationStatus] = useState(
    defaultPayload.applicationStatus
  );
  const [networkingStatus, setNetworkingStatus] = useState(
    defaultPayload.networkingStatus
  );
  const [applicationDate, setApplicationDate] = useState(
    defaultPayload.applicationDate ?? ""
  );
  const [followUpDate, setFollowUpDate] = useState(
    defaultPayload.followUpDate ?? ""
  );
  const [interviewStage, setInterviewStage] = useState(
    defaultPayload.interviewStage ?? ""
  );
  const [outcome, setOutcome] = useState(defaultPayload.outcome ?? "");
  const [notes, setNotes] = useState(defaultPayload.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const applicationStatusIsOverridden =
    applicationStatus !== defaultRouting.applicationStatus;
  const allowedApplicationStatuses = useMemo(
    () => getSaveApplicationStatusOptions(selectedRecommendation),
    [selectedRecommendation]
  );

  function saveRecord(destination: "tracker" | "new-analysis") {
    try {
      const payload = normalizeDecisionPayloadForSave(
        session,
        analysisDecisionPayloadSchema.parse({
          selectedRecommendation,
          applicationStatus,
          networkingStatus,
          applicationDate: applicationDate || null,
          followUpDate: followUpDate || null,
          interviewStage: interviewStage || null,
          outcome: outcome || null,
          notes: notes || null
        })
      );
      const trackerRecord = mapAnalysisSessionToTrackerRecord(session, payload);
      const savedSession = attachDecisionToSession(session, payload, trackerRecord);

      trackerRepository.save(trackerRecord);
      sessionRepository.save(savedSession);
      setError(null);

      startTransition(() => {
        router.push(destination === "tracker" ? "/tracker" : "/new-analysis");
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not save this tracker record."
      );
    }
  }

  return (
    <section className="app-page-hero">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="app-kicker">Screen 3</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-[2rem]">Decision + Save</h2>
          <p className="mt-2 text-sm leading-6 text-ink/72">
            Carry the analysis forward without re-entering the key fit data.
          </p>
        </div>
        <StatusBadge value={session.analysis.nextAction.recommendation} kind="fit" />
      </div>

      <details className="group/decision-snapshot mt-5">
        <summary className="list-none cursor-pointer">
          <div className="overflow-hidden rounded-[28px] border border-sky-200/70 bg-[linear-gradient(150deg,rgba(247,251,253,0.97),rgba(240,248,249,0.96)_58%,rgba(234,243,245,0.94))] p-4 shadow-[0_16px_38px_rgba(22,41,50,0.07),inset_0_1px_0_rgba(255,255,255,0.56)] sm:p-5">
            <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-900/48">Read-only analysis handoff</p>
                <p className="mt-1.5 text-sm leading-5 text-ink/72">
                  This summary comes from the completed analysis and carries forward unchanged into the
                  save step.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={session.analysis.fitVerdict.rating} kind="fit" />
                  <StatusBadge value={session.analysis.fitVerdict.lifeFitLabel} kind="life" />
                </div>
                <span className="app-disclosure-toggle">
                  <span className="inline group-open/decision-snapshot:hidden">EXPAND</span>
                  <span className="hidden group-open/decision-snapshot:inline">COLLAPSE</span>
                </span>
              </div>
            </div>
          </div>
        </summary>

        <div className="mt-3 overflow-hidden rounded-[24px] border border-sky-200/60 bg-[linear-gradient(180deg,rgba(251,253,254,0.96),rgba(241,247,249,0.9))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.52)] sm:px-5">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <CompactSummaryItem
              label="Lane"
              value={session.analysis.positioningStrategy.recommendedLane}
            />
            <CompactSummaryItem
              label="Resume direction"
              value={formatResumeDirectionLabel(session.analysis.resumeDirection.recommendedVariant)}
            />
            <CompactSummaryItem
              label="Recommended move"
              value={formatDisplayLabel(session.analysis.nextAction.recommendation)}
            />
            <CompactSummaryItem
              label="Default status"
              value={getApplicationStatusLabel(defaultRouting.applicationStatus)}
            />
          </div>

          <p className="mt-3 text-sm leading-5 text-ink/70">{session.analysis.fitVerdict.summary}</p>
        </div>
      </details>

      <div className="mt-5 space-y-4">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-900/54">Editable workflow fields</p>
          <p className="text-sm leading-5 text-ink/70">
            Adjust only the approved save-time workflow fields below. The fit analysis, lane, and
            resume direction stay locked to the saved review.
          </p>
          {showPrimaryDemoCue ? (
            <p className="rounded-[1rem] border border-emerald-200/55 bg-emerald-50/45 px-3 py-2 text-sm leading-5 text-emerald-950/62">
              For the cleanest demo flow, keep the default recommendation and save directly to
              tracker to show the persisted handoff.
            </p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-[26px] border border-emerald-300/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,250,247,0.9))] shadow-[inset_0_1px_0_rgba(255,255,255,0.48),0_16px_34px_rgba(14,28,20,0.05)]">
          <div className="border-b border-emerald-200/60 bg-[linear-gradient(180deg,rgba(230,244,237,0.88),rgba(246,250,247,0.6))] px-5 py-4 sm:px-6">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-900/56">Workflow details</p>
              <p className="text-sm leading-5 text-ink/72">
                Confirm the save-ready workflow fields without changing the locked analysis handoff.
              </p>
            </div>
          </div>

          <div className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,250,247,0.9))]">
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <div className="mt-0 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Recommended next action">
                  <select
                    value={selectedRecommendation}
                    onChange={(event) => {
                      const nextRecommendation = event.target.value as typeof selectedRecommendation;
                      const nextAllowedStatuses = getSaveApplicationStatusOptions(nextRecommendation);
                      setSelectedRecommendation(nextRecommendation);

                      if (!nextAllowedStatuses.includes(applicationStatus)) {
                        setApplicationStatus(nextAllowedStatuses[0] ?? applicationStatus);
                      }

                      if (nextRecommendation === "pass") {
                        setNetworkingStatus("not_applicable");
                      }
                    }}
                    className="app-input"
                  >
                    <option value="apply">Apply</option>
                    <option value="apply_with_caution">Apply with caution</option>
                    <option value="hold">Hold</option>
                    <option value="pass">Pass</option>
                  </select>
                </Field>

                <Field
                  label="Application status"
                  helper={
                    <>
                      <span>
                        Defaults to {getApplicationStatusLabel(defaultRouting.applicationStatus)} because{" "}
                        {defaultRouting.reason.charAt(0).toLowerCase()}
                        {defaultRouting.reason.slice(1)}
                      </span>
                      {applicationStatusIsOverridden ? (
                        <span className="text-emerald-950/55">
                          Manual override active. The system recommendation remains{" "}
                          {getApplicationStatusLabel(defaultRouting.applicationStatus)}.
                        </span>
                      ) : null}
                    </>
                  }
                >
                  <select
                    value={applicationStatus}
                    onChange={(event) =>
                      setApplicationStatus(event.target.value as typeof applicationStatus)
                    }
                    className="app-input"
                  >
                    {allowedApplicationStatuses.map((value) => (
                      <option key={value} value={value}>
                        {getApplicationStatusLabel(value)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Networking status">
                  <select
                    value={networkingStatus}
                    onChange={(event) =>
                      setNetworkingStatus(event.target.value as typeof networkingStatus)
                    }
                    disabled={selectedRecommendation === "pass"}
                    className="app-input"
                  >
                    {networkingStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Application date">
                  <input
                    type="date"
                    value={applicationDate}
                    onChange={(event) => setApplicationDate(event.target.value)}
                    className="app-input"
                  />
                </Field>

                <Field label="Follow-up date">
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(event) => setFollowUpDate(event.target.value)}
                    className="app-input"
                  />
                </Field>

                <Field label="Interview stage">
                  <input
                    value={interviewStage}
                    onChange={(event) => setInterviewStage(event.target.value)}
                    placeholder="Recruiter screen"
                    className="app-input"
                  />
                </Field>

                <Field label="Outcome" className="md:col-span-2 xl:col-span-1">
                  <input
                    value={outcome}
                    onChange={(event) => setOutcome(event.target.value)}
                    placeholder="Awaiting response"
                    className="app-input"
                  />
                </Field>

                <Field label="Notes" className="md:col-span-2 xl:col-span-3">
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="app-input"
                  />
                </Field>
              </div>

              {error ? (
                <p className="mt-4 rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="border-t border-emerald-200/60 bg-[linear-gradient(180deg,rgba(237,246,241,0.7),rgba(247,250,248,0.92))] px-5 py-4 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-900/50">Save Step</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => saveRecord("tracker")}
                  className="app-button-primary"
                >
                  Save and open tracker
                </button>
                <button
                  type="button"
                  onClick={() => saveRecord("new-analysis")}
                  className="app-button-secondary"
                >
                  Save and start another analysis
                </button>
                <Link href="/tracker" className="app-button-secondary">
                  Cancel to tracker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompactSummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-sky-200/65 bg-white/50 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.48)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-900/44">{label}</p>
      <p className="mt-1.5 text-sm font-semibold leading-5 text-ink/84">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
  helper,
  className
}: {
  label: string;
  children: ReactNode;
  helper?: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-2 ${className ?? ""}`}>
      <span className="text-sm font-semibold text-emerald-950/88" style={{ fontFamily: '"Aptos", "Segoe UI", sans-serif' }}>{label}</span>
      {children}
      {helper ? <span className="block text-sm leading-5 text-emerald-950/60">{helper}</span> : null}
    </label>
  );
}
