import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import NewAnalysisPage from "@/app/new-analysis/page";
import { DemoGuide } from "@/components/intake/demo-guide";
import {
  JobIntakeForm,
  buildJobPostingFromFormState
} from "@/components/intake/job-intake-form";
import { getDemoScenarioSummaries } from "@/lib/demo/sample-job-posting";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe("buildJobPostingFromFormState", () => {
  it("keeps partial optional fields unknown, trims title, and normalizes list-style fields", () => {
    const posting = buildJobPostingFromFormState({
      company: "   ",
      title: "  Operations Coordinator  ",
      location: "   ",
      pay: "  ",
      benefits: "",
      schedule: " ",
      workMode: "unknown",
      responsibilities: "Own onboarding\nOwn onboarding\n\nCoordinate handoffs, Coordinate handoffs",
      requirements: "CRM hygiene\n\nCRM hygiene",
      tools: " Salesforce , Salesforce\nHubSpot ",
      domain: "   ",
      leadershipSignals: "Structured reporting line\nStructured reporting line",
      ambiguitySignals: "  ",
      sourceUrlOrIdentifier: "   "
    });

    expect(posting.company).toBeNull();
    expect(posting.title).toBe("Operations Coordinator");
    expect(posting.location).toBeNull();
    expect(posting.pay).toBeNull();
    expect(posting.workMode).toBe("unknown");
    expect(posting.responsibilities).toEqual([
      "Own onboarding",
      "Coordinate handoffs"
    ]);
    expect(posting.requirements).toEqual(["CRM hygiene"]);
    expect(posting.tools).toEqual(["Salesforce", "HubSpot"]);
    expect(posting.domain).toBeNull();
    expect(posting.leadershipSignals).toEqual(["Structured reporting line"]);
    expect(posting.ambiguitySignals).toEqual([]);
    expect(posting.sourceUrlOrIdentifier).toBeNull();
  });

  it("requires title as the minimum approved intake field", () => {
    expect(() =>
      buildJobPostingFromFormState({
        company: "",
        title: "   ",
        location: "",
        pay: "",
        benefits: "",
        schedule: "",
        workMode: "unknown",
        responsibilities: "",
        requirements: "",
        tools: "",
        domain: "",
        leadershipSignals: "",
        ambiguitySignals: "",
        sourceUrlOrIdentifier: ""
      })
    ).toThrow();
  });
});

describe("NewAnalysisPage", () => {
  it("renders the page header, demo guide, and approved intake fields", () => {
    const pageMarkup = renderToStaticMarkup(React.createElement(NewAnalysisPage));
    const formMarkup = renderToStaticMarkup(React.createElement(JobIntakeForm));
    const guideMarkup = renderToStaticMarkup(
      React.createElement(DemoGuide, {
        scenarios: getDemoScenarioSummaries(),
        selectedScenarioId: null,
        onLoadScenario: vi.fn()
      })
    );

    expect(pageMarkup).toContain("New Analysis");
    expect(pageMarkup).toContain("Competition-ready guided testing");
    expect(guideMarkup).toContain("About This Demo");
    expect(guideMarkup).toContain("What This Engine Is Tuned For");
    expect(guideMarkup).toContain("Try Me");
    expect(guideMarkup).toContain("Strong Fit Example");
    expect(guideMarkup).toContain("Borderline / Workable Fit Example");
    expect(guideMarkup).toContain("Poor Fit / Pass Example");
    expect(guideMarkup).toContain("Recommended live demo path");
    expect(formMarkup).toContain("Company");
    expect(formMarkup).toContain("Title *");
    expect(formMarkup).toContain("Work Mode");
    expect(formMarkup).toContain(">Unknown<");
    expect(formMarkup).toContain(">Remote<");
    expect(formMarkup).toContain(">Hybrid<");
    expect(formMarkup).toContain(">Onsite<");
    expect(formMarkup).toContain("Run first-pass analysis");
    expect(formMarkup).toContain("Seeded demo scenarios populate this exact form");
  });
});
