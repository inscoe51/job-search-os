import type { JobPosting } from "@/lib/validation/schemas";

export type DemoJobPostingScenarioDefinition = {
  id:
    | "strong-fit-example"
    | "borderline-workable-fit-example"
    | "poor-fit-pass-example";
  label: string;
  emphasis: string;
  preview: string;
  expectedFitLabel: string;
  posting: JobPosting;
};

export const demoJobPostingScenarios: DemoJobPostingScenarioDefinition[] = [
  {
    id: "strong-fit-example",
    label: "Strong Fit Example",
    emphasis: "Operations coordination with clean guardrail alignment",
    preview:
      "A structured hybrid operations role with stable compensation, benefits, and strong overlap in onboarding, CRM workflow ownership, and cross-functional execution.",
    expectedFitLabel: "Expected outcome: strong-fit review with an apply-ready path",
    posting: {
      company: "Harbor North Services",
      title: "Operations Coordinator",
      location: "Akron, OH",
      pay: "$64,000-$70,000 base salary",
      benefits: "Medical, dental, vision, 401(k), PTO",
      schedule: "Standard weekday schedule with planned coordination windows only",
      workMode: "hybrid",
      responsibilities: [
        "Coordinate customer onboarding, scheduling handoffs, and service execution across office and field teams.",
        "Maintain CRM workflows, documentation standards, and process updates for recurring jobs.",
        "Support reporting visibility, follow-up discipline, and cross-functional issue resolution."
      ],
      requirements: [
        "2+ years of operations, customer coordination, or workflow support experience.",
        "Comfort with CRM systems, documentation, onboarding workflows, and process improvement.",
        "Ability to manage handoffs between sales, service, and leadership with clear communication."
      ],
      tools: ["Airtable", "CRM systems", "PandaDoc"],
      domain: "Field service operations",
      leadershipSignals: [
        "Clear reporting line to the operations manager",
        "Structured cross-functional team environment"
      ],
      ambiguitySignals: [],
      sourceUrlOrIdentifier: "demo-strong-fit-operations-coordinator"
    }
  },
  {
    id: "borderline-workable-fit-example",
    label: "Borderline / Workable Fit Example",
    emphasis: "Plausible lane match with visible proof and metric gaps",
    preview:
      "A support-level RevOps-style role that overlaps with coordination and reporting discipline, but still needs careful handling around analytics depth and measurable proof.",
    expectedFitLabel: "Expected outcome: workable or caution-band review with visible tradeoffs",
    posting: {
      company: "MetricStack",
      title: "Revenue Operations Associate",
      location: "Remote",
      pay: "$61,000 base salary",
      benefits: "Medical, dental, and PTO",
      schedule: "Standard weekday schedule",
      workMode: "remote",
      responsibilities: [
        "Coordinate onboarding handoffs across revenue teams.",
        "Maintain dashboard reporting and recurring metric rollups.",
        "Support implementation readiness for new accounts."
      ],
      requirements: [
        "Own reporting hygiene across dashboards and metrics.",
        "Comfort with customer onboarding and implementation coordination.",
        "Experience with CRM process support in a growing revenue operations team."
      ],
      tools: ["Salesforce"],
      domain: "B2B SaaS",
      leadershipSignals: ["Cross-functional reporting line"],
      ambiguitySignals: ["Some process cleanup still in progress"],
      sourceUrlOrIdentifier: "demo-borderline-revops-associate"
    }
  },
  {
    id: "poor-fit-pass-example",
    label: "Poor Fit / Pass Example",
    emphasis: "Role conflicts with compensation, scope, and life-fit rules",
    preview:
      "A sales-heavy onsite role with commission pressure, schedule conflict risk, and enterprise-tool expectations the current candidate record should not claim.",
    expectedFitLabel: "Expected outcome: low-fit review and a clear pass recommendation",
    posting: {
      company: "Peak Velocity Systems",
      title: "Sales Development Representative",
      location: "Cleveland, OH",
      pay: "Commission-only with accelerator plan",
      benefits: "None listed",
      schedule:
        "Evening follow-up expectations, some weekends, and occasional travel for trade events",
      workMode: "onsite",
      responsibilities: [
        "Own outbound prospecting, quota attainment, and late-day lead follow-up activity.",
        "Travel to events and support weekend pipeline pushes when needed.",
        "Build executive dashboards for sales leadership and maintain enterprise reporting visibility."
      ],
      requirements: [
        "2+ years in outbound sales or business development.",
        "Advanced Salesforce reporting, SQL, and Tableau experience.",
        "Comfort in a fast-paced founder environment with shifting priorities."
      ],
      tools: ["Salesforce", "SQL", "Tableau"],
      domain: "Enterprise sales technology",
      leadershipSignals: ["Founder-led team with lean structure"],
      ambiguitySignals: ["Fast-paced role with shifting priorities week to week"],
      sourceUrlOrIdentifier: "demo-poor-fit-sdr-pass"
    }
  }
];
