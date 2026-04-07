import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { AnalysisSessionView } from "@/components/analysis/analysis-session-view";
import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe("AnalysisSessionView", () => {
  it("renders review and decision save from the same typed session object", () => {
    const { session } = analyzeJobPosting(getSampleJobPosting());
    const markup = renderToStaticMarkup(
      React.createElement(AnalysisSessionView, {
        sessionId: session.sessionId,
        initialSession: session
      })
    );

    expect(markup).toContain("Analysis Review");
    expect(markup).toContain("Decision + Save");
    expect(markup).toContain("Resume Variant");
    expect(markup).toContain("Carry the analysis forward without re-entering the key fit data");
  });
});
