import targetLanesJson from "@/data/foundation/02_target_lanes.json";
import { loadResumeDirectionRules } from "@/lib/domain/resume-direction/loader";
import { loadWorkflowRules } from "@/lib/domain/workflow-rules/loader";
import { targetLanesSchema, type TargetLanesData } from "@/lib/validation/schemas";

let cached: TargetLanesData | null = null;

function getWorkflowResumeDirectionByLaneId() {
  const workflowRules = loadWorkflowRules();
  const mappings = new Map<string, string>();

  for (const [resumeDirectionKey, laneIds] of Object.entries(
    workflowRules.resumeVariantRouting
  )) {
    for (const laneId of laneIds) {
      mappings.set(laneId, resumeDirectionKey);
    }
  }

  return mappings;
}

function normalizeTargetLanes(data: TargetLanesData): TargetLanesData {
  const resumeDirections = loadResumeDirectionRules().laneDirections;
  const workflowResumeDirectionByLaneId = getWorkflowResumeDirectionByLaneId();

  const normalizeLane = <T extends { laneId: string; resumeDirection?: string }>(
    lane: T
  ): T => {
    const inlineResumeDirection = lane.resumeDirection;

    if (inlineResumeDirection && resumeDirections[inlineResumeDirection]) {
      return lane;
    }

    const workflowResumeDirection = workflowResumeDirectionByLaneId.get(lane.laneId);

    if (workflowResumeDirection && resumeDirections[workflowResumeDirection]) {
      return {
        ...lane,
        resumeDirection: workflowResumeDirection
      };
    }

    if (!inlineResumeDirection) {
      return lane;
    }

    throw new Error(
      `Target lane "${lane.laneId}" references unsupported resume direction "${inlineResumeDirection}" without an approved workflow mapping.`
    );
  };

  return targetLanesSchema.parse({
    ...data,
    primaryLanes: data.primaryLanes.map(normalizeLane),
    secondaryLanes: data.secondaryLanes.map(normalizeLane),
    adjacentLanes: data.adjacentLanes.map(normalizeLane),
    stretchOrCautionLanes: data.stretchOrCautionLanes.map(normalizeLane)
  });
}

export function loadTargetLanes(): TargetLanesData {
  if (!cached) {
    cached = normalizeTargetLanes(targetLanesSchema.parse(targetLanesJson));
  }

  return cached;
}
