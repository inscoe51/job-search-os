"use client";

import { useEffect, useMemo, useState } from "react";

import { AnalysisReview } from "@/components/analysis/analysis-review";
import { DecisionSaveForm } from "@/components/decision/decision-save-form";
import { EmptyState } from "@/components/shared/empty-state";
import { createBrowserAnalysisSessionRepository } from "@/lib/repository/browser-analysis-session-repository";
import type { AnalysisSession } from "@/lib/validation/schemas";

type AnalysisSessionViewProps = {
  sessionId: string;
};

export function AnalysisSessionView({ sessionId }: AnalysisSessionViewProps) {
  const repository = useMemo(() => createBrowserAnalysisSessionRepository(), []);
  const [session, setSession] = useState<AnalysisSession | null>(null);

  useEffect(() => {
    setSession(repository.get(sessionId));
  }, [repository, sessionId]);

  if (!session) {
    return (
      <EmptyState
        title="Analysis session not found"
        body="This analysis session is missing from local storage. Start a new job intake or load the seeded sample fixture again."
        actionHref="/new-analysis"
        actionLabel="Back to intake"
      />
    );
  }

  return (
    <div className="space-y-6">
      <AnalysisReview session={session} />
      <DecisionSaveForm session={session} />
    </div>
  );
}
