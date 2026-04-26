import type { TrackerRecord } from "@/lib/validation/schemas";
import type {
  TrackerRepository,
  TrackerWorkflowUpdate
} from "@/lib/repository/tracker-repository";
import { sanitizeTrackerWorkflowUpdate } from "@/lib/repository/tracker-repository";
import { trackerRecordSchema } from "@/lib/validation/schemas";
import { nowIso } from "@/lib/utils/dates";

export class MemoryTrackerRepository implements TrackerRepository {
  constructor(private records: TrackerRecord[] = []) {}

  list(): TrackerRecord[] {
    return [...this.records];
  }

  get(jobId: string): TrackerRecord | null {
    return this.records.find((record) => record.jobId === jobId) ?? null;
  }

  save(record: TrackerRecord): TrackerRecord {
    this.records = [record, ...this.records.filter((item) => item.jobId !== record.jobId)];
    return record;
  }

  update(jobId: string, updates: TrackerWorkflowUpdate): TrackerRecord | null {
    const current = this.get(jobId);

    if (!current) {
      return null;
    }

    const sanitizedUpdates = sanitizeTrackerWorkflowUpdate(updates);

    const next = trackerRecordSchema.parse({
      ...current,
      ...sanitizedUpdates,
      updatedAt: nowIso()
    });
    this.records = [next, ...this.records.filter((record) => record.jobId !== jobId)];
    return next;
  }

  remove(jobId: string): boolean {
    const nextRecords = this.records.filter((record) => record.jobId !== jobId);

    if (nextRecords.length === this.records.length) {
      return false;
    }

    this.records = nextRecords;
    return true;
  }
}
