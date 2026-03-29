# 018_screen_blueprint.md

## Blueprint Intent
This blueprint translates the approved MVP PRD into a clean, screen-by-screen app structure for the current competition-ready prototype.

The blueprint stays inside the approved MVP scope:
- single-user
- one job posting at a time
- profile-driven analysis
- honest lane and resume-direction routing
- tracker save and weekly review

It does not add authentication, resume upload, auto-application, job scraping, advanced dashboards, or multi-user behavior.

## Primary Navigation Structure
The MVP can stay clean with two primary top-level routes and one supporting detail route:
1. **New Analysis**
2. **Tracker / Weekly Review**
3. **Tracker Record Detail** (opened from Tracker / Weekly Review)

The analysis flow itself is sequential:
1. Job Intake
2. Analysis Review
3. Decision + Save
4. Tracker / Weekly Review
5. Tracker Record Detail

---

## Screen 1 — Job Intake

### Purpose of the Screen
Capture one job posting in the normalized MVP input structure so the system can evaluate it against the canonical candidate profile and rule layers.

### Inputs
- company
- title
- location
- pay
- benefits
- schedule
- work mode
- responsibilities
- requirements
- tools
- domain
- leadership signals
- ambiguity signals
- source URL or identifier

### Outputs
- validated `jobPosting` input object
- normalized list fields ready for analysis
- partial-field handling where missing information remains unknown rather than invented

### Actions
- start a new posting analysis
- enter or paste posting details into structured fields
- normalize list-based fields into discrete entries
- clear or reset the form
- run analysis
- cancel and return to Tracker / Weekly Review

### Logic Dependencies
- uses the `jobPosting` input object from `04_analysis_schema.json`
- `title` is the core required field
- work mode must map to the supported enum: `remote | hybrid | onsite | unknown`
- analysis can proceed with partial data, but missing fields must remain unknown and increase ambiguity/gap exposure rather than being auto-filled
- no assumptions are allowed beyond what the posting actually states
- integrity rules must be active before analysis begins

### Data Objects Used
- Job Posting Input Object
- Candidate Profile
- Target Lane Map
- Fit Rules
- Workflow Rules
- Resume Direction Rules
- Integrity Rules

### What Happens Next in the Flow
If the posting is valid enough to analyze, the app moves to **Analysis Review**.

If the user stops before analysis, no tracker record is created.

---

## Screen 2 — Analysis Review

### Purpose of the Screen
Show the full structured analysis for one posting so the user can see fit quality, evidence strength, gaps, lane match, resume direction, and recommended next action before saving anything.

### Inputs
- analyzed `jobPosting` from Screen 1
- rule outputs from fit, workflow, resume-direction, and integrity layers

### Outputs
- `jobSnapshot`
- `nonNegotiablesCheck`
- `positiveSignals`
- `riskFlags`
- `fitVerdict`
- `strongestMatchingProof`
- `translationAreas`
- `gaps`
- `positioningStrategy`
- `resumeDirection`
- `resumeTailoringPriorities`
- `nextAction`

### Actions
- review the analysis
- go back and edit the posting
- continue to Decision + Save
- discard the current analysis

### Logic Dependencies
- uses the output contract from `04_analysis_schema.json`
- applies lane matching from `02_target_lanes.json`
- applies non-negotiables, preferred characteristics, caution flags, and red-flag logic from `03_fit_rules.json`
- applies fast-fit scoring and score-band routing from `05_workflow_rules.json`
- applies resume-variant routing from `05_workflow_rules.json` and `06_resume_direction_rules.json`
- applies evidence-level and anti-inflation constraints from `07_integrity_rules.json`
- unresolved ambiguity must surface as risk flags, unknowns, or gaps rather than being silently resolved

### Data Objects Used
- Job Posting Input Object
- Job Analysis Output Object
- Candidate Profile
- Target Lane Map
- Fit Rules
- Workflow Rules
- Resume Direction Rules
- Integrity Rules

### What Happens Next in the Flow
If the user accepts the analysis and wants to keep it, the app moves to **Decision + Save**.

If the user edits the posting, the flow returns to **Job Intake** and reruns analysis.

---

## Screen 3 — Decision + Save

### Purpose of the Screen
Convert the analysis into an explicit operating decision and save the role into the tracker using the MVP status model.

### Inputs
- recommended next action from analysis
- matched lane
- fit score
- fit verdict
- life-fit label
- recommended resume variant
- optional user notes
- optional follow-up date
- optional application date if the role has already been applied to
- optional networking status

### Outputs
- saved tracker record with required fields populated
- initial workflow status for the role
- persistent record ready for weekly review and later updating

### Actions
- accept the recommended next action
- set or confirm tracker status
- add notes
- set follow-up date
- set networking status
- mark as already applied if relevant
- save record
- save and go to Tracker / Weekly Review
- save and start another analysis

### Logic Dependencies
- required tracker fields come from `05_workflow_rules.json`
- status values must come from the approved status model in `05_workflow_rules.json`
- recommended next actions map cleanly into tracker behavior:
  - `apply` → typically `apply_now`
  - `apply_with_caution` → typically `apply_now` or a caution-noted save depending on user choice
  - `hold` → `hold_for_networking` or `hold_for_variant`
  - `pass` → `passed`
- `laneMatched`, `fitScore`, `fitVerdict`, `lifeFitLabel`, and `resumeVariant` should carry forward from the analysis output rather than being re-entered manually
- the save step must preserve honesty and original fit logic; it cannot override the evidence model
- a unique `jobId` must be created at save time

### Data Objects Used
- Job Analysis Output Object
- Workflow / Tracker Record
- Status Model

### What Happens Next in the Flow
After save, the user goes to **Tracker / Weekly Review** or starts a new pass at **Job Intake**.

---

## Screen 4 — Tracker / Weekly Review

### Purpose of the Screen
Provide the working list of all saved roles so the user can review decisions, manage follow-up, update progress, and maintain a realistic weekly operating rhythm.

### Inputs
- saved tracker records
- optional filters and sort choices based on MVP-safe tracker fields

### Outputs
- filtered or ordered list of saved roles
- visible status and follow-up state for each role
- clear weekly review queue for next actions

### Actions
- view all saved roles
- filter by application status
- filter by networking status
- filter by lane matched
- filter by resume variant
- filter by follow-up due or current stage
- sort by newest, fit score, or follow-up date
- open one record in detail view
- start a new analysis

### Logic Dependencies
- reads from the tracker fields defined in `05_workflow_rules.json`
- uses the ordered status model from `05_workflow_rules.json`
- should favor practical review behavior, not advanced analytics
- may show lightweight workflow signals such as follow-up due, recently saved, or interviewing, but must not expand into a dashboard suite
- should make it easy to see which roles are ready to act on this week

### Data Objects Used
- Workflow / Tracker Record

### What Happens Next in the Flow
The user either opens **Tracker Record Detail** for one role or returns to **Job Intake** to analyze another posting.

---

## Screen 5 — Tracker Record Detail

### Purpose of the Screen
Let the user inspect and update one saved role after the original analysis, especially for application progress, networking progress, follow-up timing, interview movement, and outcome tracking.

### Inputs
- selected tracker record
- editable tracker fields:
  - networking status
  - application status
  - application date
  - follow-up date
  - interview stage
  - outcome
  - notes

### Outputs
- updated tracker record
- preserved record history for continued weekly review
- clearer next-step state for the selected role

### Actions
- update networking status
- update application status
- set or change application date
- set or change follow-up date
- set interview stage
- mark outcome
- add or revise notes
- return to Tracker / Weekly Review
- jump to New Analysis

### Logic Dependencies
- editable fields must stay inside the approved tracker field list from `05_workflow_rules.json`
- status values must stay inside the approved application and networking status sets
- this screen updates workflow state only; it does not rerun fit analysis or rewrite resume direction from scratch
- if a role was originally saved as hold or pass, the user can still manually update later workflow fields, but the original fit logic should remain visible in the record context

### Data Objects Used
- Workflow / Tracker Record

### What Happens Next in the Flow
The user returns to **Tracker / Weekly Review** or starts a new role at **Job Intake**.

---

## Recommended MVP Screen Order
For the first build pass, the recommended implementation order is:
1. **Job Intake**
2. **Analysis Review**
3. **Decision + Save**
4. **Tracker / Weekly Review**
5. **Tracker Record Detail**

This order preserves the MVP core loop first, then adds the weekly review layer.

## Flow Summary
The clean MVP-only loop is:

**Job Intake → Analysis Review → Decision + Save → Tracker / Weekly Review → Tracker Record Detail (as needed) → back to Job Intake**

## Explicitly Excluded Screens
The following should not be added in this blueprint pass:
- sign in / sign up
- account settings
- resume upload
- cover letter generator
- LinkedIn rewrite tool
- analytics dashboard
- browser extension or job scraping interface
- multi-user admin views
- external integrations panel

## Next Recommended File
The next file on the Codex creation map is **019_agents.md**.

It should translate the approved PRD and this approved screen blueprint into repo-level build instructions, guardrails, and implementation behavior for the actual prototype build.
