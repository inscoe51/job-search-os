"use client";

import { useMemo, useState } from "react";

import { DemoGuide } from "@/components/intake/demo-guide";
import { JobIntakeForm } from "@/components/intake/job-intake-form";
import {
  getDemoScenarioSummaries,
  primaryDemoScenarioId,
  loadDemoJobPostingScenario,
  type DemoScenarioId
} from "@/lib/demo/sample-job-posting";
import type { JobPosting } from "@/lib/validation/schemas";

export function NewAnalysisWorkspace() {
  const scenarios = useMemo(() => getDemoScenarioSummaries(), []);
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<DemoScenarioId | null>(primaryDemoScenarioId);
  const [seededPosting, setSeededPosting] = useState<JobPosting | null>(() =>
    loadDemoJobPostingScenario(primaryDemoScenarioId)
  );

  function scrollToJobIntake() {
    window.requestAnimationFrame(() => {
      const intakeSection = document.getElementById("job-intake-section");

      intakeSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  function handleLoadScenario(scenarioId: DemoScenarioId) {
    setSelectedScenarioId(scenarioId);
    setSeededPosting(loadDemoJobPostingScenario(scenarioId));
  }

  function handleLoadScenarioAndScroll(scenarioId: DemoScenarioId) {
    handleLoadScenario(scenarioId);
    scrollToJobIntake();
  }

  return (
    <div className="space-y-6">
      <DemoGuide
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onLoadScenario={handleLoadScenarioAndScroll}
      />
      <JobIntakeForm
        selectedScenarioId={selectedScenarioId}
        seededPosting={seededPosting}
      />
    </div>
  );
}
