import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TrackerTable } from "@/components/tracker/tracker-table";
import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";
import { mapAnalysisSessionToTrackerRecord } from "@/lib/tracker/analysis-to-tracker-record";
import { createDefaultDecisionPayload } from "@/lib/tracker/status-mapping";

describe("TrackerTable", () => {
  it("renders weekly review filters and record detail links without expanding into analytics", () => {
    const { session } = analyzeJobPosting(getSampleJobPosting());
    const record = mapAnalysisSessionToTrackerRecord(
      session,
      createDefaultDecisionPayload(session)
    );

    const markup = renderToStaticMarkup(
      React.createElement(TrackerTable, {
        initialRecords: [record]
      })
    );

    expect(markup).toContain("Tracker / Weekly Review");
    expect(markup).toContain("Workflow focus");
    expect(markup).toContain("Follow-up due");
    expect(markup).toContain("Current stage");
    expect(markup).toContain("Sort by");
    expect(markup).toContain(`/tracker/${record.jobId}`);
    expect(markup).toContain("Recommended Demo Result");
    expect(markup).toContain("Open recommended result");
    expect(markup).not.toContain("dashboard");
  });
});
