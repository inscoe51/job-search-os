import { describe, expect, it } from "vitest";

import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import {
  createDefaultDecisionPayload,
  getDefaultDecisionRouting,
  getSaveApplicationStatusOptions,
  normalizeDecisionPayloadForSave
} from "@/lib/tracker/status-mapping";
import type { AnalysisSession } from "@/lib/validation/schemas";

type SessionOverrides = {
  score?: AnalysisSession["score"];
  matchedLaneLevel?: AnalysisSession["matchedLaneLevel"];
  analysis?: {
    fitVerdict?: Partial<AnalysisSession["analysis"]["fitVerdict"]>;
    nextAction?: Partial<AnalysisSession["analysis"]["nextAction"]>;
    gaps?: AnalysisSession["analysis"]["gaps"];
    riskFlags?: AnalysisSession["analysis"]["riskFlags"];
  };
};

function buildSession(overrides: SessionOverrides): AnalysisSession {
  const { session } = analyzeJobPosting(getSampleJobPosting());

  return {
    ...session,
    ...overrides,
    analysis: {
      ...session.analysis,
      ...overrides.analysis,
      fitVerdict: {
        ...session.analysis.fitVerdict,
        ...overrides.analysis?.fitVerdict
      },
      nextAction: {
        ...session.analysis.nextAction,
        ...overrides.analysis?.nextAction
      },
      gaps: overrides.analysis?.gaps ?? session.analysis.gaps,
      riskFlags: overrides.analysis?.riskFlags ?? session.analysis.riskFlags
    }
  };
}

describe("default tracker status mapping", () => {
  it("keeps caution-level stretch fits out of apply_now", () => {
    const session = buildSession({
      score: 54,
      matchedLaneLevel: "stretch",
      analysis: {
        fitVerdict: {
          rating: "stretch_fit"
        },
        nextAction: {
          recommendation: "apply_with_caution"
        },
        gaps: [
          {
            gapType: "scope",
            detail: "Needs stronger direct ownership proof.",
            severity: "high"
          }
        ]
      }
    });

    const routing = getDefaultDecisionRouting(session);
    const payload = createDefaultDecisionPayload(session);

    expect(routing.applicationStatus).toBe("hold_for_variant");
    expect(payload.applicationStatus).toBe("hold_for_variant");
  });

  it("routes hold recommendations with relationship work left into hold_for_networking", () => {
    const session = buildSession({
      score: 72,
      matchedLaneLevel: "secondary",
      analysis: {
        fitVerdict: {
          rating: "workable_fit"
        },
        nextAction: {
          recommendation: "hold"
        },
        gaps: [
          {
            gapType: "domain",
            detail: "Would benefit from a warm intro into the domain.",
            severity: "medium"
          }
        ]
      }
    });

    const payload = createDefaultDecisionPayload(session);

    expect(payload.applicationStatus).toBe("hold_for_networking");
    expect(payload.networkingStatus).toBe("researching_contact");
  });

  it("routes apply-band recommendations into apply_now", () => {
    const session = buildSession({
      score: 86,
      matchedLaneLevel: "primary",
      analysis: {
        fitVerdict: {
          rating: "strong_fit"
        },
        nextAction: {
          recommendation: "apply"
        },
        gaps: []
      }
    });

    expect(createDefaultDecisionPayload(session).applicationStatus).toBe(
      "apply_now"
    );
  });

  it("routes reject-band recommendations into passed", () => {
    const session = buildSession({
      score: 41,
      matchedLaneLevel: "stretch",
      analysis: {
        fitVerdict: {
          rating: "low_fit"
        },
        nextAction: {
          recommendation: "pass"
        }
      }
    });

    expect(createDefaultDecisionPayload(session).applicationStatus).toBe(
      "passed"
    );
  });

  it("limits save-step application statuses to the approved options for each recommendation", () => {
    expect(getSaveApplicationStatusOptions("apply")).toEqual([
      "apply_now",
      "applied"
    ]);
    expect(getSaveApplicationStatusOptions("apply_with_caution")).toEqual([
      "apply_now",
      "applied"
    ]);
    expect(getSaveApplicationStatusOptions("hold")).toEqual([
      "hold_for_networking",
      "hold_for_variant"
    ]);
    expect(getSaveApplicationStatusOptions("pass")).toEqual(["passed"]);
  });

  it("normalizes invalid save-step status combinations before save", () => {
    const session = buildSession({
      score: 41,
      matchedLaneLevel: "stretch",
      analysis: {
        fitVerdict: {
          rating: "low_fit"
        },
        nextAction: {
          recommendation: "pass"
        }
      }
    });

    const normalized = normalizeDecisionPayloadForSave(session, {
      selectedRecommendation: "pass",
      applicationStatus: "interviewing",
      networkingStatus: "message_sent",
      applicationDate: null,
      followUpDate: null,
      interviewStage: null,
      outcome: null,
      notes: "Manual override attempt"
    });

    expect(normalized.applicationStatus).toBe("passed");
    expect(normalized.networkingStatus).toBe("not_applicable");
  });
});
