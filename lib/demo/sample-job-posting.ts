import sampleJobPostingJson from "@/data/fixtures/sample-job-posting.json";
import { jobPostingSchema, type JobPosting } from "@/lib/validation/schemas";

export function loadSampleJobPostingFixture(): JobPosting {
  return jobPostingSchema.parse(sampleJobPostingJson);
}
