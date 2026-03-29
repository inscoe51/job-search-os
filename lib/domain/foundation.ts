import { loadCandidateProfile } from "@/lib/domain/candidate-profile/loader";
import { loadFitRules } from "@/lib/domain/fit-rules/loader";
import { loadIntegrityRules } from "@/lib/domain/integrity/loader";
import { loadResumeDirectionRules } from "@/lib/domain/resume-direction/loader";
import { loadTargetLanes } from "@/lib/domain/target-lanes/loader";
import { loadWorkflowRules } from "@/lib/domain/workflow-rules/loader";

export function loadFoundation() {
  return {
    candidateProfile: loadCandidateProfile().candidateProfile,
    fitRules: loadFitRules(),
    integrityRules: loadIntegrityRules(),
    resumeDirectionRules: loadResumeDirectionRules(),
    targetLanes: loadTargetLanes(),
    workflowRules: loadWorkflowRules()
  };
}
