import sampleJobPostingJson from "@/data/fixtures/sample-job-posting.json";
import { createAnalysisSession, type LaneMatchResult } from "@/lib/domain/analysis-session";
import { normalizeJobPosting } from "@/lib/analysis/normalizers/job-posting-normalizer";
import { resolveLaneMatch } from "@/lib/analysis/evaluators/lane-match";
import { assembleJobAnalysis } from "@/lib/analysis/assemblers/job-analysis-assembler";
import { jobPostingSchema, type JobPosting } from "@/lib/validation/schemas";
import { createId } from "@/lib/utils/ids";

export function analyzeJobPosting(input: JobPosting) {
  const intakeInput = normalizeJobPosting(jobPostingSchema.parse(input));
  const normalizedJobPosting = normalizeJobPosting(intakeInput);
  const laneMatch = resolveLaneMatch(normalizedJobPosting);
  const { analysis, score } = assembleJobAnalysis(normalizedJobPosting, laneMatch);

  return {
    session: createAnalysisSession({
      sessionId: createId("session"),
      intakeInput,
      normalizedJobPosting,
      analysis,
      score,
      matchedLane: laneMatch
    }),
    laneMatch
  };
}

export function getSampleJobPosting(): JobPosting {
  return jobPostingSchema.parse(sampleJobPostingJson);
}

export type { LaneMatchResult };
