"use client";

import Link from "next/link";
import { useMemo, useState, startTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/shared/status-badge";
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
    <section className="rounded-3xl border border-ink/10 bg-panel p-6 shadow-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ink/55">
            Screen 3
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Decision + Save</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Carry the analysis forward without re-entering the key fit data.
          </p>
        </div>
        <StatusBadge value={session.analysis.nextAction.recommendation} kind="fit" />
      </div>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-surface p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/55">
              Read-only analysis handoff
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/75">
              This summary comes from the completed analysis and carries forward unchanged into the
              save step.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={session.analysis.fitVerdict.rating} kind="fit" />
            <StatusBadge value={session.analysis.fitVerdict.lifeFitLabel} kind="life" />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Lane" value={session.analysis.positioningStrategy.recommendedLane} />
          <SummaryCard
            label="Resume direction"
            value={session.analysis.resumeDirection.recommendedVariant}
          />
          <SummaryCard
            label="Recommended move"
            value={session.analysis.nextAction.recommendation.replace(/_/g, " ")}
          />
          <SummaryCard label="Default status" value={getApplicationStatusLabel(defaultRouting.applicationStatus)} />
        </div>

        <p className="mt-4 text-sm leading-6 text-ink/75">{session.analysis.fitVerdict.summary}</p>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-ink/55">Editable workflow fields</p>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Adjust only the approved save-time workflow fields below. The fit analysis, lane, and
          resume direction stay locked to the saved review.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
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
            className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
          >
            <option value="apply">Apply</option>
            <option value="apply_with_caution">Apply with caution</option>
            <option value="hold">Hold</option>
            <option value="pass">Pass</option>
          </select>
        </Field>

        <Field label="Application status">
          <select
            value={applicationStatus}
            onChange={(event) =>
              setApplicationStatus(event.target.value as typeof applicationStatus)
            }
            className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
          >
            {allowedApplicationStatuses.map((value) => (
              <option key={value} value={value}>
                {getApplicationStatusLabel(value)}
              </option>
            ))}
          </select>
          <div className="rounded-2xl border border-ink/10 bg-surface px-4 py-3 text-sm leading-6 text-ink/75">
            <p className="font-semibold text-ink">
              System default: {getApplicationStatusLabel(defaultRouting.applicationStatus)}
            </p>
            <p>{defaultRouting.reason}</p>
            {applicationStatusIsOverridden ? (
              <p className="text-ink/60">
                Manual override active. The system recommendation remains{" "}
                {getApplicationStatusLabel(defaultRouting.applicationStatus)}.
              </p>
            ) : null}
          </div>
        </Field>

        <Field label="Networking status">
          <select
            value={networkingStatus}
            onChange={(event) =>
              setNetworkingStatus(event.target.value as typeof networkingStatus)
            }
            disabled={selectedRecommendation === "pass"}
            className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
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
            className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
          />
        </Field>

        <Field label="Follow-up date">
          <input
            type="date"
            value={followUpDate}
            onChange={(event) => setFollowUpDate(event.target.value)}
            className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
          />
        </Field>

        <Field label="Interview stage">
          <input
            value={interviewStage}
            onChange={(event) => setInterviewStage(event.target.value)}
            placeholder="Recruiter screen"
            className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
          />
        </Field>

        <Field label="Outcome">
          <input
            value={outcome}
            onChange={(event) => setOutcome(event.target.value)}
            placeholder="Awaiting response"
            className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
          />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
        />
      </Field>

      {error ? (
        <p className="mt-4 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => saveRecord("tracker")}
          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
        >
          Save and open tracker
        </button>
        <button
          type="button"
          onClick={() => saveRecord("new-analysis")}
          className="rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold"
        >
          Save and start another analysis
        </button>
        <Link
          href="/tracker"
          className="rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold no-underline"
        >
          Cancel to tracker
        </Link>
      </div>
    </section>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-panel px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/55">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink/85">{value}</p>
    </div>
  );
}
