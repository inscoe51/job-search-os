import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TrackerRecordPanel } from "@/components/tracker/tracker-record-panel";
import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import { mapAnalysisSessionToTrackerRecord } from "@/lib/tracker/analysis-to-tracker-record";
import { createDefaultDecisionPayload } from "@/lib/tracker/status-mapping";

describe("TrackerRecordPanel", () => {
  it("renders only approved workflow edit fields and keeps saved analysis context read-only", () => {
    const { session } = analyzeJobPosting(getSampleJobPosting());
    const record = mapAnalysisSessionToTrackerRecord(
      session,
      createDefaultDecisionPayload(session)
    );
    const markup = renderToStaticMarkup(
      React.createElement(TrackerRecordPanel, {
        jobId: record.jobId,
        initialRecord: record
      })
    );

    expect(markup).toContain("Workflow updates");
    expect(markup).toContain("Application status");
    expect(markup).toContain("Networking status");
    expect(markup).toContain("Application date");
    expect(markup).toContain("Follow-up date");
    expect(markup).toContain("Interview stage");
    expect(markup).toContain("Outcome");
    expect(markup).toContain("Notes");
    expect(markup).toContain("Read-only saved analysis context");
    expect(markup).toContain("does not rerun or rewrite fit analysis");
    expect(markup).toContain("Recommended Demo Result");
    expect(markup).not.toContain("Fit score");
    expect(markup).not.toContain("Resume variant");
  });
});
