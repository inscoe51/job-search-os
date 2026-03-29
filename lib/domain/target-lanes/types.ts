import type { TargetLanesData } from "@/lib/validation/schemas";

export type TargetLaneMap = TargetLanesData;
export type TargetLane =
  TargetLanesData["primaryLanes"][number] |
  TargetLanesData["secondaryLanes"][number] |
  TargetLanesData["adjacentLanes"][number] |
  TargetLanesData["stretchOrCautionLanes"][number];
