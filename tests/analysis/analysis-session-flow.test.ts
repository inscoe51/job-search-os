import { describe, expect, it } from "vitest";

import { analyzeJobPosting } from "@/lib/analysis/analyze-job-posting";
import { attachDecisionToSession } from "@/lib/domain/analysis-session";
import { mapAnalysisSessionToTrackerRecord } from "@/lib/tracker/analysis-to-tracker-record";
import { createDefaultDecisionPayload } from "@/lib/tracker/status-mapping";

describe("AnalysisSession flow contract", () => {
  it("creates one typed session object with cleaned unknowns across intake and analysis", () => {
    const { session } = analyzeJobPosting({
      company: "   ",
      title: "  Operations Coordinator  ",
      location: " ",
      pay: "",
      benefits: " ",
      schedule: "",
      workMode: "unknown",
      responsibilities: [" Own onboarding ", "Own onboarding"],
      requirements: [],
      tools: [" Salesforce ", "Salesforce"],
      domain: " ",
      leadershipSignals: [],
      ambiguitySignals: [],
      sourceUrlOrIdentifier: " "
    });

    expect(session.intakeInput.company).toBeNull();
    expect(session.intakeInput.title).toBe("Operations Coordinator");
    expect(session.intakeInput.location).toBeNull();
    expect(session.intakeInput.workMode).toBe("unknown");
    expect(session.intakeInput.tools).toEqual(["Salesforce"]);
    expect(session.normalizedJobPosting).toEqual(session.intakeInput);
  });

  it("preserves original analysis context when attaching the save flow to the same session object", () => {
    const { session } = analyzeJobPosting({
      company: "North Ridge Home Services",
      title: "Operations Coordinator",
      location: null,
      pay: null,
      benefits: null,
      schedule: null,
      workMode: "unknown",
      responsibilities: [],
      requirements: [],
      tools: [],
      domain: null,
      leadershipSignals: [],
      ambiguitySignals: [],
      sourceUrlOrIdentifier: null
    });
    const decision = createDefaultDecisionPayload(session);
    const trackerRecord = mapAnalysisSessionToTrackerRecord(session, decision);
    const savedSession = attachDecisionToSession(session, decision, trackerRecord);

    expect(savedSession.analysis).toEqual(session.analysis);
    expect(savedSession.normalizedJobPosting).toEqual(session.normalizedJobPosting);
    expect(savedSession.decisionPayload).toEqual(decision);
    expect(savedSession.saveReadyTrackerRecord?.analysisContext).toEqual(
      trackerRecord.analysisContext
    );
  });
});
