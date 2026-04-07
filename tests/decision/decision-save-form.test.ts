import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { DecisionSaveForm } from "@/components/decision/decision-save-form";
import { analyzeJobPosting, getSampleJobPosting } from "@/lib/analysis/analyze-job-posting";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe("DecisionSaveForm", () => {
  it("shows only save-step application statuses for the default recommendation", () => {
    const { session } = analyzeJobPosting(getSampleJobPosting());
    const applySession = {
      ...session,
      score: 86,
      matchedLaneLevel: "primary" as const,
      analysis: {
        ...session.analysis,
        fitVerdict: {
          ...session.analysis.fitVerdict,
          rating: "strong_fit" as const
        },
        nextAction: {
          ...session.analysis.nextAction,
          recommendation: "apply" as const
        },
        gaps: []
      }
    };
    const markup = renderToStaticMarkup(
      React.createElement(DecisionSaveForm, { session: applySession })
    );

    expect(markup).toContain("Decision + Save");
    expect(markup).toContain("Carry the analysis forward without re-entering the key fit data");
    expect(markup).toContain("Apply now");
    expect(markup).toContain("Applied");
    expect(markup).not.toContain("Interviewing");
    expect(markup).not.toContain("Offer");
    expect(markup).not.toContain("Withdrawn");
  });
});
