import type {
  ApplicationStatus,
  NetworkingStatus
} from "@/lib/domain/tracker-status";
import type { TrackerRecord } from "@/lib/validation/schemas";

export type TrackerFilters = {
  applicationStatus: "all" | ApplicationStatus;
  networkingStatus: "all" | NetworkingStatus;
  laneMatched: string;
  resumeVariant: string;
  workflowFocus: "all" | "follow_up_due" | "current_stage";
  sortBy: "newest" | "fitScore" | "followUpDate";
};

export const defaultTrackerFilters: TrackerFilters = {
  applicationStatus: "all",
  networkingStatus: "all",
  laneMatched: "all",
  resumeVariant: "all",
  workflowFocus: "all",
  sortBy: "newest"
};

function isFollowUpDue(record: TrackerRecord): boolean {
  if (record.applicationStatus === "follow_up_due") {
    return true;
  }

  if (!record.followUpDate) {
    return false;
  }

  const today = new Date().toISOString().slice(0, 10);
  return record.followUpDate <= today;
}

function isCurrentStage(record: TrackerRecord): boolean {
  return (
    Boolean(record.interviewStage) ||
    record.applicationStatus === "interviewing" ||
    record.applicationStatus === "offer"
  );
}

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

    if (filters.workflowFocus === "follow_up_due" && !isFollowUpDue(record)) {
      return false;
    }

    if (filters.workflowFocus === "current_stage" && !isCurrentStage(record)) {
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
