import { describe, expect, it } from "vitest";

import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import { MemoryTrackerRepository } from "@/lib/repository/memory-tracker-repository";
import { mapAnalysisSessionToTrackerRecord } from "@/lib/tracker/analysis-to-tracker-record";
import { createDefaultDecisionPayload } from "@/lib/tracker/status-mapping";

describe("MemoryTrackerRepository.update", () => {
  it("updates only approved workflow fields and preserves original analysis context", () => {
    const repository = new MemoryTrackerRepository();
    const { session } = analyzeJobPosting(getSampleJobPosting());
    const record = mapAnalysisSessionToTrackerRecord(
      session,
      createDefaultDecisionPayload(session)
    );

    repository.save(record);

    const updated = repository.update(record.jobId, {
      applicationStatus: "follow_up_due",
      networkingStatus: "message_sent",
      followUpDate: "2026-04-10",
      notes: "Reach out after the first intro email.",
      company: "Changed Company",
      fitScore: 0,
      analysisContext: {
        ...record.analysisContext,
        summary: "Rewritten summary"
      }
    } as never);

    expect(updated?.applicationStatus).toBe("follow_up_due");
    expect(updated?.networkingStatus).toBe("message_sent");
    expect(updated?.followUpDate).toBe("2026-04-10");
    expect(updated?.notes).toBe("Reach out after the first intro email.");
    expect(updated?.company).toBe(record.company);
    expect(updated?.fitScore).toBe(record.fitScore);
    expect(updated?.analysisContext).toEqual(record.analysisContext);
  });
});
