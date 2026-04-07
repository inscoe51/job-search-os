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

  if (!records.length) {
    return (
      <EmptyState
        title="Tracker is empty"
        body="Run a first-pass analysis and save the decision to create your weekly review list."
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
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Keep the list practical: focus on status, follow-up timing, and which saved role needs attention this week.
        </p>

        <TrackerFiltersPanel
          filters={filters}
          laneOptions={laneOptions}
          resumeVariantOptions={resumeVariantOptions}
          onChange={(updates) =>
            setFilters((current) => ({
              ...current,
              ...updates
            }))
          }
        />
      </section>

      <section className="overflow-hidden rounded-3xl border border-ink/10 bg-panel shadow-card">
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
                <tr key={record.jobId} className="border-t border-ink/8">
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold">{record.company}</p>
                    <p className="text-xs text-ink/55">{record.resumeVariant}</p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold">{record.title}</p>
                    <p className="mt-1 text-xs text-ink/55">{record.source}</p>
                  </td>
                  <td className="px-5 py-4 align-top">{record.laneMatched}</td>
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
                    {formatDateLabel(record.followUpDate)}
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
