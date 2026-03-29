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

export interface TrackerRepository {
  list(): TrackerRecord[];
  get(jobId: string): TrackerRecord | null;
  save(record: TrackerRecord): TrackerRecord;
  update(jobId: string, updates: TrackerWorkflowUpdate): TrackerRecord | null;
}
