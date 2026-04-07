import { describe, expect, it } from "vitest";

import { evaluateNonNegotiables } from "@/lib/analysis/evaluators/non-negotiables";
import type { LaneMatchResult } from "@/lib/domain/analysis-session";
import type { JobPosting } from "@/lib/validation/schemas";

const primaryLaneMatch: LaneMatchResult = {
  laneId: "operations_specialist",
  displayName: "Operations Specialist / Operations Coordinator",
  level: "primary",
  score: 24,
  resumeDirectionKey: "operations_process_coordination",
  reasons: ["Approved primary lane match for evaluator coverage."]
};

function createPosting(overrides: Partial<JobPosting>): JobPosting {
  return {
    company: "SignalFlow",
    title: "Operations Coordinator",
    location: "Remote",
    pay: "$62,000 base salary",
    benefits: "Medical and 401(k)",
    schedule: "Standard weekday schedule",
    workMode: "remote",
    responsibilities: ["Coordinate cross-functional onboarding handoffs."],
    requirements: ["Maintain process visibility across operations workflows."],
    tools: [],
    domain: "Service operations",
    leadershipSignals: ["Structured reporting line"],
    ambiguitySignals: [],
    sourceUrlOrIdentifier: "non-negotiables-test",
    ...overrides
  };
}

describe("evaluateNonNegotiables", () => {
  it("keeps schedule fit and broader coaching-future support as separate rule checks", () => {
    const posting = createPosting({
      location: "Akron, Ohio",
      workMode: "onsite"
    });

    const result = evaluateNonNegotiables(posting, primaryLaneMatch);

    expect(result[3]?.status).toBe("pass");
    expect(result[4]?.status).toBe("partial");
    expect(result[4]?.rule).toContain("broader teaching/coaching future");
  });

  it("uses remote work-mode evidence to clear the coaching-future support check", () => {
    const posting = createPosting({
      location: "Remote",
      workMode: "remote"
    });

    const result = evaluateNonNegotiables(posting, primaryLaneMatch);

    expect(result[4]?.status).toBe("pass");
  });
});
