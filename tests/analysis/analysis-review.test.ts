import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AnalysisReview } from "@/components/analysis/analysis-review";
import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";

describe("AnalysisReview", () => {
  it("shows an honest empty state when no strongest proof is available", () => {
    const { session } = analyzeJobPosting(getSampleJobPosting());
    const markup = renderToStaticMarkup(
      React.createElement(AnalysisReview, {
        session: {
          ...session,
          analysis: {
            ...session.analysis,
            strongestMatchingProof: []
          }
        }
      })
    );

    expect(markup).toContain("No defensible strongest proof surfaced");
    expect(markup).toContain("instead of filling this with assumed proof");
  });
});
