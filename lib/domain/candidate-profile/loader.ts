import candidateProfileJson from "@/data/foundation/01_profile.json";
import {
  candidateProfileSchema,
  type CandidateProfileData
} from "@/lib/validation/schemas";

let cached: CandidateProfileData | null = null;

export function loadCandidateProfile(): CandidateProfileData {
  if (!cached) {
    cached = candidateProfileSchema.parse(candidateProfileJson);
  }

  return cached;
}
