import { describe, expect, it } from "vitest";

import { analyzeJobPosting } from "@/lib/analysis/analyze-job-posting";
import { loadDemoJobPostingScenario } from "@/lib/demo/sample-job-posting";

describe("demo scenario smoke flow", () => {
  it("routes the seeded strong-fit example through the existing analysis flow", () => {
    const posting = loadDemoJobPostingScenario("strong-fit-example");
    const { session } = analyzeJobPosting(posting);

    expect(session.intakeInput).toEqual(posting);
    expect(session.analysis.jobSnapshot.title).toBe("Operations Coordinator");
    expect(session.analysis.fitVerdict.rating).toBe("strong_fit");
    expect(session.analysis.nextAction.recommendation).toBe("apply");
  });

  it("keeps the poor-fit demo example in a pass outcome", () => {
    const posting = loadDemoJobPostingScenario("poor-fit-pass-example");
    const { session } = analyzeJobPosting(posting);

    expect(session.analysis.fitVerdict.rating).toBe("low_fit");
    expect(session.analysis.nextAction.recommendation).toBe("pass");
  });
});
