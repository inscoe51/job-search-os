import type { LaneMatchLevel } from "@/lib/domain/analysis-session";
import { loadWorkflowRules } from "@/lib/domain/workflow-rules/loader";
import type { JobAnalysis } from "@/lib/validation/schemas";

export type ScoreBand =
  | "apply"
  | "hold"
  | "caution_or_selective_apply"
  | "reject";

type NextActionRoutingInput = {
  score: number;
  laneMatchLevel: LaneMatchLevel;
  gaps: JobAnalysis["gaps"];
  riskFlags: JobAnalysis["riskFlags"];
};

function parseBandRange(range: string) {
  const [min, max] = range.split("-").map((value) => Number(value.trim()));

  return { min, max };
}

export function getScoreBand(score: number): ScoreBand {
  const scoreBands = loadWorkflowRules().fastFitScoringModel.scoreBands;
  const orderedBands: Array<{ band: ScoreBand; range: string }> = [
    { band: "apply", range: scoreBands.apply },
    { band: "hold", range: scoreBands.hold },
    {
      band: "caution_or_selective_apply",
      range: scoreBands.caution_or_selective_apply
    },
    { band: "reject", range: scoreBands.reject }
  ];

  for (const entry of orderedBands) {
    const { min, max } = parseBandRange(entry.range);

    if (score >= min && score <= max) {
      return entry.band;
    }
  }

  throw new Error(`Score ${score} did not match an approved workflow band.`);
}

export function deriveNextAction({
  score,
  laneMatchLevel,
  gaps,
  riskFlags
}: NextActionRoutingInput): JobAnalysis["nextAction"] {
  const preApplyRequirements = gaps
    .filter((gap) => gap.severity !== "low")
    .map((gap) => gap.detail)
    .slice(0, 4);
  const scoreBand = getScoreBand(score);
  const hasScheduleConflict = riskFlags.some((flag) =>
    flag.includes("Schedule conflict")
  );
  const hasCommissionRisk = riskFlags.some((flag) =>
    flag.includes("Commission-heavy")
  );
  const hasMaterialGap = gaps.some((gap) => gap.severity === "high");

  if (
    scoreBand === "apply" &&
    (laneMatchLevel === "primary" || laneMatchLevel === "secondary") &&
    !hasScheduleConflict &&
    !hasCommissionRisk
  ) {
    return {
      recommendation: "apply",
      why: "The posting lands in the apply band and remains defensible against the approved profile and integrity rules.",
      preApplyRequirements
    };
  }

  if (scoreBand === "hold") {
    return {
      recommendation: "hold",
      why: "The role is plausible but still needs sharper evidence, networking context, or variant discipline before applying.",
      preApplyRequirements
    };
  }

  if (scoreBand === "caution_or_selective_apply") {
    if (hasMaterialGap || hasScheduleConflict || hasCommissionRisk) {
      return {
        recommendation: "hold",
        why: "The role stays in the caution band and still carries material gaps or risk flags, so it should be held instead of routed into an immediate application.",
        preApplyRequirements
      };
    }

    return {
      recommendation: "apply_with_caution",
      why: "There is enough overlap to consider it selectively, but the fit stays conditional and should not be overstated.",
      preApplyRequirements
    };
  }

  return {
    recommendation: "pass",
    why: "The role remains weak-fit or too risk-heavy under the approved rules, so it should not absorb more time right now.",
    preApplyRequirements
  };
}
