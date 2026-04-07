import { loadFitRules } from "@/lib/domain/fit-rules/loader";
import type { LaneMatchResult } from "@/lib/domain/analysis-session";
import type { JobPosting } from "@/lib/validation/schemas";
import { includesNormalized } from "@/lib/utils/text";

type NonNegotiableStatus = "pass" | "partial" | "fail" | "unknown";

function stableCompensationStatus(pay: string | null): NonNegotiableStatus {
  if (!pay) {
    return "unknown";
  }

  if (includesNormalized(pay, "commission") && !/\$?\d{2,3},?\d{3}/.test(pay)) {
    return "fail";
  }

  const numericMatches = pay.match(/\d{2,3},?\d{3}/g) ?? [];
  const numericValues = numericMatches
    .map((value) => Number(value.replace(/,/g, "")))
    .filter((value) => Number.isFinite(value));

  if (numericValues.some((value) => value >= 60000)) {
    return "pass";
  }

  if (numericValues.some((value) => value >= 50000)) {
    return "partial";
  }

  return "fail";
}

function benefitsStatus(benefits: string | null): NonNegotiableStatus {
  if (!benefits) {
    return "unknown";
  }

  if (
    includesNormalized(benefits, "health") ||
    includesNormalized(benefits, "medical") ||
    includesNormalized(benefits, "401") ||
    includesNormalized(benefits, "retirement")
  ) {
    return "pass";
  }

  if (includesNormalized(benefits, "none")) {
    return "fail";
  }

  return "partial";
}

function scheduleStatus(posting: JobPosting): NonNegotiableStatus {
  const combined = [posting.schedule, ...posting.requirements, ...posting.responsibilities]
    .filter(Boolean)
    .join(" ");

  if (!combined) {
    return "unknown";
  }

  if (
    includesNormalized(combined, "weekend") ||
    includesNormalized(combined, "evening") ||
    includesNormalized(combined, "travel") ||
    includesNormalized(combined, "on call")
  ) {
    return "fail";
  }

  return "pass";
}

function coachingFutureSupportStatus(posting: JobPosting): NonNegotiableStatus {
  const combined = [
    posting.location,
    posting.schedule,
    ...posting.requirements,
    ...posting.responsibilities
  ]
    .filter(Boolean)
    .join(" ");

  if (!combined && posting.workMode === "unknown") {
    return "unknown";
  }

  if (
    includesNormalized(combined, "relocation") ||
    includesNormalized(combined, "relocate")
  ) {
    return "fail";
  }

  if (
    posting.workMode === "remote" ||
    includesNormalized(posting.location ?? "", "remote") ||
    includesNormalized(combined, "fully remote")
  ) {
    return "pass";
  }

  if (
    posting.workMode === "hybrid" ||
    includesNormalized(posting.location ?? "", "hybrid")
  ) {
    return "partial";
  }

  if (posting.workMode === "onsite") {
    return posting.location ? "partial" : "fail";
  }

  return "unknown";
}

function roleAlignmentStatus(
  laneMatch: LaneMatchResult,
  posting: JobPosting
): NonNegotiableStatus {
  if (laneMatch.level === "stretch") {
    return "fail";
  }

  const unsupportedAnalystSignals = posting.requirements.some(
    (item) =>
      includesNormalized(item, "sql") ||
      includesNormalized(item, "tableau") ||
      includesNormalized(item, "power bi") ||
      includesNormalized(item, "advanced analytics")
  );

  if (unsupportedAnalystSignals) {
    return laneMatch.level === "primary" ? "partial" : "fail";
  }

  return laneMatch.level === "adjacent" ? "partial" : "pass";
}

function chaosRiskStatus(posting: JobPosting): NonNegotiableStatus {
  const combined = [...posting.leadershipSignals, ...posting.ambiguitySignals].join(" ");

  if (!combined) {
    return "unknown";
  }

  if (
    includesNormalized(combined, "founder") ||
    includesNormalized(combined, "wear many hats") ||
    includesNormalized(combined, "ambiguous")
  ) {
    return "fail";
  }

  return "pass";
}

export function evaluateNonNegotiables(posting: JobPosting, laneMatch: LaneMatchResult) {
  const rules = loadFitRules().nonNegotiables;
  const statuses: NonNegotiableStatus[] = [
    roleAlignmentStatus(laneMatch, posting),
    stableCompensationStatus(posting.pay),
    benefitsStatus(posting.benefits),
    scheduleStatus(posting),
    coachingFutureSupportStatus(posting),
    chaosRiskStatus(posting)
  ];

  return rules.map((rule, index) => {
    const status = statuses[index] ?? "unknown";

    return {
      rule,
      status,
      notes:
        status === "pass"
          ? "Clears the current first-pass rule check."
          : status === "partial"
            ? "Partially supported. Keep the tradeoff visible."
            : status === "fail"
              ? "Conflicts with the approved rule set and should lower confidence."
              : "Unknown from the posting. Preserve as unresolved."
    };
  });
}
