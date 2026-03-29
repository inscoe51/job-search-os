# 022_first_build_prompt.md

## Prompt to Give Codex
Use only the approved source files already in the repo for this build pass:

- `data/foundation/01_profile.json`
- `data/foundation/02_target_lanes.json`
- `data/foundation/03_fit_rules.json`
- `data/foundation/04_analysis_schema.json`
- `data/foundation/05_workflow_rules.json`
- `data/foundation/06_resume_direction_rules.json`
- `data/foundation/07_integrity_rules.json`
- `data/foundation/09_open_issues.md`
- `docs/017_mvp_prd.md`
- `docs/018_screen_blueprint.md`
- `docs/019_agents.md`
- `docs/020_codex_build_brief.md`
- `docs/021_mvp_scaffold_plan.md`

Do not use any other assumptions as product truth. If something is unclear, preserve the ambiguity in comments or TODO notes instead of inventing behavior.

Your task is to scaffold the **first-pass MVP only** for Job Search OS.

## Build Goal
Create a clean, working scaffold for the approved core loop only:
1. enter one job posting
2. run rules-based analysis from approved source files
3. review the analysis output
4. save the role into the tracker
5. review saved records in the tracker

This is a **logic-first scaffold pass**, not a production build.

## Additional Pre-Scaffold Constraints
Before scaffolding, apply all of the following constraints:
- make `app/page.tsx` redirect to `/new-analysis`
- use a single typed `AnalysisSession` object across intake, review, decision, and save flow
- centralize tracker statuses as an explicit typed enum or model used everywhere tracker state is referenced
- include one seeded sample job posting fixture for smoke testing and demo use

## Required Stack
- Next.js App Router
- React
- TypeScript in strict mode
- Tailwind CSS
- schema validation for key objects
- local single-user persistence behind a repository interface
- test scaffolding for unit tests and one smoke path

## Implementation Priorities
Implement in this order:
1. repo structure
2. foundation data loaders and typed domain models
3. shared `AnalysisSession` model and tracker status enum/model
4. job posting validation and normalization
5. seeded sample job posting fixture
6. rules engine modules
7. analysis assembly
8. core screens
9. tracker repository and tracker views
10. basic test scaffolding

## Required Repo Structure
Create the scaffold using this structure or a very close equivalent:

```text
app/
  page.tsx
  layout.tsx
  new-analysis/page.tsx
  analysis/[sessionId]/page.tsx
  tracker/page.tsx
  tracker/[jobId]/page.tsx
components/
  intake/
  analysis/
  decision/
  tracker/
  shared/
lib/
  domain/
  analysis/
  tracker/
  validation/
  repository/
  utils/
data/
  foundation/
  fixtures/
docs/
tests/
```

## Domain Model Constraints
- Define a single typed `AnalysisSession` domain object that carries intake input, normalized job data, rules outputs, review state, decision payload, and save-ready tracker payload between screens.
- Do not duplicate intake, review, and save-flow state into separate incompatible objects.
- Define tracker statuses in one central typed enum or status model and consume that shared model in domain logic, repository logic, and UI rendering.
- Keep seeded fixture data separate from foundation truth files.

## Logic-First Rules
- Keep rules logic in isolated modules, not inside UI components.
- Keep analysis output aligned to `04_analysis_schema.json`.
- Keep tracker records aligned to `05_workflow_rules.json`.
- Use `07_integrity_rules.json` to block inflated or invented outputs.
- Use lane resolution and resume routing only from approved rules files.
- Preserve unknowns as unknowns.
- Treat open issues as unresolved.

## Screens to Scaffold
Scaffold only these MVP screens:
1. New Analysis / Job Intake
2. Analysis Review
3. Decision + Save
4. Tracker / Weekly Review
5. Tracker Record Detail

Do not add extra screens, onboarding, settings, dashboards, auth pages, or profile editors.

## UI Constraints
- Keep the interface minimal and decision-support oriented.
- Prefer clean cards, tables, and simple forms.
- Make the analysis readable before making it visually elaborate.
- Do not add marketing copy, decorative polish, or non-MVP navigation.
- Keep top-level navigation limited to `New Analysis` and `Tracker`.
- Make the seeded sample job fixture easy to load for demo or smoke testing without adding extra product surface area.

## Explicit Non-Goals
Do **not** build any of the following in this pass:
- authentication
- multi-user support
- resume upload or parsing
- resume generation
- cover-letter generation
- LinkedIn rewrite flows
- job scraping or browser automation
- messaging systems
- advanced analytics dashboards
- external integrations
- background jobs
- speculative future features

## Required Output Order
Return your work in this order:
1. short summary of what you scaffolded
2. repo tree of created or modified files
3. key domain modules and what each does
4. routes/screens scaffolded
5. persistence approach used for the first pass
6. seeded fixture included for smoke/demo use
7. tests scaffolded
8. remaining work needed for the next pass

## Stopping Rule
Stop after the first-pass scaffold is complete.

Do not continue into broader feature work, production hardening, or second-pass polish. If something belongs to a later phase, leave a brief TODO note and stop.

## Quality Bar
- The scaffold should compile cleanly.
- Core object boundaries should be explicit.
- `app/page.tsx` should redirect cleanly to `/new-analysis`.
- The `AnalysisSession` object should be the single typed flow object across intake, review, and save.
- Tracker statuses should come from one central typed enum or model.
- The seeded sample job posting fixture should be usable for smoke testing and demo flow.
- Domain logic should be modular and readable.
- The app should support the approved MVP loop end to end at a basic level.
- Unsupported scope must remain excluded.
