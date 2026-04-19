"use client";

import type { ReactNode } from "react";

import {
  type ApplicationStatus,
  applicationStatusOptions,
  type NetworkingStatus,
  networkingStatusOptions
} from "@/lib/domain/tracker-status";
import type { TrackerFilters } from "@/lib/tracker/tracker-filters";

type TrackerFiltersPanelProps = {
  filters: TrackerFilters;
  laneOptions: string[];
  resumeVariantOptions: string[];
  onChange: (updates: Partial<TrackerFilters>) => void;
  onReset: () => void;
  visibleCount: number;
  totalCount: number;
};

export function TrackerFiltersPanel({
  filters,
  laneOptions,
  resumeVariantOptions,
  onChange,
  onReset,
  visibleCount,
  totalCount
}: TrackerFiltersPanelProps) {
  function handleApplicationStatusChange(value: string) {
    onChange({
      applicationStatus: value as "all" | ApplicationStatus
    });
  }

  function handleNetworkingStatusChange(value: string) {
    onChange({
      networkingStatus: value as "all" | NetworkingStatus
    });
  }

  return (
    <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-300/55 bg-[linear-gradient(180deg,rgba(248,251,252,0.96),rgba(240,246,248,0.88))] p-3 shadow-[0_14px_30px_rgba(22,37,47,0.05),inset_0_1px_0_rgba(255,255,255,0.52)] sm:p-3.5">
      <div className="flex flex-col gap-2 border-b border-slate-300/45 pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700/60">Review filters</p>
          <p className="mt-0.5 text-sm leading-5 text-ink/75">
            Showing {visibleCount} of {totalCount} saved role{totalCount === 1 ? "" : "s"}.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="app-button-ghost"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <FilterField label="Application status">
          <select
            value={filters.applicationStatus}
            onChange={(event) => handleApplicationStatusChange(event.target.value)}
            className="app-input min-h-[2.75rem] py-2"
          >
            <option value="all">All</option>
            {applicationStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Networking status">
          <select
            value={filters.networkingStatus}
            onChange={(event) => handleNetworkingStatusChange(event.target.value)}
            className="app-input min-h-[2.75rem] py-2"
          >
            <option value="all">All</option>
            {networkingStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Lane matched">
          <select
            value={filters.laneMatched}
            onChange={(event) => onChange({ laneMatched: event.target.value })}
            className="app-input min-h-[2.75rem] py-2"
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
            className="app-input min-h-[2.75rem] py-2"
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
            className="app-input min-h-[2.75rem] py-2"
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
            className="app-input min-h-[2.75rem] py-2"
          >
            <option value="newest">Newest</option>
            <option value="fitScore">Fit score</option>
            <option value="followUpDate">Follow-up date</option>
          </select>
        </FilterField>
      </div>
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
    <label className="block space-y-1.5">
      <span
        className="text-sm font-semibold text-slate-800/88"
        style={{ fontFamily: '"Aptos", "Segoe UI", sans-serif' }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
