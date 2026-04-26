"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { isPrimaryDemoSource } from "@/lib/demo/sample-job-posting";
import { formatDisplayLabel, formatResumeDirectionLabel } from "@/lib/display/labels";
import {
  applicationStatusOptions,
  networkingStatusOptions
} from "@/lib/domain/tracker-status";
import { createBrowserTrackerRepository } from "@/lib/repository/browser-tracker-repository";
import type { TrackerWorkflowUpdate } from "@/lib/repository/tracker-repository";
import type { TrackerRecord } from "@/lib/validation/schemas";
import { formatDateLabel } from "@/lib/utils/dates";

type TrackerRecordPanelProps = {
  jobId: string;
  initialRecord?: TrackerRecord | null;
};

export function TrackerRecordPanel({
  jobId,
  initialRecord = null
}: TrackerRecordPanelProps) {
  const router = useRouter();
  const repository = useMemo(() => createBrowserTrackerRepository(), []);
  const [record, setRecord] = useState<TrackerRecord | null>(initialRecord);
  const [error, setError] = useState<string | null>(null);
  const [showReadOnlyContext, setShowReadOnlyContext] = useState(false);
  const showPrimaryDemoCue = record ? isPrimaryDemoSource(record.source) : false;

  useEffect(() => {
    if (!initialRecord) {
      setRecord(repository.get(jobId));
    }
  }, [initialRecord, jobId, repository]);

  if (!record) {
    return (
      <EmptyState
        title="Tracker record not found"
        body="The requested job record is missing from local storage. Return to the tracker list and open another record."
        actionHref="/tracker"
        actionLabel="Back to tracker"
      />
    );
  }

  function updateRecord(updates: TrackerWorkflowUpdate) {
    if (!record) {
      setError("The record could not be updated.");
      return;
    }

    const updated = repository.update(record.jobId, updates);

    if (!updated) {
      setError("The record could not be updated.");
      return;
    }

    setRecord(updated);
    setError(null);
  }

  function deleteRecord() {
    if (!record) {
      setError("The record could not be deleted.");
      return;
    }

    const confirmed = window.confirm("Delete this saved role? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    const removed = repository.remove(record.jobId);

    if (!removed) {
      setError("The record could not be deleted.");
      return;
    }

    setError(null);
    router.push("/tracker");
  }

  return (
    <div className="space-y-4">
      <section className="app-page-hero-quiet">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="app-kicker">Screen 5</p>
            <h2 className="mt-1.5 text-[1.7rem] font-semibold text-ink">
              {record.company} / {record.title}
            </h2>
            <p className="mt-1 text-sm leading-5 text-ink/72">
              Work the saved role from its current tracker state. Original analysis stays locked.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          <Summary label="Saved lane" value={record.laneMatched} />
          <Summary label="Saved fit" value={formatDisplayLabel(record.fitVerdict)} />
          <Summary
            label="Resume direction"
            value={formatResumeDirectionLabel(record.resumeVariant)}
          />
          <Summary
            label="Saved recommendation"
            value={formatDisplayLabel(record.analysisContext.recommendation)}
          />
          <Summary label="Saved" value={formatDateLabel(record.savedAt)} />
        </div>
        {showPrimaryDemoCue ? (
          <div className="mt-3 rounded-[1.1rem] border border-slate-300/45 bg-white/42 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.44)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700/58">
              Recommended Demo Result
            </p>
            <p className="mt-1 text-sm leading-5 text-ink/78">
              This is the recommended live-demo record. Use it to show that saved analysis context
              stays intact while workflow fields remain editable.
            </p>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-[28px] border border-emerald-300/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,250,247,0.9))] shadow-[0_18px_38px_rgba(14,28,20,0.06),inset_0_1px_0_rgba(255,255,255,0.5)]">
        <div className="border-b border-emerald-200/60 bg-[linear-gradient(180deg,rgba(230,244,237,0.88),rgba(246,250,247,0.62))] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-900/56">
                Editable workflow fields
              </p>
              <h3 className="mt-1 text-xl font-semibold text-ink">Current next-step management</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-5 text-ink/72">
                Update only the tracker fields that help you manage this role now.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge
                value={record.applicationStatus}
                kind="application"
                labelOverride={getTrackerStatusDisplayLabel(record.applicationStatus)}
              />
              <StatusBadge
                value={record.networkingStatus}
                kind="networking"
                labelOverride={getTrackerStatusDisplayLabel(record.networkingStatus)}
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Application status">
              <select
                value={record.applicationStatus}
                onChange={(event) =>
                  updateRecord({
                    applicationStatus: event.target.value as TrackerRecord["applicationStatus"]
                  })
                }
                className="app-input"
              >
                {applicationStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Networking status">
              <select
                value={record.networkingStatus}
                onChange={(event) =>
                  updateRecord({
                    networkingStatus: event.target.value as TrackerRecord["networkingStatus"]
                  })
                }
                className="app-input"
              >
                {networkingStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Application date" helper="When the application was sent.">
              <input
                type="date"
                value={record.applicationDate ?? ""}
                onChange={(event) =>
                  updateRecord({ applicationDate: event.target.value || null })
                }
                className="app-input"
              />
            </Field>
            <Field label="Follow-up date" helper="Use this for the next check-in or reminder.">
              <input
                type="date"
                value={record.followUpDate ?? ""}
                onChange={(event) =>
                  updateRecord({ followUpDate: event.target.value || null })
                }
                className="app-input"
              />
            </Field>
            <Field label="Interview stage" helper="Current process step, if active.">
              <input
                value={record.interviewStage ?? ""}
                onChange={(event) =>
                  updateRecord({ interviewStage: event.target.value || null })
                }
                placeholder="Recruiter screen"
                className="app-input"
              />
            </Field>
            <Field label="Outcome" helper="Latest result or waiting state.">
              <input
                value={record.outcome ?? ""}
                onChange={(event) =>
                  updateRecord({ outcome: event.target.value || null })
                }
                placeholder="Awaiting response"
                className="app-input"
              />
            </Field>

            <Field
              label="Notes"
              helper="Working notes for outreach, timing, or decision context."
              className="md:col-span-2 xl:col-span-3"
            >
              <textarea
                rows={4}
                value={record.notes ?? ""}
                onChange={(event) => updateRecord({ notes: event.target.value || null })}
                className="app-input resize-y"
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-900/50">
            Navigation
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/tracker"
              className="app-button-primary"
            >
              Back to tracker
            </Link>
            <Link
              href="/new-analysis"
              className="app-button-secondary"
            >
              Start new analysis
            </Link>
            <button
              type="button"
              onClick={deleteRecord}
              className="inline-flex items-center justify-center rounded-full border border-danger/25 bg-danger-soft px-5 py-3 text-sm font-semibold text-danger no-underline transition hover:border-danger/40 hover:bg-danger-soft/80"
            >
              Delete record
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-sky-200/60 bg-[linear-gradient(180deg,rgba(251,253,254,0.92),rgba(241,247,249,0.86))] shadow-[0_14px_30px_rgba(22,41,50,0.05),inset_0_1px_0_rgba(255,255,255,0.52)]">
        <button
          type="button"
          onClick={() => setShowReadOnlyContext((current) => !current)}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-sky-50/48 sm:px-6"
          aria-expanded={showReadOnlyContext}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-900/48">
              Locked analysis context
            </p>
            <h3 className="mt-1 text-lg font-semibold text-ink">Original fit logic</h3>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-ink/68">
              Read-only support from the saved analysis. It does not change when workflow fields are updated.
            </p>
          </div>
          <span className="app-disclosure-toggle shrink-0">
            {showReadOnlyContext ? "COLLAPSE" : "EXPAND"}
          </span>
        </button>

        {showReadOnlyContext ? (
          <div className="space-y-4 border-t border-sky-200/60 px-5 py-5 sm:px-6">
            <section className="rounded-[22px] border border-sky-200/60 bg-white/52 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-900/48">
                Saved summary
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/80">{record.analysisContext.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <StatusBadge value={record.analysisContext.recommendation} kind="fit" />
                <p className="text-sm leading-6 text-ink/70">{record.analysisContext.nextAction}</p>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <ContextList title="Positive signals" items={record.analysisContext.positiveSignals} />
              <ContextList title="Risk flags" items={record.analysisContext.riskFlags} />
              <ContextList
                title="Strongest proof"
                items={record.analysisContext.strongestMatchingProof.map((item) => item.claim)}
              />
              <ContextList
                title="Open gaps"
                items={record.analysisContext.gaps.map((gap) => `${gap.gapType}: ${gap.detail}`)}
              />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function getTrackerStatusDisplayLabel(value: string): string | undefined {
  if (value === "apply_now") {
    return "Ready to apply";
  }

  if (value === "not_applicable") {
    return "Direct apply";
  }

  return undefined;
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="app-card p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-1.5 text-sm font-semibold leading-5 text-ink/85">{value}</p>
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
  helper?: string;
  className?: string;
}) {
  return (
    <label className={`block space-y-2 ${className ?? ""}`}>
      <span
        className="text-sm font-semibold text-emerald-950/88"
        style={{ fontFamily: '"Aptos", "Segoe UI", sans-serif' }}
      >
        {label}
      </span>
      {children}
      {helper ? (
        <span className="block text-sm leading-5 text-emerald-950/60">{helper}</span>
      ) : null}
    </label>
  );
}

function ContextList({
  title,
  items
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="app-panel p-4">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <ul className="mt-2.5 space-y-1">
        {items.length ? (
          items.map((item) => (
            <li
              key={item}
              className="rounded-[0.95rem] border border-line/40 bg-surface/22 px-3 py-1.5 text-sm leading-5 text-ink/80"
            >
              {item}
            </li>
          ))
        ) : (
          <li className="rounded-[0.95rem] border border-line/40 bg-surface/22 px-3 py-1.5 text-sm leading-5 text-ink/65">
            No items recorded.
          </li>
        )}
      </ul>
    </section>
  );
}
