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

type EntryPath = "guided" | "manual";

export function NewAnalysisWorkspace() {
  const scenarios = useMemo(() => getDemoScenarioSummaries(), []);
  const [entryPath, setEntryPath] = useState<EntryPath>("guided");
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<DemoScenarioId | null>(primaryDemoScenarioId);
  const [seededPosting, setSeededPosting] = useState<JobPosting | null>(() =>
    loadDemoJobPostingScenario(primaryDemoScenarioId)
  );
  const [openCoreDetailsToken, setOpenCoreDetailsToken] = useState(0);

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
    setEntryPath("guided");
    setSelectedScenarioId(scenarioId);
    setSeededPosting(loadDemoJobPostingScenario(scenarioId));
  }

  function handleLoadScenarioAndScroll(scenarioId: DemoScenarioId) {
    handleLoadScenario(scenarioId);
    scrollToJobIntake();
  }

  function handleChooseManual() {
    setEntryPath("manual");
    setSelectedScenarioId(null);
    setSeededPosting(null);
  }

  function handleChooseManualAndScroll() {
    handleChooseManual();
    setOpenCoreDetailsToken((current) => current + 1);
    scrollToJobIntake();
  }

  function handleChooseGuided() {
    handleLoadScenario(primaryDemoScenarioId);
  }

  function handleChooseGuidedAndScroll() {
    handleChooseGuided();
    scrollToJobIntake();
  }

  return (
    <div className="space-y-6">
      <DemoGuide
        scenarios={scenarios}
        entryPath={entryPath}
        selectedScenarioId={selectedScenarioId}
        onChooseGuided={handleChooseGuidedAndScroll}
        onChooseManual={handleChooseManualAndScroll}
        onLoadScenario={handleLoadScenarioAndScroll}
      />
      {entryPath === "guided" || entryPath === "manual" ? (
        <JobIntakeForm
          openCoreDetailsToken={openCoreDetailsToken}
          selectedScenarioId={selectedScenarioId}
          seededPosting={seededPosting}
        />
      ) : null}
    </div>
  );
}
