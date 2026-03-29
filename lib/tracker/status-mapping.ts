import type { AnalysisDecisionPayload, JobAnalysis } from "@/lib/validation/schemas";
import type {
  ApplicationStatus,
  NetworkingStatus
} from "@/lib/domain/tracker-status";

export function mapRecommendationToApplicationStatus(
  recommendation: JobAnalysis["nextAction"]["recommendation"]
): ApplicationStatus {
  if (recommendation === "apply") {
    return "apply_now";
  }

  if (recommendation === "apply_with_caution") {
    return "apply_now";
  }

  if (recommendation === "hold") {
    return "hold_for_networking";
  }

  return "passed";
}

export function createDefaultDecisionPayload(
  recommendation: JobAnalysis["nextAction"]["recommendation"]
): AnalysisDecisionPayload {
  return {
    selectedRecommendation: recommendation,
    applicationStatus: mapRecommendationToApplicationStatus(recommendation),
    networkingStatus:
      recommendation === "hold" ? ("researching_contact" as NetworkingStatus) : "not_applicable",
    applicationDate: null,
    followUpDate: null,
    interviewStage: null,
    outcome: null,
    notes: null
  };
}
