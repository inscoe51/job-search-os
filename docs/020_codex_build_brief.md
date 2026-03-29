# 020_codex_build_brief.md

## App Overview
Job Search OS is a single-user, profile-driven web app that turns one job posting at a time into an honest apply / hold / pass decision, matched lane, resume-direction recommendation, and tracker-ready record. This build should optimize for a working competition-ready prototype, not feature breadth. The scaffold should support the full MVP loop: intake one posting, analyze it against the locked foundation rules, present a disciplined review, save the result into a tracker, and support simple weekly follow-up.

## Target User
The current MVP is for one specific candidate profile already defined in the foundation pack.

This is not a generalized job platform. It is a single-user decision-support tool built around:
- one canonical candidate profile
- one set of target lanes
- one fit/routing rule set
- one truth-discipline layer
- one tracker workflow

The user is pursuing operations-oriented bridge roles with strong preference for remote or locally hybrid work, stable compensation, benefits, and compatibility with football coaching commitments.

## MVP Promise
For one job posting at a time, the app should give the user a defensible answer to:
- whether the role is worth pursuing
- which lane it belongs to
- which resume variant to use
- what proof supports the fit
- what the main risks and gaps are
- what action should happen next
- how the role should be saved for weekly review

## Exact Features to Scaffold First
Build only the features required to support the core loop, in this order:

1. **Foundation-rule loading layer**
   - Load canonical profile, lane map, fit rules, workflow rules, resume-direction rules, and integrity rules into the app.
   - Keep these sources readable and modular.

2. **Job Intake screen**
   - Structured form for one `jobPosting` object.
   - Support partial information without inventing missing details.
   - Enforce supported enums and required minimum validation.

3. **Analysis engine**
   - Job posting normalization
   - lane matching
   - non-negotiables evaluation
   - positive signal detection
   - risk flag detection
   - fast-fit scoring
   - evidence / gap handling
   - resume-variant routing
   - next-action routing

4. **Analysis Review screen**
   - Present the full analysis output in decision-ready form.
   - Surface strongest proof, gaps, ambiguity, risk flags, lane match, fit verdict, and recommended next action.

5. **Decision + Save screen**
   - Convert analysis output into a saved `trackerRecord`.
   - Carry forward fit data automatically.
   - Let the user set notes, follow-up, networking state, and application state.

6. **Tracker / Weekly Review screen**
   - Show all saved records.
   - Support practical filtering and sorting using approved tracker fields.
   - Emphasize actionability, not analytics.

7. **Tracker Record Detail screen**
   - Open one record.
   - Update workflow fields only.
   - Preserve original fit logic context.

8. **Core validation and smoke-test coverage**
   - Validate shape of key objects.
   - Add test coverage around the core loop and rule modules.

## Recommended Repo Structure
Use a simple modular web-app structure optimized for fast scaffolding and demo readiness.

```text
/
  app/
    new-analysis/
      page
    tracker/
      page
    tracker/[jobId]/
      page
    layout
    page
  components/
    intake/
    analysis/
    decision/
    tracker/
    shared/
  lib/
    domain/
      candidate-profile/
      target-lanes/
      fit-rules/
      workflow-rules/
      resume-direction/
      integrity/
    analysis/
      normalizers/
      evaluators/
      routers/
      mappers/
    tracker/
      repository/
      filters/
      status/
    validation/
    utils/
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
    demo/
  tests/
    analysis/
    tracker/
    smoke/
  docs/
    017_mvp_prd.md
    018_screen_blueprint.md
    019_agents.md
    020_codex_build_brief.md
```

Implementation notes:
- Keep source-of-truth data separate from UI code.
- Keep analysis logic separate from React components.
- Keep tracker persistence behind a repository boundary so the MVP can start simple without rewriting the whole app later.
- Keep docs in-repo and visible to Codex during build.

## Primary Data Objects
1. **candidateProfile**
   - Canonical single-user profile used for fit evaluation, evidence lookup, work-preference checks, and resume-safe positioning.
   - Governed by `01_profile.json`.

2. **targetLaneMap**
   - Defines primary, secondary, adjacent, and careful/stretch lanes and their role families.
   - Governed by `02_target_lanes.json`.

3. **fitRules**
   - Holds non-negotiables, preferences, red flags, evaluation criteria, and lane-fit heuristics.
   - Governed by `03_fit_rules.json`.

4. **jobPosting**
   - Structured input object for one analyzed posting.
   - Governed by `04_analysis_schema.json`.

5. **jobAnalysis**
   - Structured output object for one completed evaluation.
   - Includes job snapshot, fit verdict, signals, risk flags, proof, gaps, positioning strategy, resume direction, and next action.
   - Governed by `04_analysis_schema.json` plus rule files.

6. **workflowRules / statusModel**
   - Defines fast-fit scoring, score bands, next-action routing, tracker field requirements, and approved statuses.
   - Governed by `05_workflow_rules.json`.

7. **resumeDirectionRules**
   - Maps matched lane to permitted resume variants, emphasis, and de-emphasis.
   - Governed by `06_resume_direction_rules.json`.

8. **integrityRules**
   - Enforces evidence levels, anti-inflation behavior, title/date discipline, and gap handling.
   - Governed by `07_integrity_rules.json`.

9. **trackerRecord**
   - Saved operating record for one role.
   - Must include the approved tracker fields and status values from `05_workflow_rules.json`.

## Screen Build Order
Build screens in the same order as the approved blueprint:

1. **Job Intake**
   - First because the entire MVP begins with a valid `jobPosting` object.

2. **Analysis Review**
   - Second because the value of the product is the structured evaluation output.

3. **Decision + Save**
   - Third because the analysis only becomes operational once it is converted into a tracker record.

4. **Tracker / Weekly Review**
   - Fourth because saved records need a working list view for ongoing use.

5. **Tracker Record Detail**
   - Fifth because it depends on the tracker list and saved records already existing.

## Logic Build Order
Build logic modules in this order so each downstream screen has what it needs:

1. **Foundation data loaders**
   - Make canonical source files available to the app.

2. **Job posting validation and normalization**
   - Enforce required shape and supported values.

3. **Lane matching logic**
   - Determine whether the role aligns to primary, secondary, adjacent, or careful/stretch lanes.

4. **Non-negotiables and fit-rule evaluator**
   - Check benefits, compensation stability, schedule/life fit, work mode/location fit, and red flags.

5. **Evidence and integrity guard**
   - Separate confirmed facts, strong inference, possible/needs verification, and missing evidence.
   - Prevent inflated outputs.

6. **Fast-fit scoring and score-band routing**
   - Produce fit score, fit verdict range, and action band.

7. **Resume-variant router**
   - Map matched lane to the approved resume variant family and positioning direction.

8. **Analysis assembler**
   - Combine all upstream outputs into one `jobAnalysis` object.

9. **Decision-to-tracker mapper**
   - Convert `jobAnalysis` into a `trackerRecord` with approved statuses and required fields.

10. **Tracker repository and update logic**
   - Save records, list them, filter them, sort them, and update approved workflow fields.

## Phased Implementation Plan
### Phase 1 — Source Lock and Domain Setup
- Bring the foundation files and approved docs into the repo.
- Create typed domain models for the core objects.
- Set up the repo structure, route skeletons, and validation boundaries.

### Phase 2 — Job Intake and Analysis Engine
- Build the Job Intake screen.
- Implement job posting normalization and validation.
- Implement lane matching, fit-rule evaluation, integrity checks, fast-fit scoring, resume routing, and analysis assembly.

### Phase 3 — Analysis Review and Decision Save Flow
- Build the Analysis Review screen using the approved output contract.
- Build the Decision + Save screen.
- Implement `jobId` creation and tracker record mapping.

### Phase 4 — Tracker Workflow Layer
- Build Tracker / Weekly Review.
- Build Tracker Record Detail.
- Implement approved filters, sorting, and workflow updates.

### Phase 5 — MVP Hardening for Demo Use
- Add smoke tests for the full flow.
- Add targeted unit tests for core rule logic.
- Clean copy, edge-state handling, and empty-state behavior.
- Keep unresolved issues visible where they affect credibility.

## Acceptance Criteria by Phase
### Phase 1 — Source Lock and Domain Setup
Complete when:
- all foundation files are available in-repo
- approved planning docs are available in-repo
- core object shapes are defined
- route skeletons exist for the approved screens only
- no unsupported screens or features are scaffolded

### Phase 2 — Job Intake and Analysis Engine
Complete when:
- the app can accept one valid `jobPosting`
- missing values remain unknown rather than invented
- lane matching works against the approved lane map
- non-negotiables and risk flags surface correctly
- fit score and score-band routing produce stable outputs
- resume-direction output stays inside approved lane rules
- integrity rules prevent inflated claims

### Phase 3 — Analysis Review and Decision Save Flow
Complete when:
- one posting can move from intake to a visible `jobAnalysis`
- the review screen clearly shows verdict, proof, gaps, risk flags, lane, resume variant, and next action
- the user can save a record using approved tracker fields
- the save flow creates a valid `trackerRecord`
- the original analysis context remains attached to the saved record

### Phase 4 — Tracker Workflow Layer
Complete when:
- saved records appear in the tracker list
- tracker records can be filtered and sorted using approved fields
- a user can open one record in detail view
- the user can update workflow fields without rerunning analysis
- original fit logic remains visible or traceable in record context

### Phase 5 — MVP Hardening for Demo Use
Complete when:
- the full flow works end to end
- core rule modules have targeted unit coverage
- at least one smoke test covers Job Intake → Analysis Review → Decision + Save → Tracker / Weekly Review
- empty states and partial-data states behave safely
- the prototype remains clearly inside MVP scope

## Known Open Issues
Carry these issues forward visibly during scaffold work:
- **APW end date** is still month-normalized and should not be treated as exact-day accurate.
- **APW displayed title** is currently normalized to `Operations & Revenue Growth Manager`, with `Growth & Sales Manager` preserved as an alias.
- **Final first-push target lane order** is directionally strong but not fully locked.
- **Hard metrics / quantified proof** remain the biggest credibility gap in the current record.
- **Coaching-availability language** matters to life fit, but employer-facing wording is not finalized.
- **Job-separation explanation** still needs a standardized employer-facing version.
- **ATS-safe master resume** is not locked if the product later expands beyond direction-only guidance.
- **Implementation / enablement positioning** should stay carefully framed until stronger direct proof exists.

## Explicit Scope-Control Instructions
Codex must not build any of the following in this pass:
- multi-user accounts
- authentication or user settings
- resume upload or parsing
- automatic resume writing
- cover-letter writing
- LinkedIn rewrite tools
- browser automation or job scraping
- external job board integrations
- messaging or recruiter outreach systems
- dashboards beyond practical tracker review
- analytics suites or reporting centers
- marketplace or recruiting-platform features
- enterprise-grade infrastructure unrelated to demo readiness
- any screen not present in the approved blueprint
- any rule, fit claim, metric, or workflow not supported by the foundation pack and approved docs

When ambiguity appears, preserve it as an open issue or explicit TODO rather than silently resolving it.
