import { getScoreBand } from "@/lib/analysis/decision-routing";
import type { AnalysisSession, AnalysisDecisionPayload } from "@/lib/validation/schemas";
import type {
  ApplicationStatus,
  NetworkingStatus
} from "@/lib/domain/tracker-status";

export type DefaultDecisionRouting = {
  applicationStatus: ApplicationStatus;
  networkingStatus: NetworkingStatus;
  reason: string;
};

function shouldHoldForVariant(session: AnalysisSession) {
  return (
    session.analysis.fitVerdict.rating === "stretch_fit" ||
    session.matchedLaneLevel === "stretch" ||
    session.analysis.gaps.some(
      (gap) =>
        gap.severity !== "low" &&
        ["tool", "metric", "scope", "title"].includes(gap.gapType)
    )
  );
}

export function getDefaultDecisionRouting(
  session: AnalysisSession
): DefaultDecisionRouting {
  const recommendation = session.analysis.nextAction.recommendation;
  const scoreBand = getScoreBand(session.score);

  if (recommendation === "pass" || scoreBand === "reject") {
    return {
      applicationStatus: "passed",
      networkingStatus: "not_applicable",
      reason:
        "Defaulted to passed because the role stayed in the reject band under the current fit and integrity rules."
    };
  }

  if (recommendation === "apply" && scoreBand === "apply") {
    return {
      applicationStatus: "apply_now",
      networkingStatus: "not_applicable",
      reason:
        "Defaulted to apply_now because the role cleared the apply band with a defensible fit."
    };
  }

  if (shouldHoldForVariant(session)) {
    return {
      applicationStatus: "hold_for_variant",
      networkingStatus: "not_applicable",
      reason:
        scoreBand === "caution_or_selective_apply"
          ? "Defaulted to hold_for_variant because the role is a stretch fit or still needs stronger evidence before applying."
          : "Defaulted to hold_for_variant because the role is viable but needs a sharper variant or clearer proof before applying."
    };
  }

  return {
    applicationStatus: "hold_for_networking",
    networkingStatus: "researching_contact",
    reason:
      scoreBand === "caution_or_selective_apply"
        ? "Defaulted to hold_for_networking because the role stays in the caution band and should be pressure-tested through networking first."
        : "Defaulted to hold_for_networking because the role is viable, but the next honest move is networking before applying."
  };
}

export function createDefaultDecisionPayload(
  session: AnalysisSession
): AnalysisDecisionPayload {
  const routing = getDefaultDecisionRouting(session);

  return {
    selectedRecommendation: session.analysis.nextAction.recommendation,
    applicationStatus: routing.applicationStatus,
    networkingStatus: routing.networkingStatus,
    applicationDate: null,
    followUpDate: null,
    interviewStage: null,
    outcome: null,
    notes: null
  };
}
