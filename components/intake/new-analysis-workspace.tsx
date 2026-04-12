"use client";

import { useMemo, useState } from "react";

import { DemoGuide } from "@/components/intake/demo-guide";
import { JobIntakeForm } from "@/components/intake/job-intake-form";
import {
  getDemoScenarioSummaries,
  loadDemoJobPostingScenario,
  type DemoScenarioId
} from "@/lib/demo/sample-job-posting";
import type { JobPosting } from "@/lib/validation/schemas";

export function NewAnalysisWorkspace() {
  const scenarios = useMemo(() => getDemoScenarioSummaries(), []);
  const [selectedScenarioId, setSelectedScenarioId] = useState<DemoScenarioId | null>(null);
  const [seededPosting, setSeededPosting] = useState<JobPosting | null>(null);

  function handleLoadScenario(scenarioId: DemoScenarioId) {
    setSelectedScenarioId(scenarioId);
    setSeededPosting(loadDemoJobPostingScenario(scenarioId));
  }

  return (
    <div className="space-y-6">
      <DemoGuide
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onLoadScenario={handleLoadScenario}
      />
      <JobIntakeForm
        selectedScenarioId={selectedScenarioId}
        seededPosting={seededPosting}
      />
    </div>
  );
}
