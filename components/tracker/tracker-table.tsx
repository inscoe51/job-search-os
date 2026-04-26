"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { isPrimaryDemoSource } from "@/lib/demo/sample-job-posting";
import { formatDisplayLabel } from "@/lib/display/labels";
import { TrackerFiltersPanel } from "@/components/tracker/tracker-filters";
import { createBrowserTrackerRepository } from "@/lib/repository/browser-tracker-repository";
import {
  defaultTrackerFilters,
  filterAndSortTrackerRecords,
  type TrackerFilters
} from "@/lib/tracker/tracker-filters";
import type { TrackerRecord } from "@/lib/validation/schemas";
import { formatDateLabel } from "@/lib/utils/dates";

type TrackerTableProps = {
  initialRecords?: TrackerRecord[];
};

export function TrackerTable({ initialRecords }: TrackerTableProps = {}) {
  const repository = useMemo(() => createBrowserTrackerRepository(), []);
  const [records, setRecords] = useState<TrackerRecord[]>(initialRecords ?? []);
  const [filters, setFilters] = useState<TrackerFilters>(defaultTrackerFilters);

  useEffect(() => {
    if (!initialRecords) {
      setRecords(repository.list());
    }
  }, [initialRecords, repository]);

  const filteredRecords = useMemo(
    () => filterAndSortTrackerRecords(records, filters),
    [records, filters]
  );
  const laneOptions = Array.from(new Set(records.map((record) => record.laneMatched)));
  const resumeVariantOptions = Array.from(
    new Set(records.map((record) => record.resumeVariant))
  );
  const followUpDueCount = records.filter(
    (record) => record.applicationStatus === "follow_up_due"
  ).length;
  const currentStageCount = records.filter((record) =>
    ["interviewing", "offer"].includes(record.applicationStatus)
  ).length;
  const primaryDemoRecord =
    records.find((record) => isPrimaryDemoSource(record.source)) ?? null;

  if (!records.length) {
    return (
      <EmptyState
        title="No saved roles yet"
        body="Run a first-pass analysis and save the decision to create the weekly review list for this demo."
        actionHref="/new-analysis"
        actionLabel="Start new analysis"
      />
    );
  }

  return (
    <div className="space-y-4">
      <section className="app-page-hero-quiet">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="app-kicker">Screen 4</p>
            <h2 className="mt-1.5 text-[1.7rem] font-semibold text-ink">Tracker / Weekly Review</h2>
            <p className="mt-1 text-sm leading-5 text-ink/72">
              Review saved roles, filter for action, and open one record for workflow updates.
            </p>
          </div>
          <Link href="/" className="app-button-ghost px-3 py-1.5 text-sm">
            Return to home page
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <MetricChip label="Saved roles" value={String(records.length)} />
          <MetricChip label="Follow-up due" value={String(followUpDueCount)} />
          <MetricChip label="Active stage" value={String(currentStageCount)} />
        </div>

        <TrackerFiltersPanel
          filters={filters}
          laneOptions={laneOptions}
          resumeVariantOptions={resumeVariantOptions}
          visibleCount={filteredRecords.length}
          totalCount={records.length}
          onReset={() => setFilters(defaultTrackerFilters)}
          onChange={(updates) =>
            setFilters((current) => ({
              ...current,
              ...updates
            }))
          }
        />
        {primaryDemoRecord ? (
          <div className="mt-2.5 rounded-[1.1rem] border border-slate-300/45 bg-[linear-gradient(180deg,rgba(248,251,252,0.9),rgba(241,247,249,0.78))] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.44)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700/58">Recommended Demo Result</p>
            <div className="mt-1 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm leading-5 text-ink/76">
                The recommended live demo record is saved. Open{" "}
                <span className="font-semibold text-ink">
                  {primaryDemoRecord.company} / {primaryDemoRecord.title}
                </span>{" "}
                to show the persisted analysis context and editable workflow state.
              </p>
              <Link
                href={`/tracker/${primaryDemoRecord.jobId}`}
                className="app-button-primary px-3 py-1.5 text-sm"
              >
                Open recommended result
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      {!filteredRecords.length ? (
        <section className="app-panel border-slate-300/55 border-dashed bg-[linear-gradient(180deg,rgba(249,252,253,0.96),rgba(242,247,249,0.88))] p-8 text-center shadow-[0_16px_34px_rgba(22,37,47,0.05),inset_0_1px_0_rgba(255,255,255,0.5)]">
          <p className="app-kicker">MVP state</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">No roles match the current review filters</h3>
          <p className="mx-auto mt-2.5 max-w-xl text-sm leading-5 text-ink/70">
            Adjust the tracker filters or reset them to return to the full weekly review list.
          </p>
          <button
            type="button"
            onClick={() => setFilters(defaultTrackerFilters)}
            className="app-button-primary mt-5"
          >
            Reset filters
          </button>
        </section>
      ) : null}

      <section
        className={`${
          filteredRecords.length
            ? "app-panel overflow-hidden border-slate-300/55 bg-[linear-gradient(180deg,rgba(251,253,253,0.98),rgba(243,247,249,0.92))] shadow-[0_18px_38px_rgba(22,37,47,0.06),inset_0_1px_0_rgba(255,255,255,0.52)]"
            : "hidden"
        }`}
      >
        <div className="flex flex-col gap-1.5 border-b border-slate-300/45 bg-white/36 px-4 py-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700/60">
              Weekly review list
            </p>
            <p className="mt-0.5 text-sm leading-5 text-ink/68">
              Scan the job, fit strength, recommended action, and current workflow state.
            </p>
          </div>
          <p className="text-sm font-semibold text-ink/72">
            {filteredRecords.length} shown
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100/80 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700/60">
              <tr>
                <th className="px-4 py-3.5">Job</th>
                <th className="px-4 py-3.5">Fit</th>
                <th className="px-4 py-3.5">Recommended action</th>
                <th className="px-4 py-3.5">Current state</th>
                <th className="px-4 py-3.5">Open</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.jobId}
                  className="border-t border-slate-300/45 align-top bg-white/24 transition-colors hover:bg-slate-100/55"
                >
                  <td className="w-[34%] px-4 py-3.5 align-top">
                    <p className="font-semibold leading-5 text-ink">{record.title}</p>
                    <p className="mt-0.5 text-sm leading-5 text-ink/72">{record.company}</p>
                  </td>
                  <td className="w-[18%] px-4 py-3.5 align-top">
                    <div className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-slate-300/45 bg-white/58 px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.46)]">
                      <span className="text-sm font-semibold leading-none text-ink">
                        {record.fitScore}/100
                      </span>
                      <StatusBadge value={record.fitVerdict} kind="fit" />
                    </div>
                  </td>
                  <td className="w-[20%] px-4 py-3.5 align-top">
                    <StatusBadge
                      value={record.analysisContext.recommendation}
                      kind="fit"
                      labelOverride={formatDisplayLabel(record.analysisContext.recommendation)}
                    />
                  </td>
                  <td className="w-[20%] px-4 py-3.5 align-top">
                    <div className="space-y-1.5">
                      <StatusBadge
                        value={record.applicationStatus}
                        kind="application"
                        labelOverride={getTrackerStatusDisplayLabel(record.applicationStatus)}
                      />
                      {record.followUpDate ? (
                        <p className="text-xs leading-4 text-ink/60">
                          Follow-up {formatDateLabel(record.followUpDate)}
                        </p>
                      ) : null}
                    </div>
                  </td>
                  <td className="w-[8%] px-4 py-3.5 align-top">
                    <Link
                      href={`/tracker/${record.jobId}`}
                      className="app-button-ghost px-2.5 py-1 text-xs"
                    >
                      Open record
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-slate-300/55 bg-slate-100/78 px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700/58">{label}</span>
      <span className="ml-1 text-sm font-semibold text-ink/85">{value}</span>
    </div>
  );
}

function getTrackerStatusDisplayLabel(value: string): string | undefined {
  if (value === "apply_now") {
    return "Ready to apply";
  }

  if (value === "hold_for_variant") {
    return "Hold for resume variant";
  }

  if (value === "not_applicable") {
    return "Direct apply";
  }

  return undefined;
}
