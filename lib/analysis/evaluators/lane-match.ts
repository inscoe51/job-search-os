import type { LaneMatchResult, LaneMatchLevel } from "@/lib/domain/analysis-session";
import { loadTargetLanes } from "@/lib/domain/target-lanes/loader";
import { loadWorkflowRules } from "@/lib/domain/workflow-rules/loader";
import type { TargetLane } from "@/lib/domain/target-lanes/types";
import type { JobPosting } from "@/lib/validation/schemas";
import { collectCorpus, includesNormalized, normalizeText } from "@/lib/utils/text";

type LaneWithLevel = TargetLane & { fitLevel: LaneMatchLevel };

const levelBaseScores: Record<LaneMatchLevel, number> = {
  primary: 12,
  secondary: 8,
  adjacent: 5,
  stretch: 2
};

function toLaneList(): LaneWithLevel[] {
  const lanes = loadTargetLanes();

  return [
    ...lanes.primaryLanes.map((lane) => ({ ...lane, fitLevel: "primary" as const })),
    ...lanes.secondaryLanes.map((lane) => ({ ...lane, fitLevel: "secondary" as const })),
    ...lanes.adjacentLanes.map((lane) => ({ ...lane, fitLevel: "adjacent" as const })),
    ...lanes.stretchOrCautionLanes.map((lane) => ({
      ...lane,
      fitLevel: "stretch" as const
    }))
  ];
}

function scoreLane(posting: JobPosting, lane: LaneWithLevel): number {
  const corpus = collectCorpus([
    posting.title,
    posting.domain,
    posting.location,
    posting.pay,
    ...posting.responsibilities,
    ...posting.requirements,
    ...posting.tools
  ]);

  let score = levelBaseScores[lane.fitLevel];

  for (const title of lane.sourceTitles ?? []) {
    if (includesNormalized(posting.title, title)) {
      score += 10;
    }
  }

  for (const theme of lane.evidenceThemes ?? []) {
    if (includesNormalized(corpus, theme)) {
      score += 4;
    }
  }

  const laneTokens = normalizeText(lane.displayName).split(" ");

  for (const token of laneTokens) {
    if (token.length >= 5 && includesNormalized(corpus, token)) {
      score += 1;
    }
  }

  return score;
}

export function resolveLaneResumeDirection(
  laneId: string,
  resumeDirection?: string
): string {
  const workflowRules = loadWorkflowRules();

  return (
    resumeDirection ??
    Object.entries(workflowRules.resumeVariantRouting).find(([, laneIds]) =>
      laneIds.includes(laneId)
    )?.[0] ??
    "operations_process_coordination"
  );
}

export function resolveLaneMatch(posting: JobPosting): LaneMatchResult {
  const ranked = toLaneList()
    .map((lane) => ({
      lane,
      score: scoreLane(posting, lane)
    }))
    .sort((left, right) => right.score - left.score);

  const best = ranked[0];

  if (!best) {
    return {
      laneId: "operations_specialist",
      displayName: "Operations Specialist / Operations Coordinator",
      level: "adjacent",
      score: 0,
      resumeDirectionKey: "operations_process_coordination",
      reasons: ["No direct lane match scored clearly. Defaulting to the safest operations-oriented lane."]
    };
  }

  return {
    laneId: best.lane.laneId,
    displayName: best.lane.displayName,
    level: best.lane.fitLevel,
    score: best.score,
    resumeDirectionKey: resolveLaneResumeDirection(
      best.lane.laneId,
      best.lane.resumeDirection
    ),
    reasons:
      best.lane.whyItFits ??
      [`Matched ${best.lane.displayName} from the approved target-lane map.`]
  };
}
