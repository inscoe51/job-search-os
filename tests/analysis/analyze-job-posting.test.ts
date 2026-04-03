import { describe, expect, it } from "vitest";

import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import type { JobPosting } from "@/lib/validation/schemas";

describe("analyzeJobPosting", () => {
  it("creates a single AnalysisSession flow object with aligned analysis output", () => {
    const { session } = analyzeJobPosting(getSampleJobPosting());

    expect(session.sessionId).toMatch(/^session_/);
    expect(session.intakeInput.title).toBe("Operations Coordinator");
    expect(session.normalizedJobPosting.tools).toContain("Airtable");
    expect(session.analysis.positioningStrategy.recommendedLane).toContain("Operations");
    expect(session.analysis.resumeDirection.allowedToolClaims).toContain("Airtable");
    expect(session.analysis.nextAction.recommendation).not.toBe("pass");
  });

  it("surfaces strongest proof when defensible overlap exists even without direct string matches", () => {
    const posting: JobPosting = {
      company: "SignalFlow",
      title: "Customer Onboarding Coordinator",
      location: "Remote",
      pay: "$61,000 base",
      benefits: "Medical and 401(k)",
      schedule: "Weekday schedule",
      workMode: "remote",
      responsibilities: [
        "Guide new customers through onboarding kickoff, expectation alignment, and service completion handoffs.",
        "Coordinate internal teams to keep customer workflow visibility current."
      ],
      requirements: [
        "Experience keeping onboarding communication organized across customers and internal stakeholders."
      ],
      tools: [],
      domain: "Service operations",
      leadershipSignals: ["Structured cross-functional support environment"],
      ambiguitySignals: [],
      sourceUrlOrIdentifier: "proof-overlap-case"
    };

    const { session } = analyzeJobPosting(posting);

    expect(session.analysis.strongestMatchingProof.length).toBeGreaterThan(0);
    expect(
      session.analysis.strongestMatchingProof.some((proof) =>
        /customer onboarding|service completion|coordination/i.test(proof.claim)
      )
    ).toBe(true);
  });

  it("deduplicates repetitive translation areas and metric gaps", () => {
    const posting: JobPosting = {
      company: "Reporting Ops Co",
      title: "Implementation Coordinator",
      location: "Hybrid",
      pay: "$63,000 base",
      benefits: "Medical and PTO",
      schedule: "Weekday schedule",
      workMode: "hybrid",
      responsibilities: [
        "Own onboarding coordination for new customers.",
        "Support implementation readiness and customer handoffs.",
        "Maintain dashboard reporting and metrics updates."
      ],
      requirements: [
        "Experience with onboarding workflows and customer launches.",
        "Comfort with implementation coordination across teams.",
        "Maintain dashboard reporting for leadership.",
        "Track metrics and recurring reporting accuracy."
      ],
      tools: [],
      domain: "Service operations",
      leadershipSignals: ["Clear reporting line"],
      ambiguitySignals: [],
      sourceUrlOrIdentifier: "dedupe-case"
    };

    const { session } = analyzeJobPosting(posting);
    const metricGaps = session.analysis.gaps.filter((gap) => gap.gapType === "metric");

    expect(session.analysis.translationAreas).toHaveLength(2);
    expect(
      session.analysis.translationAreas.some((area) =>
        area.jobNeed.includes("similar posting needs")
      )
    ).toBe(true);
    expect(metricGaps).toHaveLength(1);
    expect(metricGaps[0]?.detail).toContain("Multiple posting lines");
  });
});
