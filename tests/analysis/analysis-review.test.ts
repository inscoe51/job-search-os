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

  it("keeps unknown job snapshot details visible in the review output", () => {
    const { session } = analyzeJobPosting({
      ...getSampleJobPosting(),
      company: null,
      location: null,
      pay: null,
      workMode: "unknown"
    });
    const markup = renderToStaticMarkup(
      React.createElement(AnalysisReview, { session })
    );

    expect(markup).toContain("Job snapshot");
    expect(markup).toContain("Unknown posting details stay visible as unknown");
    expect(markup).toContain("Location");
    expect(markup).toContain("Pay");
    expect(markup).toContain("Work mode");
    expect(markup).toContain(">Unknown<");
  });
});
