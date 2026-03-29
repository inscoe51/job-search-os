import { z } from "zod";

import {
  applicationStatusValues,
  networkingStatusValues
} from "@/lib/domain/tracker-status";

const nullableStringSchema = z.string().nullable();
const stringArraySchema = z.array(z.string());

export const workModeSchema = z.enum(["remote", "hybrid", "onsite", "unknown"]);

export const jobPostingSchema = z.object({
  company: nullableStringSchema,
  title: z.string().min(1),
  location: nullableStringSchema,
  pay: nullableStringSchema,
  benefits: nullableStringSchema,
  schedule: nullableStringSchema,
  workMode: workModeSchema,
  responsibilities: stringArraySchema,
  requirements: stringArraySchema,
  tools: stringArraySchema,
  domain: nullableStringSchema,
  leadershipSignals: stringArraySchema,
  ambiguitySignals: stringArraySchema,
  sourceUrlOrIdentifier: nullableStringSchema
});

export const nonNegotiableCheckSchema = z.object({
  rule: z.string(),
  status: z.enum(["pass", "partial", "fail", "unknown"]),
  notes: z.string()
});

export const strongestProofSchema = z.object({
  claim: z.string(),
  sourceType: z.enum([
    "role_history",
    "achievement_bank",
    "skills_inventory",
    "resume_assets"
  ]),
  confidence: z.enum([
    "confirmed",
    "strong_inference",
    "possible_needs_verification"
  ])
});

export const translationAreaSchema = z.object({
  jobNeed: z.string(),
  candidateAngle: z.string(),
  warning: z.string().nullable()
});

export const gapSchema = z.object({
  gapType: z.enum([
    "tool",
    "domain",
    "metric",
    "scope",
    "title",
    "schedule",
    "compensation",
    "benefits",
    "other"
  ]),
  detail: z.string(),
  severity: z.enum(["low", "medium", "high"])
});

export const fitVerdictSchema = z.object({
  rating: z.enum(["strong_fit", "workable_fit", "stretch_fit", "low_fit"]),
  lifeFitLabel: z.enum([
    "green_light",
    "yellow_light",
    "red_light",
    "freelance_better"
  ]),
  summary: z.string()
});

export const jobAnalysisSchema = z.object({
  jobSnapshot: z.object({
    company: nullableStringSchema,
    title: z.string(),
    normalizedRoleType: z.string(),
    location: nullableStringSchema,
    pay: nullableStringSchema,
    workMode: z.string(),
    summary: z.string()
  }),
  nonNegotiablesCheck: z.array(nonNegotiableCheckSchema),
  positiveSignals: stringArraySchema,
  riskFlags: stringArraySchema,
  fitVerdict: fitVerdictSchema,
  strongestMatchingProof: z.array(strongestProofSchema),
  translationAreas: z.array(translationAreaSchema),
  gaps: z.array(gapSchema),
  positioningStrategy: z.object({
    recommendedLane: z.string(),
    positioningParagraph: z.string(),
    tone: z.literal("evidence_first_no_inflation")
  }),
  resumeDirection: z.object({
    recommendedVariant: z.string(),
    emphasize: stringArraySchema,
    deEmphasize: stringArraySchema,
    allowedToolClaims: stringArraySchema
  }),
  resumeTailoringPriorities: stringArraySchema,
  nextAction: z.object({
    recommendation: z.enum(["apply", "apply_with_caution", "hold", "pass"]),
    why: z.string(),
    preApplyRequirements: stringArraySchema
  })
});

export const scoreBreakdownSchema = z.object({
  laneAlignment: z.number().min(0),
  evidenceAlignment: z.number().min(0),
  requirementsRealism: z.number().min(0),
  compensationStability: z.number().min(0),
  benefitsValue: z.number().min(0),
  scheduleLifeFit: z.number().min(0),
  workModeLocationFit: z.number().min(0),
  leadershipStructureQuality: z.number().min(0),
  penalties: z.array(
    z.object({
      condition: z.string(),
      deduct: z.number().min(0)
    })
  )
});

export const analysisDecisionPayloadSchema = z.object({
  selectedRecommendation: z.enum([
    "apply",
    "apply_with_caution",
    "hold",
    "pass"
  ]),
  applicationStatus: z.enum(applicationStatusValues),
  networkingStatus: z.enum(networkingStatusValues),
  applicationDate: z.string().nullable(),
  followUpDate: z.string().nullable(),
  interviewStage: z.string().nullable(),
  outcome: z.string().nullable(),
  notes: z.string().nullable()
});

export const trackerRecordSchema = z.object({
  jobId: z.string().min(1),
  source: z.string().min(1),
  company: z.string().min(1),
  title: z.string().min(1),
  laneMatched: z.string().min(1),
  fitScore: z.number().min(0).max(100),
  fitVerdict: z.string().min(1),
  lifeFitLabel: z.string().min(1),
  resumeVariant: z.string().min(1),
  networkingStatus: z.enum(networkingStatusValues),
  applicationStatus: z.enum(applicationStatusValues),
  applicationDate: z.string().nullable(),
  followUpDate: z.string().nullable(),
  interviewStage: z.string().nullable(),
  outcome: z.string().nullable(),
  notes: z.string().nullable(),
  savedAt: z.string(),
  updatedAt: z.string(),
  analysisContext: z.object({
    summary: z.string(),
    recommendation: z.enum(["apply", "apply_with_caution", "hold", "pass"]),
    nextAction: z.string(),
    positiveSignals: stringArraySchema,
    riskFlags: stringArraySchema,
    strongestMatchingProof: z.array(strongestProofSchema),
    gaps: z.array(gapSchema)
  })
});

export const analysisSessionSchema = z.object({
  sessionId: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  intakeInput: jobPostingSchema,
  normalizedJobPosting: jobPostingSchema,
  analysis: jobAnalysisSchema,
  score: z.number().min(0).max(100),
  matchedLaneId: z.string().min(1),
  matchedLaneLevel: z.enum(["primary", "secondary", "adjacent", "stretch"]),
  reviewState: z.object({
    currentStep: z.enum(["intake", "review", "decision", "saved"]),
    lastReviewedAt: z.string().nullable()
  }),
  decisionPayload: analysisDecisionPayloadSchema.nullable(),
  saveReadyTrackerRecord: trackerRecordSchema.nullable()
});

export const candidateProfileSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    generated_from: stringArraySchema,
    purpose: z.string()
  }),
  candidateProfile: z.object({
    targetStrategy: z.object({
      primaryTitles: stringArraySchema,
      secondaryTitles: stringArraySchema,
      targetFunctions: stringArraySchema,
      includeRules: stringArraySchema,
      excludeRules: stringArraySchema,
      targetWorkArrangements: stringArraySchema,
      targetIndustries: stringArraySchema,
      targetPriorityStackNeedsFinalVerification: z.boolean()
    }),
    workPreferences: z.object({
      compensationTargetBaseUSDPerYear: z.string(),
      benefitsPriority: z.string(),
      workModePreference: z.string(),
      geographicConstraint: z.string(),
      scheduleConstraintSummary: z.string(),
      scheduleConstraintDetails: stringArraySchema,
      preferredEmployerTraits: stringArraySchema,
      avoidEmployerTraits: stringArraySchema
    }),
    education: z.array(z.record(z.string(), z.unknown())),
    roleHistory: z.array(
      z.object({
        employer: z.string(),
        title: z.string(),
        titleAliases: stringArraySchema,
        displayDate: z.string(),
        dateStatus: z.string(),
        responsibilities: stringArraySchema,
        achievements: stringArraySchema,
        toolsUsed: stringArraySchema,
        confidence: z.string(),
        resumeSafe: z.boolean(),
        notes: stringArraySchema
      })
    ),
    confirmedSkills: stringArraySchema,
    confirmedTools: stringArraySchema,
    valuePropositionThemes: stringArraySchema,
    differentiators: stringArraySchema,
    achievementHighlights: z.array(
      z.object({
        achievement: z.string(),
        category: z.string(),
        metricStatus: z.string(),
        metricValue: z.string(),
        resumeSafe: z.boolean()
      })
    ),
    copySignals: z.object({
      summaryFragments: stringArraySchema,
      strongPhrases: stringArraySchema,
      keywords: stringArraySchema
    }),
    openNormalizationRisks: stringArraySchema
  })
});

export const targetLaneSchema = z.object({
  laneId: z.string(),
  displayName: z.string(),
  fitLevel: z.enum(["primary", "secondary", "adjacent", "stretch"]),
  whyItFits: stringArraySchema.optional(),
  evidenceThemes: stringArraySchema.optional(),
  resumeDirection: z.string().optional(),
  sourceTitles: stringArraySchema.optional(),
  avoidUnless: stringArraySchema.optional(),
  reason: z.string().optional()
});

export const targetLanesSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    generated_from: stringArraySchema,
    purpose: z.string()
  }),
  laneOrderingStatus: z.string(),
  primaryLanes: z.array(targetLaneSchema),
  secondaryLanes: z.array(targetLaneSchema),
  adjacentLanes: z.array(targetLaneSchema),
  stretchOrCautionLanes: z.array(targetLaneSchema)
});

export const fitRulesSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    generated_from: stringArraySchema,
    purpose: z.string()
  }),
  nonNegotiables: stringArraySchema,
  preferredCharacteristics: stringArraySchema,
  positiveSignals: stringArraySchema,
  cautionFlags: stringArraySchema,
  evaluationCategories: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      priority: z.string(),
      question: z.string()
    })
  ),
  ratingScale: z.record(z.string(), z.string()),
  hardRules: stringArraySchema,
  decisionHeuristics: z.object({
    strongTarget: stringArraySchema,
    proceedCarefully: stringArraySchema,
    poorFit: stringArraySchema
  })
});

export const workflowRulesSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    generated_from: stringArraySchema,
    purpose: z.string()
  }),
  workflowDefinitions: z.record(z.string(), z.string()),
  fastFitScoringModel: z.object({
    status: z.string(),
    notes: stringArraySchema,
    maxScore: z.number(),
    categories: z.array(
      z.object({
        id: z.string(),
        points: z.number(),
        description: z.string()
      })
    ),
    penalties: z.array(
      z.object({
        condition: z.string(),
        deduct: z.number()
      })
    ),
    scoreBands: z.object({
      apply: z.string(),
      hold: z.string(),
      caution_or_selective_apply: z.string(),
      reject: z.string()
    })
  }),
  applyHoldRejectLogic: z.object({
    apply: stringArraySchema,
    hold: stringArraySchema,
    reject: stringArraySchema
  }),
  resumeVariantRouting: z.record(z.string(), stringArraySchema),
  trackerFields: z.array(
    z.object({
      field: z.string(),
      type: z.string(),
      required: z.boolean()
    })
  ),
  statusModel: z.object({
    applicationStatuses: z.array(z.enum(applicationStatusValues)),
    networkingStatuses: z.array(z.enum(networkingStatusValues))
  }),
  qualityControlRules: stringArraySchema
});

export const resumeDirectionRulesSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    generated_from: stringArraySchema,
    purpose: z.string()
  }),
  resumeConstructionPriorities: stringArraySchema,
  globalRules: z.object({
    professionalSummaryRules: stringArraySchema,
    experienceBulletRules: stringArraySchema,
    skillsRules: stringArraySchema,
    toolsRules: stringArraySchema,
    omitDefinition: z.string()
  }),
  allowedToolClaims: stringArraySchema,
  laneDirections: z.record(
    z.string(),
    z.object({
      summaryFocus: stringArraySchema,
      emphasize: stringArraySchema,
      deEmphasize: stringArraySchema
    })
  ),
  decisionHeuristics: z.record(z.string(), z.string())
});

export const integrityRulesSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    generated_from: stringArraySchema,
    purpose: z.string()
  }),
  evidenceLevels: z.record(
    z.string(),
    z.object({
      definition: z.string(),
      allowedBehavior: stringArraySchema
    })
  ),
  coreRules: stringArraySchema,
  forbiddenBehaviors: stringArraySchema,
  gapHandlingRules: stringArraySchema,
  timelineAndTitleRules: stringArraySchema
});

export type JobPosting = z.infer<typeof jobPostingSchema>;
export type JobAnalysis = z.infer<typeof jobAnalysisSchema>;
export type AnalysisSession = z.infer<typeof analysisSessionSchema>;
export type TrackerRecord = z.infer<typeof trackerRecordSchema>;
export type AnalysisDecisionPayload = z.infer<
  typeof analysisDecisionPayloadSchema
>;
export type CandidateProfileData = z.infer<typeof candidateProfileSchema>;
export type TargetLanesData = z.infer<typeof targetLanesSchema>;
export type FitRulesData = z.infer<typeof fitRulesSchema>;
export type WorkflowRulesData = z.infer<typeof workflowRulesSchema>;
export type ResumeDirectionRulesData = z.infer<
  typeof resumeDirectionRulesSchema
>;
export type IntegrityRulesData = z.infer<typeof integrityRulesSchema>;
