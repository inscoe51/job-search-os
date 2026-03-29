# 021_mvp_scaffold_plan.md

## Build Objective
Scaffold the first working MVP pass for Job Search OS as a single-user, profile-driven web app that supports the approved core loop only:

1. enter one job posting
2. run rules-based analysis against approved source files
3. review the fit output
4. save the decision into the tracker
5. review saved records in a weekly workflow view

This first pass should prioritize structural correctness, rules integrity, and demo readiness over polish or feature breadth.

## Repo Scaffold Recommendation
Create a clean Next.js + React + TypeScript scaffold with Tailwind CSS, route-level separation for the approved screens, pure domain modules for rules logic, and a thin persistence boundary for tracker records.

Scaffold only what is needed for:
- Job Intake
- Analysis Review
- Decision + Save
- Tracker / Weekly Review
- Tracker Record Detail

Do not scaffold unsupported future modules.

## Stack Recommendation Aligned to the Approved Docs
- **Framework:** Next.js App Router
- **Language:** TypeScript in strict mode
- **UI:** React components with Tailwind CSS
- **Validation:** schema validation for intake, analysis output assembly, and tracker records
- **Persistence:** local single-user persistence behind a repository interface
- **Testing:** targeted unit tests for core rule modules plus at least one end-to-end smoke path for the MVP loop

Implementation note:
Keep persistence swappable. The first pass may use local storage or a lightweight local adapter, but UI and domain modules should not depend directly on storage details.

## File / Folder Structure
```text
/
  app/
    page.tsx
    layout.tsx
    new-analysis/
      page.tsx
    tracker/
      page.tsx
    tracker/[jobId]/
      page.tsx
  components/
    intake/
      job-intake-form.tsx
      list-field-input.tsx
    analysis/
      analysis-review.tsx
      fit-verdict-card.tsx
      proof-list.tsx
      gaps-list.tsx
      next-action-card.tsx
    decision/
      decision-save-form.tsx
    tracker/
      tracker-table.tsx
      tracker-filters.tsx
      tracker-record-panel.tsx
    shared/
      page-shell.tsx
      status-badge.tsx
      empty-state.tsx
  lib/
    domain/
      candidate-profile/
        loader.ts
        types.ts
      target-lanes/
        loader.ts
        resolver.ts
        types.ts
      fit-rules/
        loader.ts
        evaluator.ts
        types.ts
      workflow-rules/
        loader.ts
        scoring.ts
        status-mapper.ts
        types.ts
      resume-direction/
        loader.ts
        router.ts
        types.ts
      integrity/
        loader.ts
        guard.ts
        evidence.ts
        types.ts
    analysis/
      normalizers/
        job-posting-normalizer.ts
      validators/
        job-posting-validator.ts
      evaluators/
        non-negotiables.ts
        lane-match.ts
        risk-flags.ts
        gaps.ts
      assemblers/
        job-analysis-assembler.ts
      types.ts
    tracker/
      repository/
        tracker-repository.ts
        local-tracker-repository.ts
      mappers/
        analysis-to-tracker-record.ts
      filters/
        tracker-filters.ts
      types.ts
    validation/
      schemas.ts
    utils/
      ids.ts
      dates.ts
  data/
    foundation/
      01_profile.json
      02_target_lanes.json
      03_fit_rules.json
      04_analysis_schema.json
      05_workflow_rules.json
      06_resume_direction_rules.json
      07_integrity_rules.json
      09_open_issues.md
  docs/
    017_mvp_prd.md
    018_screen_blueprint.md
    019_agents.md
    020_codex_build_brief.md
  tests/
    analysis/
    tracker/
    smoke/
```

## Module List
### Foundation and Domain Modules
- candidate profile loader
- target lane loader and resolver
- fit rules loader and evaluator
- workflow rules loader, scoring, and status mapping
- resume direction router
- integrity guard and evidence classifier

### Analysis Modules
- job posting normalization
- job posting validation
- non-negotiables evaluation
- lane matching
- positive signal and risk-flag evaluation
- gap detection
- fit scoring and band routing
- next-action routing
- analysis object assembly

### Tracker Modules
- analysis-to-tracker mapper
- tracker repository interface
- local tracker repository adapter
- tracker filters and sort helpers
- tracker record update logic

### UI Modules
- job intake form
- analysis review layout
- decision and save form
- tracker list and filters
- tracker record detail panel

## Data Object Implementation Order
1. **jobPosting**
   - Needed first because intake and validation start the loop.
2. **candidateProfile**
   - Needed for evidence comparison and life-fit evaluation.
3. **targetLaneMap**
   - Needed for lane routing.
4. **fitRules**
   - Needed for non-negotiables, positive signals, and risk flags.
5. **workflowRules / statusModel**
   - Needed for scoring, score bands, and tracker status mapping.
6. **resumeDirectionRules**
   - Needed after lane match to produce variant guidance.
7. **integrityRules**
   - Needed before final analysis assembly so unsupported claims stay blocked.
8. **jobAnalysis**
   - Output contract for the review screen.
9. **trackerRecord**
   - Final saved object for tracker workflows.

## Rules Engine Implementation Order
1. Load foundation data and expose typed accessors.
2. Validate and normalize `jobPosting` input.
3. Resolve lane match using `02_target_lanes.json`.
4. Evaluate non-negotiables and preference fit using `03_fit_rules.json`.
5. Classify evidence strength and apply integrity constraints from `07_integrity_rules.json`.
6. Detect gaps, ambiguity, and risk flags.
7. Apply fast-fit scoring and score-band routing from `05_workflow_rules.json`.
8. Route recommended resume variant from `05_workflow_rules.json` and `06_resume_direction_rules.json`.
9. Assemble the full `jobAnalysis` object using `04_analysis_schema.json`.
10. Map `jobAnalysis` into a valid `trackerRecord` with approved statuses and required fields.

## Screen Implementation Order
1. **New Analysis / Job Intake**
   - Build the intake route and structured form.
2. **Analysis Review**
   - Render full analysis output from the rules engine.
3. **Decision + Save**
   - Convert analysis into tracker-safe save behavior.
4. **Tracker / Weekly Review**
   - Render saved roles with MVP-safe filtering and sorting.
5. **Tracker Record Detail**
   - Support workflow updates without rerunning the original analysis.

## Phase-by-Phase Acceptance Criteria
### Phase 1 — Repo and Source Lock
Complete when:
- approved docs are present in `/docs`
- approved foundation files are present in `/data/foundation`
- route skeletons exist only for approved screens
- typed object boundaries exist for `jobPosting`, `jobAnalysis`, and `trackerRecord`
- no unsupported features are scaffolded

### Phase 2 — Analysis Engine Foundation
Complete when:
- one valid posting can be normalized and validated
- lane resolution works against approved lane data
- non-negotiables, risk flags, and gaps can be computed without invented data
- evidence classification respects confirmed vs inferred vs missing support
- fit score, fit verdict, and next action can be generated deterministically

### Phase 3 — Review and Save Flow
Complete when:
- analysis output renders in a decision-ready layout
- the review screen shows verdict, proof, gaps, lane, resume variant, and next action
- save behavior creates a valid `trackerRecord`
- tracker status mapping uses approved values only
- original analysis context stays attached to the saved record

### Phase 4 — Tracker Workflow
Complete when:
- saved records appear in tracker view
- records can be filtered and sorted using approved fields only
- one record can be opened and updated in detail view
- workflow fields update without mutating the original analysis result

### Phase 5 — Demo Hardening
Complete when:
- the full MVP loop works end to end
- there is at least one smoke path covering Intake → Review → Save → Tracker
- core logic has targeted unit coverage
- empty states and partial-data states behave safely
- the prototype remains inside approved MVP scope

## Known Risks / Open Issues to Watch During Scaffolding
- **APW end date** remains month-normalized and must not be treated as exact-day precise.
- **APW title strategy** is still not fully locked for broader employer-facing reuse.
- **First-push lane order** is strong but not fully finalized.
- **Hard metrics / quantified proof** remain the largest credibility gap and should surface as gaps rather than being inferred.
- **Coaching-availability language** should affect life-fit logic internally, but employer-facing phrasing is still unresolved.
- **Job-separation explanation** remains an open normalization issue and should not be auto-generated.
- **Implementation / enablement positioning** must stay carefully framed until stronger direct proof exists.

## Scaffold Guardrails
- Build the core loop only.
- Keep business logic out of UI components.
- Do not invent facts, metrics, or fit strength.
- Do not add authentication, resume upload, multi-user behavior, advanced dashboards, or automation.
- Stop the first pass at a clean scaffold with working flow, not at production-grade completeness.
