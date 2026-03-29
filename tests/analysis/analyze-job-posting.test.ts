import { describe, expect, it } from "vitest";

import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";

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
});
