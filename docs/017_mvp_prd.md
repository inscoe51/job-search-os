# 017_mvp_prd.md

## Product Purpose
Job Search OS is a single-user, profile-driven job evaluation tool that helps the candidate decide which jobs to pursue, how to position them honestly, and how to track the next step without wasting time on weak-fit roles.

The MVP exists to turn a raw job posting into a disciplined apply / hold / pass decision, matched lane, resume-direction recommendation, and tracker-ready record.

## Target User
The primary user is the current candidate represented in the foundation pack.

This MVP is effectively single-user for now. It is built around one canonical candidate profile, one set of target lanes, one truth-discipline layer, and one application workflow. It is not a general-purpose job platform, recruiting marketplace, or multi-user resume product.

The user profile is centered on:
- operations-oriented bridge-role search
- remote-preferred or locally hybrid roles
- stable compensation and benefits
- compatibility with long-term football coaching commitments
- evidence-first positioning without inflated claims

## Core Problem Solved
The MVP reduces a specific operational problem: the user needs a repeatable way to evaluate job postings against real experience, life-fit constraints, and target lanes without drifting into weak-fit applications, inflated positioning, or inconsistent resume choices.

Without this system, job search effort becomes noisy, reactive, and hard to review. The MVP creates a disciplined filter and decision loop.

## MVP Promise
For one job posting at a time, the MVP gives the user an honest, structured answer to:
- what kind of role this is
- how well it fits the current profile
- what proof supports the fit
- what gaps or risk flags exist
- which lane and resume variant to use
- whether to apply now, hold, or pass
- what should be saved into the tracker for later review

## Core Loop
1. Enter one job posting in structured form.
2. Compare the posting against the canonical candidate profile, target lanes, fit rules, workflow rules, resume-direction rules, and integrity rules.
3. Produce a fit verdict, life-fit label, strongest proof, translation areas, gaps, risk flags, recommended lane, and recommended resume variant.
4. Decide the next action: apply, apply with caution, hold, or pass.
5. Save the result into the tracker with status, notes, and follow-up fields.
6. Revisit saved records in a simple weekly review rhythm to see what is moving, what is stalling, and which resume variants or outreach paths are producing traction.

## In-Scope Features
### Input
- Single job posting intake using the normalized jobPosting object:
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

### Analysis
- One-posting-at-a-time analysis using the normalized output contract
- Lane matching against primary, secondary, adjacent, and stretch lanes
- Fast fit scoring based on the proposed MVP scoring model
- Non-negotiables check
- Positive signal and risk-flag identification
- Proof-strength handling using confirmed, strong inference, possible / needs verification, and missing evidence levels
- Gap detection across tools, domain, metrics, scope, title, schedule, compensation, benefits, and other

### Decision
- Fit verdict with rating and life-fit label
- Positioning strategy tied to a recommended lane
- Resume-direction output including recommended variant, emphasis, de-emphasis, and allowed tool claims
- Next-action recommendation:
  - apply
  - apply with caution
  - hold
  - pass
- Pre-apply requirement capture when a role is not yet ready for immediate application

### Tracking
- Save analyzed roles into a tracker using the required tracker fields:
  - jobId
  - source
  - company
  - title
  - laneMatched
  - fitScore
  - fitVerdict
  - lifeFitLabel
  - resumeVariant
  - networkingStatus
  - applicationStatus
  - applicationDate
  - followUpDate
  - interviewStage
  - outcome
  - notes
- Use simple ordered statuses for application tracking and networking tracking
- Support later weekly review of saved decisions and outcomes

## Out-of-Scope Features
- Multi-user accounts or team collaboration
- Authentication or user-management systems
- Resume upload or resume parsing as an MVP requirement
- Automatic resume writing, final cover-letter writing, or LinkedIn rewriting
- Advanced dashboards or analytics suites
- Recruiting marketplace functionality
- Job scraping, browser automation, or external integrations not defined in the foundation pack
- Deep enterprise RevOps, advanced BI, SQL-heavy, or analyst-grade recommendation logic
- Expanded coaching, teaching, or life-planning modules outside job-fit evaluation
- Any feature that invents qualifications, metrics, tools, or fit strength not supported by the canonical record

## Primary Objects / Data Models
### 1. Candidate Profile
Canonical single-user record containing target strategy, work preferences, education, role history, confirmed skills, confirmed tools, value themes, differentiators, achievement highlights, copy signals, and open normalization risks.

### 2. Target Lane Map
Normalized lane structure that defines:
- primary lanes
- secondary lanes
- adjacent lanes
- stretch / caution lanes
- the resume-direction family associated with each lane

### 3. Fit Rules
Top-level life-fit and job-fit logic, including:
- non-negotiables
- preferred characteristics
- positive signals
- caution flags
- evaluation categories
- rating scale
- decision heuristics

### 4. Job Posting Input Object
The structured representation of one job posting to analyze.

### 5. Job Analysis Output Object
The normalized output for one analyzed posting, including:
- job snapshot
- non-negotiables check
- positive signals
- risk flags
- fit verdict
- strongest matching proof
- translation areas
- gaps
- positioning strategy
- resume direction
- resume-tailoring priorities
- next action

### 6. Workflow / Tracker Record
The saved record of one analyzed role, used to manage application progress, follow-up, networking status, and outcome review.

### 7. Resume Direction Rules
Support-layer object that maps lanes to safe positioning emphasis, de-emphasis, summary focus, and allowed tool claims without turning the MVP into a full resume writer.

### 8. Integrity Rules
Cross-cutting rule layer that governs evidence levels, anti-inflation behavior, gap handling, and title/date discipline across the whole MVP.

## Decision Rules
- Only treat the foundation pack as the source of truth.
- Only recommend roles that are realistically supported by the current candidate record.
- Prefer primary lanes first, then strong secondary lanes, then adjacent lanes used carefully.
- Do not convert weak overlap into strong-fit language.
- Do not invent compensation, benefits, flexibility, metrics, tools, titles, or achievements.
- Use confirmed evidence first. Strong inference may support positioning, but not act as direct proof. Missing evidence must stay marked as a gap.
- Apply when the role matches a primary or strong secondary lane, clears key non-negotiables, lands in the apply band, and remains resume-defensible.
- Hold when the role may work but needs stronger evidence, a better variant, or networking before applying.
- Reject when the role is low fit, inflation-heavy, unstable, badly structured, or clearly incompatible with compensation, benefits, or coaching constraints.
- Route resume direction from the matched lane rather than rewriting strategy from scratch each time.
- Save every analyzed role into the tracker with ordered statuses so the user can review patterns later.
- Preserve unresolved source ambiguity as open issues instead of silently normalizing it away.

## Success Criteria
The MVP is successful when it can reliably do all of the following:
- analyze one job posting at a time using the normalized input and output contract
- return an honest fit verdict grounded in the canonical profile and rules
- identify the matched lane, recommended resume variant, strongest proof, main gaps, and next action
- prevent obvious scope drift into unsupported analyst, enterprise, or inflated-fit roles
- capture each analyzed role in a tracker-ready structure with usable statuses
- support a realistic weekly operating rhythm for review and iteration
- remain concise enough to serve as the direct source for the screen blueprint and subsequent build-prep documents

## Build Phases
### Phase 1: Source-of-Truth Lock
Use the foundation pack as the canonical base and keep unresolved normalization items visible.

### Phase 2: Core Loop Definition
Lock the MVP around one-posting intake, analysis, decision, and tracker-save behavior.

### Phase 3: Output and Tracking Definition
Finalize the exact output object, scoring/decision logic, status model, and required tracker fields.

### Phase 4: Screen Planning
Translate the PRD into a screen-by-screen blueprint for the competition-ready prototype.

### Phase 5: Build Preparation
Translate the approved PRD and screen blueprint into repo-level build instructions and a Codex build brief.

## Known Open Issues
- APW end date remains month-normalized and should not be treated as day-accurate until verified.
- APW master displayed title still needs final lock, with “Operations & Revenue Growth Manager” currently normalized and “Growth & Sales Manager” preserved as an alias.
- The final first-push ordering of the top target lanes is directionally strong but not fully locked.
- Hard metrics remain the biggest credibility gap, especially around revenue influenced, close rate, bookings, time saved, jobs coordinated, and related quantified proof.
- Coaching-availability language can be enforced internally, but employer-facing wording still needs finalization.
- Job-separation explanation for March 2026 still needs a clean standardized version.
- A single ATS-safe master resume is not yet finalized.
- Implementation / enablement positioning should remain careful until stronger direct proof is added.
