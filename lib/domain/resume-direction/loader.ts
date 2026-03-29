import resumeDirectionJson from "@/data/foundation/06_resume_direction_rules.json";
import {
  resumeDirectionRulesSchema,
  type ResumeDirectionRulesData
} from "@/lib/validation/schemas";

let cached: ResumeDirectionRulesData | null = null;

export function loadResumeDirectionRules(): ResumeDirectionRulesData {
  if (!cached) {
    cached = resumeDirectionRulesSchema.parse(resumeDirectionJson);
  }

  return cached;
}
