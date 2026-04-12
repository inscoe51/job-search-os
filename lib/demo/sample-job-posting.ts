import { demoJobPostingScenarios } from "@/data/demo/job-posting-scenarios";
import { jobPostingSchema, type JobPosting } from "@/lib/validation/schemas";

type DemoJobPostingScenario = (typeof demoJobPostingScenarios)[number];
export type DemoScenarioId = DemoJobPostingScenario["id"];
export type DemoScenarioSummary = Omit<DemoJobPostingScenario, "posting">;

const parsedScenarios = demoJobPostingScenarios.map((scenario) => ({
  ...scenario,
  posting: jobPostingSchema.parse(scenario.posting)
}));

export function getDemoScenarioSummaries(): DemoScenarioSummary[] {
  return parsedScenarios.map(({ posting: _posting, ...summary }) => summary);
}

export function loadDemoJobPostingScenario(scenarioId: DemoScenarioId): JobPosting {
  const scenario = parsedScenarios.find((entry) => entry.id === scenarioId);

  if (!scenario) {
    throw new Error(`Unknown demo scenario "${scenarioId}".`);
  }

  return jobPostingSchema.parse(scenario.posting);
}

export function loadSampleJobPostingFixture(): JobPosting {
  return loadDemoJobPostingScenario("strong-fit-example");
}
