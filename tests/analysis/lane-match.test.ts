import { describe, expect, it } from "vitest";

import { getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import {
  resolveLaneMatch,
  resolveLaneResumeDirection
} from "@/lib/analysis/evaluators/lane-match";

describe("resolveLaneMatch", () => {
  it("routes the seeded sample to an approved primary operations lane", () => {
    const result = resolveLaneMatch(getSampleJobPosting());

    expect(result.level).toBe("primary");
    expect(result.laneId).toBe("operations_specialist");
    expect(result.resumeDirectionKey).toBe("operations_process_coordination");
  });

  it("routes lanes without inline resumeDirection through the approved workflow map", () => {
    expect(resolveLaneResumeDirection("account_commercial_support")).toBe(
      "account_support_coordination"
    );
  });
});
