# 019_agents.md

## Project Mission
Build Job Search OS as a single-user, competition-ready web app that helps one candidate evaluate one job posting at a time, route it to the right target lane and resume variant, make an honest apply / hold / pass decision, and save that result into a lightweight tracker for weekly review. The build must optimize for truth-discipline, fast decision quality, and clean MVP flow rather than feature breadth.

## Source of Truth
Use these sources in this order when building or modifying the app:

1. `07_integrity_rules.json` — cross-cutting truth, evidence, anti-inflation, title, and timeline constraints.
2. `017_mvp_prd.md` — canonical product-definition source for mission, scope, core loop, objects, and success criteria.
3. `018_screen_blueprint.md` — canonical screen, route, and flow-planning source.
4. `04_analysis_schema.json` — canonical input/output contract for job analysis.
5. `05_workflow_rules.json` — canonical scoring, routing, tracker fields, status model, and workflow behavior.
6. `03_fit_rules.json` — canonical fit logic, non-negotiables, caution flags, and evaluation framing.
7. `02_target_lanes.json` — canonical lane map and lane family structure.
8. `06_resume_direction_rules.json` — canonical resume-direction guidance and allowed emphasis rules.
9. `01_profile.json` — canonical single-user candidate record.
10. `09_open_issues.md` — canonical unresolved normalization items that must remain visible.
11. `08_copy_bank.json` — optional copy support only; never use it to create new logic.

How to use them together:
- Use the PRD to decide what the product is.
- Use the blueprint to decide how the product flows on screen.
- Use the JSON foundation files to decide how the product behaves.
- Use the integrity rules to veto any behavior that would inflate fit, invent evidence, or silently resolve ambiguity.
- If sources conflict, do not guess. Preserve the conflict as an open issue.

## MVP Scope Boundaries
The build must support only this MVP:
- one canonical candidate profile
- one posting analyzed at a time
- structured job intake
- rules-based analysis review
- explicit decision and save step
- tracker list for weekly review
- tracker record detail for workflow updates
- lightweight persistence of saved records

The build must not expand beyond the approved MVP. Do not add features that are not required to complete this loop. The app is not a general job board, not a multi-user SaaS platform, and not a resume-writing suite.

The required MVP screen order is:
1. Job Intake
2. Analysis Review
3. Decision + Save
4. Tracker / Weekly Review
5. Tracker Record Detail

## Core Product Loop
Enter one job posting → run rules-based analysis against the canonical profile and lane map → review fit, proof, gaps, and recommended resume direction → decide apply / hold / pass → save to tracker → review and update later in the weekly workflow.

## Stack Assumptions
Use a simple modern web stack optimized for fast scaffolding and demo readiness:
- **Framework:** Next.js with React
- **Language:** TypeScript in strict mode
- **Styling:** Tailwind CSS
- **Validation:** schema validation for intake and persisted objects
- **Persistence:** a small persistence layer behind a repository interface; start with local persistence suitable for a single-user MVP
- **Testing:** unit tests for rule logic and smoke tests for the core flow

Stack guidance:
- Prefer a simple client/server web app over unnecessary infrastructure.
- Keep persistence swappable so the tracker can move from local storage or file-backed data to a lightweight database later without rewriting domain logic.
- Do not introduce authentication, background jobs, third-party integrations, or external APIs in the first build pass unless explicitly added by an approved later file.

## Architecture Rules
1. **Separate UI, domain logic, and persistence.**
   - UI components render forms, results, and tracker views.
   - Domain logic performs normalization, analysis, routing, scoring, and status mapping.
   - Persistence reads and writes tracker records.

2. **Keep the rules engine pure.**
   - Analysis, fit evaluation, evidence handling, lane routing, score-band routing, and next-action recommendation should live in pure functions or isolated domain modules.
   - Do not bury business rules inside React components.

3. **Use explicit domain modules.**
   Recommended module boundaries:
   - candidate profile loader
   - target lane resolver
   - fit evaluation layer
   - integrity guard layer
   - analysis assembler
   - workflow / tracker service
   - persistence adapter

4. **Treat analysis output as a structured contract.**
   - Intake produces a normalized `jobPosting` object.
   - Analysis produces the approved output object.
   - Save produces a tracker record.
   - Tracker updates modify workflow state only; they do not rerun analysis unless the user starts a new analysis pass.

5. **Preserve original analysis context after save.**
   - The saved record should retain the key analysis context needed for later review.
   - Updating notes, follow-up dates, or statuses must not overwrite the original fit logic.

6. **Keep routing shallow and clean.**
   - Support the two primary top-level routes from the blueprint: `New Analysis` and `Tracker / Weekly Review`.
   - Support `Tracker Record Detail` as a detail route opened from the tracker.

7. **Build for extension without building extensions now.**
   - Keep the architecture modular enough to add future resume drafting or richer analytics later.
   - Do not scaffold those future features into the current MVP.

## Data and Rule Sources
Map product behavior to source files as follows:

| Behavior / Concern | Governing Source |
|---|---|
| Product mission, scope, core objects, success criteria | `017_mvp_prd.md` |
| Screen flow, route structure, screen purpose, screen actions | `018_screen_blueprint.md` |
| Job intake object and analysis output contract | `04_analysis_schema.json` |
| Canonical candidate facts, skills, tools, role history, preferences | `01_profile.json` |
| Lane families and lane matching structure | `02_target_lanes.json` |
| Non-negotiables, preferred characteristics, caution flags, red-flag logic | `03_fit_rules.json` |
| Fast-fit scoring, score bands, decision routing, tracker fields, status model | `05_workflow_rules.json` |
| Resume variant routing, emphasis, de-emphasis, allowed tool claims | `06_resume_direction_rules.json` |
| Evidence levels, gap handling, anti-inflation rules, title/date discipline | `07_integrity_rules.json` |
| Unresolved normalization items that must stay visible | `09_open_issues.md` |
| Optional microcopy polish only | `08_copy_bank.json` |

When implementing a behavior, tie it back to one of these sources explicitly. If no source supports it, do not build it.

## Coding Standards
- Write readable, modular TypeScript.
- Prefer small focused functions over large multi-purpose handlers.
- Use descriptive names that reflect domain intent.
- Validate all structured inputs and persisted objects.
- Fail safely and visibly; do not silently coerce unsupported values into confident outputs.
- Keep comments for non-obvious business rules, integrity constraints, or implementation tradeoffs.
- Avoid speculative abstractions. Only abstract when repetition or domain clarity justifies it.
- Keep components lean; move transformation, scoring, and routing logic out of presentation code.
- Preserve strict typing across domain objects, status values, and analysis output shapes.
- Handle unknown and missing values explicitly.

## Naming Conventions
- Use **kebab-case** for route segments, folders, and non-component file names.
- Use **PascalCase** for React components and TypeScript types.
- Use **camelCase** for functions, variables, hooks, and object properties.
- Keep domain module names concrete, such as:
  - `job-posting-normalizer`
  - `fit-evaluator`
  - `integrity-guard`
  - `resume-variant-router`
  - `tracker-repository`
- Keep object names aligned to the approved product language:
  - `candidateProfile`
  - `jobPosting`
  - `jobAnalysis`
  - `trackerRecord`
- Keep status values exactly aligned to the approved status model; do not rename them for stylistic reasons.
- Preserve approved artifact filenames exactly:
  - `017_mvp_prd.md`
  - `018_screen_blueprint.md`
  - `019_agents.md`

## Truth and Integrity Constraints
These constraints are mandatory across the entire repo:
- Do not invent qualifications, metrics, tools, titles, benefits, or achievements.
- Do not overstate fit.
- Do not convert adjacent exposure into confirmed proficiency.
- Do not force weak parallels just to make a role look viable.
- Separate confirmed facts from inference.
- Mark missing evidence as a gap.
- If a posting fails key non-negotiables, surface that clearly.
- Use only confirmed, resume-safe tools in resume-direction outputs.
- Every major output should remain interview-defensible.
- Preserve APW title and timeline discipline exactly as defined in `07_integrity_rules.json` and `09_open_issues.md`.
- If a role requests unsupported analyst, technical, enterprise, or implementation depth, lower fit rather than softening the gap.
- Unknown posting fields must remain unknown; they are not permission to infer favorable facts.

## UI and UX Rules
- Keep the interface minimal, practical, and decision-support oriented.
- Optimize for a clean laptop demo and everyday weekly use.
- Show the user exactly what matters for a decision:
  - fit verdict
  - life-fit label
  - lane matched
  - strongest proof
  - gaps
  - risk flags
  - recommended resume variant
  - next action
- Make unknowns, ambiguity, and missing evidence visible rather than hiding them.
- Avoid decorative dashboards, vanity charts, or feature-heavy navigation.
- Use simple progressive flow: intake first, then review, then save.
- Keep tracker views operational, not analytical.
- Record detail should update workflow state only; it should not behave like a second analysis screen.
- Use consistent language across screens so the same concepts do not get renamed in different places.

## What Not to Build Yet
Do not build any of the following unless a later approved file explicitly adds them:
- authentication
- multi-user support
- team collaboration
- resume upload or parsing
- automatic resume generation
- cover-letter generation
- LinkedIn rewrite tooling
- browser extension behavior
- job scraping
- external job board integrations
- messaging systems
- recruiter marketplace features
- analytics dashboard suite
- AI chat interface unrelated to the approved analysis flow
- advanced enterprise RevOps or BI recommendation logic
- account settings, billing, or admin panels

## Testing Expectations
Testing should be pragmatic and centered on the MVP loop.

Minimum expectations:
- unit-test pure rule logic for:
  - lane matching
  - evidence-level handling
  - fit scoring and score-band routing
  - next-action mapping
  - status mapping into tracker records
- validate intake object normalization and required-field handling
- validate analysis output shape against the approved schema
- test that unknown values remain unknown instead of being auto-filled
- test tracker save behavior and tracker record updates
- include at least one smoke test for the main flow:
  - Job Intake → Analysis Review → Decision + Save → Tracker / Weekly Review
- include at least one smoke test for opening and updating Tracker Record Detail

Do not overbuild the test suite before the MVP loop is stable, but do not skip tests on the core domain rules.

## Output Discipline
When generating build work inside this repo:
- produce concrete files, not vague implementation notes
- keep work aligned to the current approved source hierarchy
- state any unavoidable assumption explicitly and tie it to the closest governing source
- if a requested change exceeds MVP scope, say so and keep it out of the build
- preserve open issues as open issues; do not silently normalize them away
- prefer complete, coherent file outputs over pseudo-code fragments
- keep demo data controlled and source-aligned
- do not fabricate example metrics or achievements to make the UI look stronger
- when adding a new module or screen, ensure its purpose can be traced back to the PRD or blueprint
- when blocked by ambiguity, leave a clearly labeled placeholder or TODO tied to the open issue rather than guessing

## Known Open Issues
Keep these visible during the build:
- **APW end date** is month-normalized and not exact-day accurate yet.
- **APW displayed title** is currently normalized to `Operations & Revenue Growth Manager`, with `Growth & Sales Manager` preserved as an alias.
- **Final first-push target lane order** is directionally strong but not fully locked.
- **Hard metrics / quantified proof** remain the biggest credibility gap in the current record.
- **Coaching-availability language** is internally important, but the exact employer-facing phrasing is not finalized.
- **Job-separation explanation** needs a clean standardized employer-facing version.
- **ATS-safe master resume** is not yet locked if the product later expands into drafting.
- **Implementation / enablement positioning** should remain careful until more direct proof exists.
