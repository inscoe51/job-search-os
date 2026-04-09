import type {
  ApplicationStatus,
  NetworkingStatus
} from "@/lib/domain/tracker-status";
import type { TrackerRecord } from "@/lib/validation/schemas";

export type TrackerWorkflowUpdate = {
  networkingStatus?: NetworkingStatus;
  applicationStatus?: ApplicationStatus;
  applicationDate?: TrackerRecord["applicationDate"];
  followUpDate?: TrackerRecord["followUpDate"];
  interviewStage?: TrackerRecord["interviewStage"];
  outcome?: TrackerRecord["outcome"];
  notes?: TrackerRecord["notes"];
};

const trackerWorkflowUpdateFields = [
  "networkingStatus",
  "applicationStatus",
  "applicationDate",
  "followUpDate",
  "interviewStage",
  "outcome",
  "notes"
] as const satisfies ReadonlyArray<keyof TrackerWorkflowUpdate>;

export function sanitizeTrackerWorkflowUpdate(
  updates: TrackerWorkflowUpdate
): TrackerWorkflowUpdate {
  const sanitized: TrackerWorkflowUpdate = {};

  if ("networkingStatus" in updates) {
    sanitized.networkingStatus = updates.networkingStatus;
  }

  if ("applicationStatus" in updates) {
    sanitized.applicationStatus = updates.applicationStatus;
  }

  if ("applicationDate" in updates) {
    sanitized.applicationDate = updates.applicationDate;
  }

  if ("followUpDate" in updates) {
    sanitized.followUpDate = updates.followUpDate;
  }

  if ("interviewStage" in updates) {
    sanitized.interviewStage = updates.interviewStage;
  }

  if ("outcome" in updates) {
    sanitized.outcome = updates.outcome;
  }

  if ("notes" in updates) {
    sanitized.notes = updates.notes;
  }

  return sanitized;
}

export interface TrackerRepository {
  list(): TrackerRecord[];
  get(jobId: string): TrackerRecord | null;
  save(record: TrackerRecord): TrackerRecord;
  update(jobId: string, updates: TrackerWorkflowUpdate): TrackerRecord | null;
}
