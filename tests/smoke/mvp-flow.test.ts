import { describe, expect, it } from "vitest";

import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import { attachDecisionToSession } from "@/lib/domain/analysis-session";
import { MemoryAnalysisSessionRepository } from "@/lib/repository/memory-analysis-session-repository";
import { MemoryTrackerRepository } from "@/lib/repository/memory-tracker-repository";
import { mapAnalysisSessionToTrackerRecord } from "@/lib/tracker/analysis-to-tracker-record";
import { createDefaultDecisionPayload } from "@/lib/tracker/status-mapping";
import type { JobPosting } from "@/lib/validation/schemas";

describe("MVP smoke flow", () => {
  it("supports intake to analysis to save to tracker to workflow update", () => {
    const sessionRepository = new MemoryAnalysisSessionRepository();
    const trackerRepository = new MemoryTrackerRepository();
    const { session } = analyzeJobPosting(getSampleJobPosting());

    sessionRepository.save(session);
    expect(sessionRepository.get(session.sessionId)?.analysis.jobSnapshot.title).toBe(
      "Operations Coordinator"
    );

    const decision = createDefaultDecisionPayload(session);
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

  it("keeps a caution-role smoke case on hold while still surfacing proof and cleaner review output", () => {
    const cautionPosting: JobPosting = {
      company: "MetricStack",
      title: "Revenue Operations Associate",
      location: "Remote",
      pay: "$61,000 base salary",
      benefits: "Medical, dental, and PTO",
      schedule: "Standard weekday schedule",
      workMode: "remote",
      responsibilities: [
        "Coordinate onboarding handoffs across revenue teams.",
        "Maintain dashboard reporting and recurring metric rollups.",
        "Support implementation readiness for new accounts."
      ],
      requirements: [
        "Own reporting hygiene across dashboards and metrics.",
        "Comfort with customer onboarding and implementation coordination.",
        "Experience with CRM process support in a growing revenue operations team."
      ],
      tools: ["Salesforce"],
      domain: "B2B SaaS",
      leadershipSignals: ["Cross-functional reporting line"],
      ambiguitySignals: ["Some process cleanup still in progress"],
      sourceUrlOrIdentifier: "caution-smoke-case"
    };

    const { session } = analyzeJobPosting(cautionPosting);
    const decision = createDefaultDecisionPayload(session);

    expect(session.analysis.strongestMatchingProof.length).toBeGreaterThan(0);
    expect(session.analysis.translationAreas.length).toBeLessThanOrEqual(3);
    expect(session.analysis.gaps.filter((gap) => gap.gapType === "metric")).toHaveLength(1);
    expect(session.analysis.nextAction.recommendation).toBe("hold");
    expect(decision.applicationStatus).not.toBe("apply_now");
  });
});
