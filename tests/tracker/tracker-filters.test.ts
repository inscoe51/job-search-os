import { describe, expect, it, vi } from "vitest";

import { filterAndSortTrackerRecords } from "@/lib/tracker/tracker-filters";
import type { TrackerRecord } from "@/lib/validation/schemas";

function createRecord(overrides: Partial<TrackerRecord>): TrackerRecord {
  return {
    jobId: "job_1",
    source: "manual-entry:session_1",
    company: "North Ridge Home Services",
    title: "Operations Coordinator",
    laneMatched: "Operations Specialist / Operations Coordinator",
    fitScore: 75,
    fitVerdict: "workable_fit",
    lifeFitLabel: "yellow_light",
    resumeVariant: "operations_process_coordination",
    networkingStatus: "not_started",
    applicationStatus: "new",
    applicationDate: null,
    followUpDate: null,
    interviewStage: null,
    outcome: null,
    notes: null,
    savedAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z",
    analysisContext: {
      summary: "Saved analysis summary",
      recommendation: "hold",
      nextAction: "Wait for stronger proof.",
      positiveSignals: ["Structured operations role"],
      riskFlags: ["Limited metrics"],
      strongestMatchingProof: [],
      gaps: []
    },
    ...overrides
  };
}

describe("filterAndSortTrackerRecords", () => {
  it("filters for follow-up due using approved workflow fields", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T12:00:00.000Z"));

    const records = [
      createRecord({
        jobId: "job_due_date",
        followUpDate: "2026-04-10"
      }),
      createRecord({
        jobId: "job_due_status",
        applicationStatus: "follow_up_due",
        followUpDate: null
      }),
      createRecord({
        jobId: "job_later",
        followUpDate: "2026-04-20"
      })
    ];

    const result = filterAndSortTrackerRecords(records, {
      applicationStatus: "all",
      networkingStatus: "all",
      laneMatched: "all",
      resumeVariant: "all",
      workflowFocus: "follow_up_due",
      sortBy: "newest"
    });

    expect(result.map((record) => record.jobId)).toEqual([
      "job_due_date",
      "job_due_status"
    ]);

    vi.useRealTimers();
  });

  it("filters current stage and sorts by follow-up date", () => {
    const records = [
      createRecord({
        jobId: "job_interview",
        applicationStatus: "interviewing",
        interviewStage: "Phone screen",
        followUpDate: "2026-04-18"
      }),
      createRecord({
        jobId: "job_offer",
        applicationStatus: "offer",
        followUpDate: "2026-04-16"
      }),
      createRecord({
        jobId: "job_new",
        applicationStatus: "new",
        followUpDate: "2026-04-14"
      })
    ];

    const result = filterAndSortTrackerRecords(records, {
      applicationStatus: "all",
      networkingStatus: "all",
      laneMatched: "all",
      resumeVariant: "all",
      workflowFocus: "current_stage",
      sortBy: "followUpDate"
    });

    expect(result.map((record) => record.jobId)).toEqual([
      "job_offer",
      "job_interview"
    ]);
  });
});
