"use client";

import Link from "next/link";
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
  const repository = useMemo(() => createBrowserTrackerRepository(), []);
  const [record, setRecord] = useState<TrackerRecord | null>(initialRecord);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <div className="space-y-6">
      <section className="app-panel p-6 sm:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="app-kicker">Screen 5</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Tracker Record Detail</h2>
            <p className="mt-2 text-sm leading-6 text-ink/72">
              Update workflow state without rerunning the original fit analysis.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={record.applicationStatus} kind="application" />
            <StatusBadge value={record.networkingStatus} kind="networking" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Summary label="Company" value={record.company} />
          <Summary label="Title" value={record.title} />
          <Summary label="Saved lane" value={record.laneMatched} />
          <Summary label="Saved" value={formatDateLabel(record.savedAt)} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Summary label="Saved fit verdict" value={formatDisplayLabel(record.fitVerdict)} />
          <Summary
            label="Saved resume direction"
            value={formatResumeDirectionLabel(record.resumeVariant)}
          />
          <Summary
            label="Saved next move"
            value={formatDisplayLabel(record.analysisContext.recommendation)}
          />
        </div>
        {showPrimaryDemoCue ? (
          <div className="app-callout mt-5">
            <p className="app-mini-label">Recommended Demo Result</p>
            <p className="mt-2 text-sm leading-6 text-ink/80">
              This is the recommended live-demo record. Use it to show that saved analysis context
              stays intact while workflow fields remain editable.
            </p>
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="app-panel p-6">
          <p className="app-kicker">Editable workflow fields</p>
          <h3 className="text-xl font-semibold text-ink">Workflow updates</h3>
          <p className="mt-2 text-sm leading-6 text-ink/72">
            Edit only the approved tracker workflow fields here. Saved fit, lane,
            and resume-direction context remains read-only below.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
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
            <Field label="Application date">
              <input
                type="date"
                value={record.applicationDate ?? ""}
                onChange={(event) =>
                  updateRecord({ applicationDate: event.target.value || null })
                }
                className="app-input"
              />
            </Field>
            <Field label="Follow-up date">
              <input
                type="date"
                value={record.followUpDate ?? ""}
                onChange={(event) =>
                  updateRecord({ followUpDate: event.target.value || null })
                }
                className="app-input"
              />
            </Field>
            <Field label="Interview stage">
              <input
                value={record.interviewStage ?? ""}
                onChange={(event) =>
                  updateRecord({ interviewStage: event.target.value || null })
                }
                className="app-input"
              />
            </Field>
            <Field label="Outcome">
              <input
                value={record.outcome ?? ""}
                onChange={(event) =>
                  updateRecord({ outcome: event.target.value || null })
                }
                className="app-input"
              />
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              rows={5}
              value={record.notes ?? ""}
              onChange={(event) => updateRecord({ notes: event.target.value || null })}
              className="app-input mt-2"
            />
          </Field>

          {error ? (
            <p className="mt-4 rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
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
          </div>
        </div>

        <div className="space-y-6">
          <section className="app-panel p-6">
            <p className="app-kicker">Read-only analysis context</p>
            <h3 className="text-xl font-semibold text-ink">Original analysis context</h3>
            <p className="mt-2 text-sm leading-6 text-ink/72">
              Read-only saved analysis context from the original review. Updating
              workflow state here does not rerun or rewrite fit analysis.
            </p>
            <div className="app-subpanel mt-5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Saved summary</p>
              <p className="mt-3 text-sm leading-7 text-ink/80">{record.analysisContext.summary}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StatusBadge value={record.analysisContext.recommendation} kind="fit" />
              <p className="text-sm leading-7 text-ink/70">{record.analysisContext.nextAction}</p>
            </div>
          </section>

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
      </section>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="app-card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink/85">{value}</p>
    </div>
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
    <label className="mt-5 block space-y-2">
      <span className="app-label">{label}</span>
      {children}
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
    <section className="app-panel p-6">
      <h3 className="text-xl font-semibold text-ink">{title}</h3>
      <ul className="mt-4 space-y-2">
        {items.length ? (
          items.map((item) => (
            <li key={item} className="app-card px-4 py-3 text-sm leading-6 text-ink/80">
              {item}
            </li>
          ))
        ) : (
          <li className="app-card px-4 py-3 text-sm text-ink/65">
            No items recorded.
          </li>
        )}
      </ul>
    </section>
  );
}
