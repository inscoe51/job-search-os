import targetLanesJson from "@/data/foundation/02_target_lanes.json";
import { targetLanesSchema, type TargetLanesData } from "@/lib/validation/schemas";

let cached: TargetLanesData | null = null;

export function loadTargetLanes(): TargetLanesData {
  if (!cached) {
    cached = targetLanesSchema.parse(targetLanesJson);
  }

  return cached;
}
