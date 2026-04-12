import { describe, expect, it } from "vitest";

import { analyzeJobPosting } from "@/lib/analysis/analyze-job-posting";
import {
  getDemoScenarioSummaries,
  loadDemoJobPostingScenario,
  loadSampleJobPostingFixture
} from "@/lib/demo/sample-job-posting";

describe("loadSampleJobPostingFixture", () => {
  it("exposes the three guided demo scenarios for the intake screen", () => {
    expect(getDemoScenarioSummaries()).toEqual([
      expect.objectContaining({ label: "Strong Fit Example" }),
      expect.objectContaining({ label: "Borderline / Workable Fit Example" }),
      expect.objectContaining({ label: "Poor Fit / Pass Example" })
    ]);
  });

  it("loads the default seeded demo fixture from structured demo scenario data", () => {
    const posting = loadSampleJobPostingFixture();

    expect(posting.company).toBe("Harbor North Services");
    expect(posting.title).toBe("Operations Coordinator");
    expect(posting.workMode).toBe("hybrid");
    expect(posting.sourceUrlOrIdentifier).toBe("demo-strong-fit-operations-coordinator");
    expect(posting.responsibilities.length).toBeGreaterThan(0);
    expect(posting.requirements.length).toBeGreaterThan(0);
  });

  it("loads the poor-fit demo fixture by id with the approved jobPosting shape", () => {
    const posting = loadDemoJobPostingScenario("poor-fit-pass-example");

    expect(posting.title).toBe("Sales Development Representative");
    expect(posting.workMode).toBe("onsite");
    expect(posting.tools).toContain("SQL");
  });

  it("feeds the seeded fixture through the same typed AnalysisSession flow", () => {
    const posting = loadSampleJobPostingFixture();
    const { session } = analyzeJobPosting(posting);

    expect(session.intakeInput).toEqual(posting);
    expect(session.normalizedJobPosting.title).toBe(posting.title);
    expect(session.analysis.jobSnapshot.title).toBe(posting.title);
  });
});
