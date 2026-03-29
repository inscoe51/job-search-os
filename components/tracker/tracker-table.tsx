"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  applicationStatusLabels,
  applicationStatusValues,
  networkingStatusLabels,
  networkingStatusValues
} from "@/lib/domain/tracker-status";
import { createBrowserTrackerRepository } from "@/lib/repository/browser-tracker-repository";
import {
  defaultTrackerFilters,
  filterAndSortTrackerRecords,
  type TrackerFilters
} from "@/lib/tracker/tracker-filters";
import type { TrackerRecord } from "@/lib/validation/schemas";
import { formatDateLabel } from "@/lib/utils/dates";

export function TrackerTable() {
  const repository = useMemo(() => createBrowserTrackerRepository(), []);
  const [records, setRecords] = useState<TrackerRecord[]>([]);
  const [filters, setFilters] = useState<TrackerFilters>(defaultTrackerFilters);

  useEffect(() => {
    setRecords(repository.list());
  }, [repository]);

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

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <FilterField label="Application status">
            <select
              value={filters.applicationStatus}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  applicationStatus: event.target.value
                }))
              }
              className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
            >
              <option value="all">All</option>
              {applicationStatusValues.map((value) => (
                <option key={value} value={value}>
                  {applicationStatusLabels[value]}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Networking status">
            <select
              value={filters.networkingStatus}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  networkingStatus: event.target.value
                }))
              }
              className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
            >
              <option value="all">All</option>
              {networkingStatusValues.map((value) => (
                <option key={value} value={value}>
                  {networkingStatusLabels[value]}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Lane matched">
            <select
              value={filters.laneMatched}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  laneMatched: event.target.value
                }))
              }
              className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
            >
              <option value="all">All</option>
              {laneOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Resume variant">
            <select
              value={filters.resumeVariant}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  resumeVariant: event.target.value
                }))
              }
              className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
            >
              <option value="all">All</option>
              {resumeVariantOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Sort by">
            <select
              value={filters.sortBy}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  sortBy: event.target.value as TrackerFilters["sortBy"]
                }))
              }
              className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
            >
              <option value="newest">Newest</option>
              <option value="fitScore">Fit score</option>
              <option value="followUpDate">Follow-up date</option>
            </select>
          </FilterField>
        </div>
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

function FilterField({
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
