import type {
  AnalysisDecisionPayload,
  AnalysisSession,
  JobAnalysis,
  JobPosting,
  TrackerRecord
} from "@/lib/validation/schemas";
import { analysisSessionSchema } from "@/lib/validation/schemas";
import { nowIso } from "@/lib/utils/dates";

export type LaneMatchLevel = "primary" | "secondary" | "adjacent" | "stretch";

export type LaneMatchResult = {
  laneId: string;
  displayName: string;
  level: LaneMatchLevel;
  score: number;
  resumeDirectionKey: string;
  reasons: string[];
};

type SessionInput = {
  sessionId: string;
  intakeInput: JobPosting;
  normalizedJobPosting: JobPosting;
  analysis: JobAnalysis;
  score: number;
  matchedLane: LaneMatchResult;
};

export function createAnalysisSession(input: SessionInput): AnalysisSession {
  const timestamp = nowIso();

  return analysisSessionSchema.parse({
    sessionId: input.sessionId,
    createdAt: timestamp,
    updatedAt: timestamp,
    intakeInput: input.intakeInput,
    normalizedJobPosting: input.normalizedJobPosting,
    analysis: input.analysis,
    score: input.score,
    matchedLaneId: input.matchedLane.laneId,
    matchedLaneLevel: input.matchedLane.level,
    reviewState: {
      currentStep: "review",
      lastReviewedAt: timestamp
    },
    decisionPayload: null,
    saveReadyTrackerRecord: null
  });
}

export function attachDecisionToSession(
  session: AnalysisSession,
  decisionPayload: AnalysisDecisionPayload,
  trackerRecord: TrackerRecord
): AnalysisSession {
  return analysisSessionSchema.parse({
    ...session,
    updatedAt: nowIso(),
    reviewState: {
      currentStep: "saved",
      lastReviewedAt: nowIso()
    },
    decisionPayload,
    saveReadyTrackerRecord: trackerRecord
  });
}
