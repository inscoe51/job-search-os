import type { TrackerRecord } from "@/lib/validation/schemas";
import { trackerRecordSchema } from "@/lib/validation/schemas";
import type {
  TrackerRepository,
  TrackerWorkflowUpdate
} from "@/lib/repository/tracker-repository";
import { sanitizeTrackerWorkflowUpdate } from "@/lib/repository/tracker-repository";
import { nowIso } from "@/lib/utils/dates";

const TRACKER_STORAGE_KEY = "job-search-os:tracker-records";

function readRecords(): TrackerRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(TRACKER_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown[];
    return parsed.map((item) => trackerRecordSchema.parse(item));
  } catch {
    return [];
  }
}

function writeRecords(records: TrackerRecord[]) {
  window.localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(records));
}

export class BrowserTrackerRepository implements TrackerRepository {
  list(): TrackerRecord[] {
    return readRecords();
  }

  get(jobId: string): TrackerRecord | null {
    return readRecords().find((record) => record.jobId === jobId) ?? null;
  }

  save(record: TrackerRecord): TrackerRecord {
    const records = readRecords();
    const nextRecords = [record, ...records.filter((item) => item.jobId !== record.jobId)];
    writeRecords(nextRecords);
    return record;
  }

  update(jobId: string, updates: TrackerWorkflowUpdate): TrackerRecord | null {
    const records = readRecords();
    const existing = records.find((record) => record.jobId === jobId);

    if (!existing) {
      return null;
    }

    const sanitizedUpdates = sanitizeTrackerWorkflowUpdate(updates);

    const updatedRecord = trackerRecordSchema.parse({
      ...existing,
      ...sanitizedUpdates,
      updatedAt: nowIso()
    });

    writeRecords([
      updatedRecord,
      ...records.filter((record) => record.jobId !== jobId)
    ]);

    return updatedRecord;
  }

  remove(jobId: string): boolean {
    const records = readRecords();
    const nextRecords = records.filter((record) => record.jobId !== jobId);

    if (nextRecords.length === records.length) {
      return false;
    }

    writeRecords(nextRecords);
    return true;
  }
}

export function createBrowserTrackerRepository(): TrackerRepository {
  return new BrowserTrackerRepository();
}
