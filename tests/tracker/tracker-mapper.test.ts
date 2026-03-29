import { describe, expect, it } from "vitest";

import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import { MemoryTrackerRepository } from "@/lib/repository/memory-tracker-repository";
import { mapAnalysisSessionToTrackerRecord } from "@/lib/tracker/analysis-to-tracker-record";
import { createDefaultDecisionPayload } from "@/lib/tracker/status-mapping";

describe("mapAnalysisSessionToTrackerRecord", () => {
  it("maps the analysis result into the approved tracker shape", () => {
    const repository = new MemoryTrackerRepository();
    const { session } = analyzeJobPosting(getSampleJobPosting());
    const decision = createDefaultDecisionPayload(
      session.analysis.nextAction.recommendation
    );
    const record = mapAnalysisSessionToTrackerRecord(session, decision);

    repository.save(record);

    expect(record.jobId).toMatch(/^job_/);
    expect(record.company).toBe("North Ridge Home Services");
    expect(record.fitScore).toBeGreaterThan(0);
    expect(record.analysisContext.positiveSignals.length).toBeGreaterThan(0);
    expect(repository.list()).toHaveLength(1);
  });

  it("blocks tracker saves that would invent a missing company value", () => {
    const { session } = analyzeJobPosting({
      ...getSampleJobPosting(),
      company: null
    });
    const decision = createDefaultDecisionPayload(
      session.analysis.nextAction.recommendation
    );

    expect(() => mapAnalysisSessionToTrackerRecord(session, decision)).toThrow(
      /Company is required/
    );
  });
});
