import type { JobPosting } from "@/lib/validation/schemas";
import { jobPostingSchema } from "@/lib/validation/schemas";
import { normalizeList, normalizeOptionalText } from "@/lib/utils/text";

export function normalizeJobPosting(input: JobPosting): JobPosting {
  const normalized = {
    company: normalizeOptionalText(input.company),
    title: input.title.trim(),
    location: normalizeOptionalText(input.location),
    pay: normalizeOptionalText(input.pay),
    benefits: normalizeOptionalText(input.benefits),
    schedule: normalizeOptionalText(input.schedule),
    workMode: input.workMode,
    responsibilities: normalizeList(input.responsibilities),
    requirements: normalizeList(input.requirements),
    tools: normalizeList(input.tools),
    domain: normalizeOptionalText(input.domain),
    leadershipSignals: normalizeList(input.leadershipSignals),
    ambiguitySignals: normalizeList(input.ambiguitySignals),
    sourceUrlOrIdentifier: normalizeOptionalText(input.sourceUrlOrIdentifier)
  };

  return jobPostingSchema.parse(normalized);
}
