import type { TrackerRecord } from "@/lib/validation/schemas";

export type TrackerFilters = {
  applicationStatus: string;
  networkingStatus: string;
  laneMatched: string;
  resumeVariant: string;
  sortBy: "newest" | "fitScore" | "followUpDate";
};

export const defaultTrackerFilters: TrackerFilters = {
  applicationStatus: "all",
  networkingStatus: "all",
  laneMatched: "all",
  resumeVariant: "all",
  sortBy: "newest"
};

export function filterAndSortTrackerRecords(
  records: TrackerRecord[],
  filters: TrackerFilters
): TrackerRecord[] {
  const filtered = records.filter((record) => {
    if (
      filters.applicationStatus !== "all" &&
      record.applicationStatus !== filters.applicationStatus
    ) {
      return false;
    }

    if (
      filters.networkingStatus !== "all" &&
      record.networkingStatus !== filters.networkingStatus
    ) {
      return false;
    }

    if (filters.laneMatched !== "all" && record.laneMatched !== filters.laneMatched) {
      return false;
    }

    if (
      filters.resumeVariant !== "all" &&
      record.resumeVariant !== filters.resumeVariant
    ) {
      return false;
    }

    return true;
  });

  return filtered.sort((left, right) => {
    if (filters.sortBy === "fitScore") {
      return right.fitScore - left.fitScore;
    }

    if (filters.sortBy === "followUpDate") {
      const leftValue = left.followUpDate ?? "9999-12-31";
      const rightValue = right.followUpDate ?? "9999-12-31";
      return leftValue.localeCompare(rightValue);
    }

    return right.savedAt.localeCompare(left.savedAt);
  });
}
