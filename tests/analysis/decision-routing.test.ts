import { describe, expect, it } from "vitest";

import { deriveNextAction, getScoreBand } from "@/lib/analysis/decision-routing";
import type { JobAnalysis } from "@/lib/validation/schemas";

const noRiskFlags: JobAnalysis["riskFlags"] = [];

describe("decision routing", () => {
  it("routes apply-band scores into apply when the lane is defensible", () => {
    const nextAction = deriveNextAction({
      score: 84,
      laneMatchLevel: "primary",
      gaps: [],
      riskFlags: noRiskFlags
    });

    expect(getScoreBand(84)).toBe("apply");
    expect(nextAction.recommendation).toBe("apply");
  });

  it("keeps caution-band scores with material gaps out of immediate apply routing", () => {
    const nextAction = deriveNextAction({
      score: 54,
      laneMatchLevel: "stretch",
      gaps: [
        {
          gapType: "scope",
          detail: "Needs stronger direct ownership proof.",
          severity: "high"
        }
      ],
      riskFlags: noRiskFlags
    });

    expect(getScoreBand(54)).toBe("caution_or_selective_apply");
    expect(nextAction.recommendation).toBe("hold");
  });

  it("still allows selective apply inside the caution band when no material gap is present", () => {
    const nextAction = deriveNextAction({
      score: 58,
      laneMatchLevel: "secondary",
      gaps: [
        {
          gapType: "domain",
          detail: "Would need to learn the field-service context.",
          severity: "medium"
        }
      ],
      riskFlags: noRiskFlags
    });

    expect(nextAction.recommendation).toBe("apply_with_caution");
  });

  it("routes reject-band scores into pass", () => {
    const nextAction = deriveNextAction({
      score: 42,
      laneMatchLevel: "stretch",
      gaps: [],
      riskFlags: ["Commission-heavy setup reduces base stability."]
    });

    expect(getScoreBand(42)).toBe("reject");
    expect(nextAction.recommendation).toBe("pass");
  });
});
