import { loadCandidateProfile } from "@/lib/domain/candidate-profile/loader";
import { loadFitRules } from "@/lib/domain/fit-rules/loader";
import { loadResumeDirectionRules } from "@/lib/domain/resume-direction/loader";
import type { LaneMatchResult } from "@/lib/domain/analysis-session";
import type {
  JobPosting,
  JobAnalysis
} from "@/lib/validation/schemas";
import { includesNormalized, normalizeText } from "@/lib/utils/text";

type AnalysisEvidence = {
  positiveSignals: JobAnalysis["positiveSignals"];
  riskFlags: JobAnalysis["riskFlags"];
  strongestMatchingProof: JobAnalysis["strongestMatchingProof"];
  translationAreas: JobAnalysis["translationAreas"];
  gaps: JobAnalysis["gaps"];
  resumeTailoringPriorities: JobAnalysis["resumeTailoringPriorities"];
};

const toolRiskKeywords = ["salesforce", "hubspot admin", "sql", "tableau", "power bi"];
const overlapStopWords = new Set([
  "and",
  "the",
  "for",
  "with",
  "from",
  "into",
  "through",
  "across",
  "between",
  "while",
  "that",
  "this",
  "those",
  "their",
  "there",
  "about",
  "ability",
  "support",
  "experience",
  "years",
  "year",
  "plus",
  "role",
  "work",
  "team",
  "teams",
  "using",
  "use",
  "manage"
]);

function getMeaningfulTokens(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !overlapStopWords.has(token));
}

function countTokenOverlap(left: string, right: string) {
  const leftTokens = new Set(getMeaningfulTokens(left));
  const rightTokens = new Set(getMeaningfulTokens(right));
  let overlapCount = 0;

  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      overlapCount += 1;
    }
  }

  return overlapCount;
}

function dedupeStrongestProof(
  strongestMatchingProof: JobAnalysis["strongestMatchingProof"]
) {
  const seenClaims = new Set<string>();

  return strongestMatchingProof.filter((proof) => {
    const normalizedClaim = normalizeText(proof.claim);

    if (seenClaims.has(normalizedClaim)) {
      return false;
    }

    seenClaims.add(normalizedClaim);
    return true;
  });
}

function dedupeTranslationAreas(
  translationAreas: Array<
    JobAnalysis["translationAreas"][number] & {
      dedupeKey: string;
      priority: number;
    }
  >
): JobAnalysis["translationAreas"] {
  const groupedAreas = new Map<
    string,
    {
      jobNeeds: string[];
      candidateAngle: string;
      warning: string | null;
      priority: number;
    }
  >();

  for (const area of translationAreas) {
    const existing = groupedAreas.get(area.dedupeKey);

    if (existing) {
      if (!existing.jobNeeds.includes(area.jobNeed)) {
        existing.jobNeeds.push(area.jobNeed);
      }

      existing.warning = existing.warning ?? area.warning;
      existing.priority = Math.max(existing.priority, area.priority);
      continue;
    }

    groupedAreas.set(area.dedupeKey, {
      jobNeeds: [area.jobNeed],
      candidateAngle: area.candidateAngle,
      warning: area.warning,
      priority: area.priority
    });
  }

  return [...groupedAreas.values()]
    .sort((left, right) => right.priority - left.priority)
    .map((area) => ({
      jobNeed:
        area.jobNeeds.length === 1
          ? area.jobNeeds[0]
          : `${area.jobNeeds[0]} (+${area.jobNeeds.length - 1} similar posting needs)`,
      candidateAngle: area.candidateAngle,
      warning: area.warning
    }));
}

function dedupeGaps(gaps: JobAnalysis["gaps"]): JobAnalysis["gaps"] {
  const groupedGaps = new Map<
    string,
    JobAnalysis["gaps"][number] & { duplicateCount: number }
  >();
  const severityRank = {
    low: 0,
    medium: 1,
    high: 2
  } as const;

  for (const gap of gaps) {
    const dedupeKey =
      gap.gapType === "metric"
        ? "metric:quantified-proof"
        : `${gap.gapType}:${normalizeText(gap.detail)}`;
    const existing = groupedGaps.get(dedupeKey);

    if (existing) {
      existing.duplicateCount += 1;

      if (severityRank[gap.severity] > severityRank[existing.severity]) {
        existing.severity = gap.severity;
      }

      continue;
    }

    groupedGaps.set(dedupeKey, {
      ...gap,
      duplicateCount: 1
    });
  }

  return [...groupedGaps.values()].map(({ duplicateCount, ...gap }) => {
    if (gap.gapType === "metric" && duplicateCount > 1) {
      return {
        ...gap,
        detail:
          "Multiple posting lines lean on measurable reporting or metrics, and preserved quantified proof remains limited."
      };
    }

    return gap;
  });
}

export function collectAnalysisEvidence(
  posting: JobPosting,
  laneMatch: LaneMatchResult
): AnalysisEvidence {
  const profile = loadCandidateProfile().candidateProfile;
  const fitRules = loadFitRules();
  const resumeRules = loadResumeDirectionRules();

  const positiveSignals = new Set<string>();
  const riskFlags = new Set<string>();
  const strongestMatchingProof: JobAnalysis["strongestMatchingProof"] = [];
  const translationAreas: Array<
    JobAnalysis["translationAreas"][number] & {
      dedupeKey: string;
      priority: number;
    }
  > = [];
  const gaps: JobAnalysis["gaps"] = [];

  if (posting.benefits) {
    positiveSignals.add("Benefits package");
  }

  if (posting.pay && !includesNormalized(posting.pay, "commission")) {
    positiveSignals.add("Stable salary");
  }

  if (
    posting.leadershipSignals.some(
      (signal) =>
        includesNormalized(signal, "clear") ||
        includesNormalized(signal, "structured") ||
        includesNormalized(signal, "cross-functional")
    )
  ) {
    positiveSignals.add("Healthy leadership and reporting clarity");
  }

  if (
    posting.responsibilities.some(
      (item) =>
        includesNormalized(item, "process") ||
        includesNormalized(item, "documentation") ||
        includesNormalized(item, "coordination")
    )
  ) {
    positiveSignals.add("Operational structure and documentation focus");
  }

  if (laneMatch.level === "primary" || laneMatch.level === "secondary") {
    positiveSignals.add("Good fit with process-building and execution strengths");
  }

  if (posting.workMode === "remote" || posting.workMode === "hybrid") {
    positiveSignals.add("Role can strengthen long-term resume positioning");
  }

  if (
    posting.requirements.some((item) => includesNormalized(item, "commission")) ||
    includesNormalized(posting.pay ?? "", "commission")
  ) {
    riskFlags.add("Commission-heavy structure without base stability");
  }

  if (
    posting.ambiguitySignals.some(
      (item) =>
        includesNormalized(item, "founder") ||
        includesNormalized(item, "ambiguous") ||
        includesNormalized(item, "fast-paced")
    )
  ) {
    riskFlags.add("Founder-led chaos without infrastructure");
  }

  if (
    [...posting.requirements, ...posting.responsibilities].some(
      (item) =>
        includesNormalized(item, "travel") ||
        includesNormalized(item, "weekend") ||
        includesNormalized(item, "evening") ||
        includesNormalized(item, "on call")
    )
  ) {
    riskFlags.add("Schedule conflict with coaching commitments");
  }

  if (
    posting.title &&
    includesNormalized(posting.title, "sales") &&
    !includesNormalized(posting.title, "operations")
  ) {
    riskFlags.add("Pure sales role disguised as operations");
  }

  if (
    [...posting.requirements, ...posting.tools].some((item) =>
      toolRiskKeywords.some((keyword) => includesNormalized(item, keyword))
    )
  ) {
    riskFlags.add("Unsupported analyst or enterprise-tool depth");
  }

  for (const tool of posting.tools) {
    if (profile.confirmedTools.some((confirmedTool) => includesNormalized(tool, confirmedTool))) {
      strongestMatchingProof.push({
        claim: `Confirmed tool overlap with ${tool}.`,
        sourceType: "skills_inventory",
        confidence: "confirmed"
      });
    } else {
      gaps.push({
        gapType: "tool",
        detail: `${tool} appears in the posting but is not confirmed in the candidate record.`,
        severity: toolRiskKeywords.some((keyword) => includesNormalized(tool, keyword))
          ? "high"
          : "medium"
      });
    }
  }

  const proofSeed = [
    ...profile.roleHistory.flatMap((role) => role.responsibilities.map((item) => ({
      claim: item,
      sourceType: "role_history" as const,
      confidence:
        role.confidence === "CONFIRMED"
          ? ("confirmed" as const)
          : ("possible_needs_verification" as const)
    }))),
    ...profile.achievementHighlights.map((item) => ({
      claim: item.achievement,
      sourceType: "achievement_bank" as const,
      confidence: "confirmed" as const
    }))
  ];

  for (const requirement of [...posting.requirements, ...posting.responsibilities]) {
    const supportingProof = proofSeed
      .map((proof) => {
        const overlapCount = countTokenOverlap(requirement, proof.claim);
        const hasDirectMatch =
          includesNormalized(requirement, proof.claim) ||
          includesNormalized(proof.claim, requirement);
        const sharesConfirmedSkill = profile.confirmedSkills.some((skill) => {
          const normalizedSkill = normalizeText(skill);
          const requirementText = normalizeText(requirement);
          const proofText = normalizeText(proof.claim);

          return (
            requirementText.includes(normalizedSkill) &&
            proofText.includes(normalizedSkill)
          );
        });

        return {
          proof,
          score:
            (hasDirectMatch ? 100 : 0) +
            (sharesConfirmedSkill ? 25 : 0) +
            overlapCount * 10 +
            (proof.confidence === "confirmed" ? 5 : 0)
        };
      })
      .filter((candidate) => candidate.score >= 20)
      .sort((left, right) => right.score - left.score)[0]?.proof;

    if (supportingProof) {
      if (strongestMatchingProof.length < 4) {
        strongestMatchingProof.push(supportingProof);
      }

      continue;
    }

    if (
      includesNormalized(requirement, "onboarding") ||
      includesNormalized(requirement, "implementation") ||
      includesNormalized(requirement, "customer")
    ) {
      translationAreas.push({
        jobNeed: requirement,
        candidateAngle:
          "Bridge the requirement through customer onboarding, coordination, and handoff clarity already supported in the profile.",
        warning: includesNormalized(requirement, "implementation")
          ? "Keep implementation language coordination-focused rather than technical."
          : null,
        dedupeKey: includesNormalized(requirement, "implementation")
          ? "translation:implementation_coordination"
          : "translation:customer_onboarding",
        priority: includesNormalized(requirement, "implementation") ? 2 : 1
      });
      continue;
    }

    if (
      includesNormalized(requirement, "report") ||
      includesNormalized(requirement, "metrics") ||
      includesNormalized(requirement, "dashboard")
    ) {
      translationAreas.push({
        jobNeed: requirement,
        candidateAngle:
          "Position through KPI framework design, Airtable tracking, and accountability reporting support.",
        warning: "Hard quantified proof remains an open issue and should stay marked as a gap.",
        dedupeKey: "translation:metrics_reporting",
        priority: 3
      });
      gaps.push({
        gapType: "metric",
        detail:
          "The posting leans on measurable reporting or metrics, and preserved quantified proof remains limited.",
        severity: "high"
      });
      continue;
    }
  }

  if (!posting.pay) {
    gaps.push({
      gapType: "compensation",
      detail: "Compensation is not stated, so earnings stability remains unknown.",
      severity: "medium"
    });
  }

  if (!posting.benefits) {
    gaps.push({
      gapType: "benefits",
      detail: "Benefits are not stated, which matters materially to the approved life-fit rules.",
      severity: "medium"
    });
  }

  if (!posting.schedule) {
    gaps.push({
      gapType: "schedule",
      detail: "Schedule expectations are not stated, so coaching compatibility remains unresolved.",
      severity: "medium"
    });
  }

  if (!posting.domain) {
    gaps.push({
      gapType: "domain",
      detail: "Domain context is unclear, so direct industry overlap should not be overstated.",
      severity: "low"
    });
  }

  if (laneMatch.level === "stretch") {
    gaps.push({
      gapType: "scope",
      detail: "The strongest lane match is still a stretch lane from the approved map.",
      severity: "high"
    });
  }

  for (const flag of fitRules.cautionFlags) {
    if (
      [...posting.requirements, ...posting.ambiguitySignals, ...posting.leadershipSignals].some(
        (item) => includesNormalized(item, flag)
      )
    ) {
      riskFlags.add(flag);
    }
  }

  const laneDirection = resumeRules.laneDirections[laneMatch.resumeDirectionKey];
  const dedupedTranslationAreas = dedupeTranslationAreas(translationAreas);
  const resumeTailoringPriorities = [
    ...laneDirection.summaryFocus,
    ...dedupedTranslationAreas.map((area) => area.jobNeed)
  ].slice(0, 5);

  return {
    positiveSignals: [...positiveSignals],
    riskFlags: [...riskFlags],
    strongestMatchingProof: dedupeStrongestProof(strongestMatchingProof).slice(0, 4),
    translationAreas: dedupedTranslationAreas.slice(0, 4),
    gaps: dedupeGaps(gaps).slice(0, 8),
    resumeTailoringPriorities
  };
}
