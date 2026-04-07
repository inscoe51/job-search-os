import type { AnalysisSession, AnalysisDecisionPayload, TrackerRecord } from "@/lib/validation/schemas";
import { trackerRecordSchema } from "@/lib/validation/schemas";
import { normalizeDecisionPayloadForSave } from "@/lib/tracker/status-mapping";
import { nowIso } from "@/lib/utils/dates";
import { createId } from "@/lib/utils/ids";

export function mapAnalysisSessionToTrackerRecord(
  session: AnalysisSession,
  decisionPayload: AnalysisDecisionPayload
): TrackerRecord {
  const normalizedDecision = normalizeDecisionPayloadForSave(session, decisionPayload);
  const timestamp = nowIso();
  const source =
    session.normalizedJobPosting.sourceUrlOrIdentifier ??
    `manual-entry:${session.sessionId}`;
  const company = session.analysis.jobSnapshot.company;

  if (!company) {
    throw new Error(
      "Company is required before saving this role to the tracker. Update the posting and try again."
    );
  }

  return trackerRecordSchema.parse({
    jobId: createId("job"),
    source,
    company,
    title: session.analysis.jobSnapshot.title,
    laneMatched: session.analysis.positioningStrategy.recommendedLane,
    fitScore: session.score,
    fitVerdict: session.analysis.fitVerdict.rating,
    lifeFitLabel: session.analysis.fitVerdict.lifeFitLabel,
    resumeVariant: session.analysis.resumeDirection.recommendedVariant,
    networkingStatus: normalizedDecision.networkingStatus,
    applicationStatus: normalizedDecision.applicationStatus,
    applicationDate: normalizedDecision.applicationDate,
    followUpDate: normalizedDecision.followUpDate,
    interviewStage: normalizedDecision.interviewStage,
    outcome: normalizedDecision.outcome,
    notes: normalizedDecision.notes,
    savedAt: timestamp,
    updatedAt: timestamp,
    analysisContext: {
      summary: session.analysis.fitVerdict.summary,
      recommendation: session.analysis.nextAction.recommendation,
      nextAction: session.analysis.nextAction.why,
      positiveSignals: session.analysis.positiveSignals,
      riskFlags: session.analysis.riskFlags,
      strongestMatchingProof: session.analysis.strongestMatchingProof,
      gaps: session.analysis.gaps
    }
  });
}
