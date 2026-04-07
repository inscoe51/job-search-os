import type { TrackerRecord } from "@/lib/validation/schemas";

export type TrackerWorkflowUpdate = Partial<
  Pick<
    TrackerRecord,
    | "networkingStatus"
    | "applicationStatus"
    | "applicationDate"
    | "followUpDate"
    | "interviewStage"
    | "outcome"
    | "notes"
  >
>;

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

  for (const field of trackerWorkflowUpdateFields) {
    if (field in updates) {
      sanitized[field] = updates[field];
    }
  }

  return sanitized;
}

export interface TrackerRepository {
  list(): TrackerRecord[];
  get(jobId: string): TrackerRecord | null;
  save(record: TrackerRecord): TrackerRecord;
  update(jobId: string, updates: TrackerWorkflowUpdate): TrackerRecord | null;
}
