import { loadCandidateProfile } from "@/lib/domain/candidate-profile/loader";
import type { LaneMatchResult } from "@/lib/domain/analysis-session";
import { loadResumeDirectionRules } from "@/lib/domain/resume-direction/loader";
import { loadWorkflowRules } from "@/lib/domain/workflow-rules/loader";
import type { JobAnalysis, JobPosting } from "@/lib/validation/schemas";
import { jobAnalysisSchema } from "@/lib/validation/schemas";
import { collectAnalysisEvidence } from "@/lib/analysis/evaluators/proof-and-gaps";
import { evaluateNonNegotiables } from "@/lib/analysis/evaluators/non-negotiables";

type AnalysisAssembly = {
  analysis: JobAnalysis;
  score: number;
};

function statusPoints(
  status: "pass" | "partial" | "fail" | "unknown",
  max: number,
  partial = Math.floor(max / 2),
  unknown = Math.floor(max / 2) - 1
): number {
  if (status === "pass") {
    return max;
  }

  if (status === "partial") {
    return partial;
  }

  if (status === "unknown") {
    return Math.max(0, unknown);
  }

  return 0;
}

function computeScore(
  posting: JobPosting,
  laneMatch: LaneMatchResult,
  evidence: ReturnType<typeof collectAnalysisEvidence>,
  nonNegotiables: ReturnType<typeof evaluateNonNegotiables>
): number {
  const workflow = loadWorkflowRules();
  const conditionMatches = {
    pure_sales_disguised_as_operations: evidence.riskFlags.some((flag) =>
      flag.includes("Pure sales")
    ),
    commission_heavy_without_base_stability: evidence.riskFlags.some((flag) =>
      flag.includes("Commission-heavy")
    ),
    unclear_scope_or_founder_chaos: evidence.riskFlags.some(
      (flag) => flag.includes("Founder-led chaos") || flag.includes("Unclear")
    ),
    unsupported_enterprise_or_advanced_analyst_requirements:
      evidence.riskFlags.some(
        (flag) =>
          flag.includes("Unsupported analyst") || flag.includes("enterprise")
      ),
    schedule_conflict_with_coaching: evidence.riskFlags.some((flag) =>
      flag.includes("Schedule conflict")
    )
  } satisfies Record<string, boolean>;
  const penalties = workflow.fastFitScoringModel.penalties.filter((penalty) =>
    conditionMatches[penalty.condition as keyof typeof conditionMatches]
  );

  const score =
    (laneMatch.level === "primary"
      ? 20
      : laneMatch.level === "secondary"
        ? 15
        : laneMatch.level === "adjacent"
          ? 10
          : 4) +
    Math.min(20, evidence.strongestMatchingProof.length * 5) +
    Math.max(0, 15 - evidence.gaps.filter((gap) => gap.severity === "high").length * 4) +
    statusPoints(nonNegotiables[1]?.status ?? "unknown", 15, 10, 7) +
    statusPoints(nonNegotiables[2]?.status ?? "unknown", 10, 6, 4) +
    statusPoints(nonNegotiables[3]?.status ?? "unknown", 10, 6, 5) +
    (posting.workMode === "remote" || posting.workMode === "hybrid" ? 5 : posting.workMode === "onsite" ? 2 : 1) +
    (posting.leadershipSignals.length > 0 ? 4 : 2) -
    penalties.reduce((sum, penalty) => sum + penalty.deduct, 0);

  return Math.max(0, Math.min(workflow.fastFitScoringModel.maxScore, score));
}

function deriveFitVerdict(
  score: number,
  laneMatch: LaneMatchResult,
  evidence: ReturnType<typeof collectAnalysisEvidence>
): JobAnalysis["fitVerdict"] {
  const rating =
    score >= 80
      ? "strong_fit"
      : score >= 65
        ? "workable_fit"
        : score >= 50
          ? "stretch_fit"
          : "low_fit";

  const lifeFitLabel =
    evidence.riskFlags.some((flag) => flag.includes("Schedule conflict")) ||
    evidence.riskFlags.some((flag) => flag.includes("Commission-heavy"))
      ? score < 50
        ? "freelance_better"
        : "red_light"
      : score >= 80
        ? "green_light"
        : score >= 50
          ? "yellow_light"
          : "red_light";

  return {
    rating,
    lifeFitLabel,
    summary: `${laneMatch.displayName} is the best approved lane match with a ${score}/100 first-pass score. Keep the main risk and gap items visible before acting.`
  };
}

function deriveNextAction(
  score: number,
  evidence: ReturnType<typeof collectAnalysisEvidence>,
  laneMatch: LaneMatchResult
): JobAnalysis["nextAction"] {
  const preApplyRequirements = evidence.gaps
    .filter((gap) => gap.severity !== "low")
    .map((gap) => gap.detail)
    .slice(0, 4);

  if (
    score >= 80 &&
    (laneMatch.level === "primary" || laneMatch.level === "secondary") &&
    !evidence.riskFlags.some((flag) => flag.includes("Schedule conflict"))
  ) {
    return {
      recommendation: "apply",
      why: "The posting lands in the apply band and remains defensible against the approved profile and integrity rules.",
      preApplyRequirements
    };
  }

  if (score >= 65) {
    return {
      recommendation: "hold",
      why: "The role is plausible but still needs sharper evidence, networking context, or variant discipline before applying.",
      preApplyRequirements
    };
  }

  if (score >= 50) {
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

export function assembleJobAnalysis(
  posting: JobPosting,
  laneMatch: LaneMatchResult
): AnalysisAssembly {
  const profile = loadCandidateProfile().candidateProfile;
  const resumeDirectionRules = loadResumeDirectionRules();
  const evidence = collectAnalysisEvidence(posting, laneMatch);
  const nonNegotiables = evaluateNonNegotiables(posting, laneMatch);
  const score = computeScore(posting, laneMatch, evidence, nonNegotiables);
  const fitVerdict = deriveFitVerdict(score, laneMatch, evidence);
  const nextAction = deriveNextAction(score, evidence, laneMatch);
  const direction =
    resumeDirectionRules.laneDirections[laneMatch.resumeDirectionKey] ??
    resumeDirectionRules.laneDirections.operations_process_coordination;
  const allowedToolClaims = profile.confirmedTools.filter((tool) =>
    resumeDirectionRules.allowedToolClaims.includes(tool) &&
    posting.tools.some(
      (postingTool) =>
        postingTool.toLowerCase().includes(tool.toLowerCase()) ||
        tool.toLowerCase().includes(postingTool.toLowerCase())
    )
  );

  const analysis = jobAnalysisSchema.parse({
    jobSnapshot: {
      company: posting.company,
      title: posting.title,
      normalizedRoleType: laneMatch.displayName,
      location: posting.location,
      pay: posting.pay,
      workMode: posting.workMode,
      summary: `${posting.title} at ${posting.company ?? "an unknown company"} routes through ${laneMatch.displayName} for this first-pass review.`
    },
    nonNegotiablesCheck: nonNegotiables,
    positiveSignals: evidence.positiveSignals,
    riskFlags: evidence.riskFlags,
    fitVerdict,
    strongestMatchingProof: evidence.strongestMatchingProof,
    translationAreas: evidence.translationAreas,
    gaps: evidence.gaps,
    positioningStrategy: {
      recommendedLane: laneMatch.displayName,
      positioningParagraph: `Position this role through ${direction.summaryFocus.slice(0, 3).join(", ")} while staying inside evidence-first language and keeping known open issues visible.`,
      tone: "evidence_first_no_inflation"
    },
    resumeDirection: {
      recommendedVariant: laneMatch.resumeDirectionKey,
      emphasize: direction.emphasize,
      deEmphasize: direction.deEmphasize,
      allowedToolClaims
    },
    resumeTailoringPriorities: evidence.resumeTailoringPriorities,
    nextAction
  });

  return {
    analysis,
    score
  };
}
