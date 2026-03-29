import { describe, expect, it } from "vitest";

import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import { attachDecisionToSession } from "@/lib/domain/analysis-session";
import { MemoryAnalysisSessionRepository } from "@/lib/repository/memory-analysis-session-repository";
import { MemoryTrackerRepository } from "@/lib/repository/memory-tracker-repository";
import { mapAnalysisSessionToTrackerRecord } from "@/lib/tracker/analysis-to-tracker-record";
import { createDefaultDecisionPayload } from "@/lib/tracker/status-mapping";

describe("MVP smoke flow", () => {
  it("supports intake to analysis to save to tracker to workflow update", () => {
    const sessionRepository = new MemoryAnalysisSessionRepository();
    const trackerRepository = new MemoryTrackerRepository();
    const { session } = analyzeJobPosting(getSampleJobPosting());

    sessionRepository.save(session);
    expect(sessionRepository.get(session.sessionId)?.analysis.jobSnapshot.title).toBe(
      "Operations Coordinator"
    );

    const decision = createDefaultDecisionPayload(
      session.analysis.nextAction.recommendation
    );
    const record = mapAnalysisSessionToTrackerRecord(session, decision);
    const savedSession = attachDecisionToSession(session, decision, record);

    sessionRepository.save(savedSession);
    trackerRepository.save(record);

    const updated = trackerRepository.update(record.jobId, {
      applicationStatus: "follow_up_due",
      followUpDate: "2026-04-03",
      notes: "Follow up with operations manager if networking lead opens."
    });

    expect(trackerRepository.list()).toHaveLength(1);
    expect(updated?.applicationStatus).toBe("follow_up_due");
    expect(updated?.followUpDate).toBe("2026-04-03");
    expect(sessionRepository.get(session.sessionId)?.saveReadyTrackerRecord?.jobId).toBe(
      record.jobId
    );
  });
});
