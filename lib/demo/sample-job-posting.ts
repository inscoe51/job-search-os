import { demoJobPostingScenarios } from "@/data/demo/job-posting-scenarios";
import { jobPostingSchema, type JobPosting } from "@/lib/validation/schemas";

type DemoJobPostingScenario = (typeof demoJobPostingScenarios)[number];
export type DemoScenarioId = DemoJobPostingScenario["id"];
export type DemoScenarioSummary = Omit<DemoJobPostingScenario, "posting">;
export const primaryDemoScenarioId: DemoScenarioId = "strong-fit-example";

const parsedScenarios = demoJobPostingScenarios.map((scenario) => ({
  ...scenario,
  posting: jobPostingSchema.parse(scenario.posting)
}));
const scenarioSourceMap = new Map(
  parsedScenarios.map((scenario) => [
    scenario.posting.sourceUrlOrIdentifier ?? "",
    scenario
  ])
);

export function getDemoScenarioSummaries(): DemoScenarioSummary[] {
  return parsedScenarios.map(({ posting: _posting, ...summary }) => summary);
}

export function getPrimaryDemoScenarioSummary(): DemoScenarioSummary {
  const primaryScenario = parsedScenarios.find(
    (scenario) => scenario.id === primaryDemoScenarioId
  );

  if (!primaryScenario) {
    throw new Error("Primary demo scenario is not configured.");
  }

  const { posting: _posting, ...summary } = primaryScenario;
  return summary;
}

export function getDemoScenarioSummaryBySource(
  source: string | null | undefined
): DemoScenarioSummary | null {
  if (!source) {
    return null;
  }

  const scenario = scenarioSourceMap.get(source);

  if (!scenario) {
    return null;
  }

  const { posting: _posting, ...summary } = scenario;
  return summary;
}

export function isPrimaryDemoSource(source: string | null | undefined): boolean {
  return getDemoScenarioSummaryBySource(source)?.id === primaryDemoScenarioId;
}

export function loadDemoJobPostingScenario(scenarioId: DemoScenarioId): JobPosting {
  const scenario = parsedScenarios.find((entry) => entry.id === scenarioId);

  if (!scenario) {
    throw new Error(`Unknown demo scenario "${scenarioId}".`);
  }

  return jobPostingSchema.parse(scenario.posting);
}

export function loadSampleJobPostingFixture(): JobPosting {
  return loadDemoJobPostingScenario(primaryDemoScenarioId);
}
