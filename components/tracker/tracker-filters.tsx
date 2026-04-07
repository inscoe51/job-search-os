"use client";

import type { ReactNode } from "react";

import {
  applicationStatusLabels,
  applicationStatusValues,
  networkingStatusLabels,
  networkingStatusValues
} from "@/lib/domain/tracker-status";
import type { TrackerFilters } from "@/lib/tracker/tracker-filters";

type TrackerFiltersPanelProps = {
  filters: TrackerFilters;
  laneOptions: string[];
  resumeVariantOptions: string[];
  onChange: (updates: Partial<TrackerFilters>) => void;
};

export function TrackerFiltersPanel({
  filters,
  laneOptions,
  resumeVariantOptions,
  onChange
}: TrackerFiltersPanelProps) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <FilterField label="Application status">
        <select
          value={filters.applicationStatus}
          onChange={(event) => onChange({ applicationStatus: event.target.value })}
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
          onChange={(event) => onChange({ networkingStatus: event.target.value })}
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
          onChange={(event) => onChange({ laneMatched: event.target.value })}
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
          onChange={(event) => onChange({ resumeVariant: event.target.value })}
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

      <FilterField label="Workflow focus">
        <select
          value={filters.workflowFocus}
          onChange={(event) =>
            onChange({
              workflowFocus: event.target.value as TrackerFilters["workflowFocus"]
            })
          }
          className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
        >
          <option value="all">All</option>
          <option value="follow_up_due">Follow-up due</option>
          <option value="current_stage">Current stage</option>
        </select>
      </FilterField>

      <FilterField label="Sort by">
        <select
          value={filters.sortBy}
          onChange={(event) =>
            onChange({
              sortBy: event.target.value as TrackerFilters["sortBy"]
            })
          }
          className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3"
        >
          <option value="newest">Newest</option>
          <option value="fitScore">Fit score</option>
          <option value="followUpDate">Follow-up date</option>
        </select>
      </FilterField>
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
