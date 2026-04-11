"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
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
    <div className="space-y-6">
      <section className="rounded-3xl border border-ink/10 bg-panel p-6 shadow-card">
        <p className="text-xs uppercase tracking-[0.25em] text-ink/55">Screen 4</p>
        <h2 className="mt-2 text-2xl font-semibold">Tracker / Weekly Review</h2>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Review saved roles, filter for action, and open one record for workflow updates.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
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
      </section>

      {!filteredRecords.length ? (
        <section className="rounded-3xl border border-dashed border-ink/20 bg-panel p-10 text-center shadow-card">
          <p className="text-xs uppercase tracking-[0.25em] text-ink/55">MVP state</p>
          <h3 className="mt-2 text-2xl font-semibold">No roles match the current review filters</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/70">
            Adjust the tracker filters or reset them to return to the full weekly review list.
          </p>
          <button
            type="button"
            onClick={() => setFilters(defaultTrackerFilters)}
            className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
          >
            Reset filters
          </button>
        </section>
      ) : null}

      <section
        className={`${
          filteredRecords.length
            ? "overflow-hidden rounded-3xl border border-ink/10 bg-panel shadow-card"
            : "hidden"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-[0.2em] text-ink/55">
              <tr>
                <th className="px-5 py-4">Company</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Lane</th>
                <th className="px-5 py-4">Fit</th>
                <th className="px-5 py-4">Statuses</th>
                <th className="px-5 py-4">Follow-up</th>
                <th className="px-5 py-4">Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.jobId} className="border-t border-ink/8 align-top">
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold">{record.company}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink/50">
                      {record.resumeVariant.replace(/_/g, " ")}
                    </p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold">{record.title}</p>
                    <p className="mt-2 text-xs text-ink/55">{record.source}</p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="max-w-xs leading-6 text-ink/80">{record.laneMatched}</p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold">{record.fitScore}/100</p>
                    <div className="mt-2 flex gap-2">
                      <StatusBadge value={record.fitVerdict} kind="fit" />
                      <StatusBadge value={record.lifeFitLabel} kind="life" />
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-col gap-2">
                      <StatusBadge value={record.applicationStatus} kind="application" />
                      <StatusBadge value={record.networkingStatus} kind="networking" />
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold">{formatDateLabel(record.followUpDate)}</p>
                    <p className="mt-1 text-xs text-ink/55">
                      Saved {formatDateLabel(record.savedAt)}
                    </p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Link
                      href={`/tracker/${record.jobId}`}
                      className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold no-underline"
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
    <div className="rounded-full bg-surface px-4 py-2">
      <span className="text-xs uppercase tracking-[0.18em] text-ink/55">{label}</span>
      <span className="ml-2 text-sm font-semibold text-ink/85">{value}</span>
    </div>
  );
}
