import { describe, expect, it } from "vitest";

import { analyzeJobPosting } from "@/lib/analysis/analyze-job-posting";
import { loadSampleJobPostingFixture } from "@/lib/demo/sample-job-posting";

describe("loadSampleJobPostingFixture", () => {
  it("loads one seeded demo fixture from data/fixtures with the approved jobPosting shape", () => {
    const posting = loadSampleJobPostingFixture();

    expect(posting.company).toBe("North Ridge Home Services");
    expect(posting.title).toBe("Operations Coordinator");
    expect(posting.workMode).toBe("hybrid");
    expect(posting.sourceUrlOrIdentifier).toBe("sample-fixture-operations-coordinator");
    expect(posting.responsibilities.length).toBeGreaterThan(0);
    expect(posting.requirements.length).toBeGreaterThan(0);
  });

  it("feeds the seeded fixture through the same typed AnalysisSession flow", () => {
    const posting = loadSampleJobPostingFixture();
    const { session } = analyzeJobPosting(posting);

    expect(session.intakeInput).toEqual(posting);
    expect(session.normalizedJobPosting.title).toBe(posting.title);
    expect(session.analysis.jobSnapshot.title).toBe(posting.title);
  });
});
