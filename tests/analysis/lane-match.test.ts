import { describe, expect, it } from "vitest";

import { getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import {
  resolveLaneMatch,
  resolveLaneResumeDirection
} from "@/lib/analysis/evaluators/lane-match";
import { loadTargetLanes } from "@/lib/domain/target-lanes/loader";

describe("resolveLaneMatch", () => {
  it("routes the seeded sample to an approved primary operations lane", () => {
    const result = resolveLaneMatch(getSampleJobPosting());

    expect(result.level).toBe("primary");
    expect(result.laneId).toBe("operations_specialist");
    expect(result.resumeDirectionKey).toBe("operations_process_coordination");
  });

  it("routes lanes without inline resumeDirection through the approved workflow map", () => {
    expect(resolveLaneResumeDirection("revops_support")).toBe(
      "sales_ops_process_support"
    );
  });

  it("keeps source lanes on approved canonical resume-direction keys", () => {
    const lanes = loadTargetLanes();
    const revopsLane = lanes.secondaryLanes.find((lane) => lane.laneId === "revops_support");
    const onboardingLane = lanes.secondaryLanes.find(
      (lane) => lane.laneId === "customer_onboarding_ops"
    );

    expect(revopsLane?.resumeDirection).toBe("sales_ops_process_support");
    expect(onboardingLane?.resumeDirection).toBe(
      "implementation_onboarding_coordination"
    );
  });

  it("resolves workflow-routed adjacent lanes to approved canonical keys", () => {
    expect(resolveLaneResumeDirection("account_commercial_support")).toBe(
      "account_support_coordination"
    );
    expect(resolveLaneResumeDirection("marketing_ops_coordination")).toBe(
      "marketing_ops_support_careful"
    );
  });
});
