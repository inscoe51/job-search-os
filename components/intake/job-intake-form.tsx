"use client";

import {
  useEffect,
  useMemo,
  useState,
  startTransition,
  type FormEvent,
  type ReactNode
} from "react";
import { useRouter } from "next/navigation";

import { analyzeJobPosting } from "@/lib/analysis/analyze-job-posting";
import { type DemoScenarioId } from "@/lib/demo/sample-job-posting";
import { createBrowserAnalysisSessionRepository } from "@/lib/repository/browser-analysis-session-repository";
import type { JobPosting } from "@/lib/validation/schemas";
import { jobPostingSchema } from "@/lib/validation/schemas";
import { normalizeOptionalText, parseListInput } from "@/lib/utils/text";

type IntakeFormState = {
  company: string;
  title: string;
  location: string;
  pay: string;
  benefits: string;
  schedule: string;
  workMode: JobPosting["workMode"];
  responsibilities: string;
  requirements: string;
  tools: string;
  domain: string;
  leadershipSignals: string;
  ambiguitySignals: string;
  sourceUrlOrIdentifier: string;
};

function toFormState(posting: JobPosting): IntakeFormState {
  return {
    company: posting.company ?? "",
    title: posting.title,
    location: posting.location ?? "",
    pay: posting.pay ?? "",
    benefits: posting.benefits ?? "",
    schedule: posting.schedule ?? "",
    workMode: posting.workMode,
    responsibilities: posting.responsibilities.join("\n"),
    requirements: posting.requirements.join("\n"),
    tools: posting.tools.join("\n"),
    domain: posting.domain ?? "",
    leadershipSignals: posting.leadershipSignals.join("\n"),
    ambiguitySignals: posting.ambiguitySignals.join("\n"),
    sourceUrlOrIdentifier: posting.sourceUrlOrIdentifier ?? ""
  };
}

const emptyState = toFormState({
  company: null,
  title: "",
  location: null,
  pay: null,
  benefits: null,
  schedule: null,
  workMode: "unknown",
  responsibilities: [],
  requirements: [],
  tools: [],
  domain: null,
  leadershipSignals: [],
  ambiguitySignals: [],
  sourceUrlOrIdentifier: null
});

export function buildJobPostingFromFormState(
  formState: IntakeFormState
): JobPosting {
  return jobPostingSchema.parse({
    company: normalizeOptionalText(formState.company),
    title: formState.title.trim(),
    location: normalizeOptionalText(formState.location),
    pay: normalizeOptionalText(formState.pay),
    benefits: normalizeOptionalText(formState.benefits),
    schedule: normalizeOptionalText(formState.schedule),
    workMode: formState.workMode,
    responsibilities: parseListInput(formState.responsibilities),
    requirements: parseListInput(formState.requirements),
    tools: parseListInput(formState.tools),
    domain: normalizeOptionalText(formState.domain),
    leadershipSignals: parseListInput(formState.leadershipSignals),
    ambiguitySignals: parseListInput(formState.ambiguitySignals),
    sourceUrlOrIdentifier: normalizeOptionalText(formState.sourceUrlOrIdentifier)
  });
}

type JobIntakeFormProps = {
  seededPosting?: JobPosting | null;
  selectedScenarioId?: DemoScenarioId | null;
};

export function JobIntakeForm({
  seededPosting = null,
  selectedScenarioId = null
}: JobIntakeFormProps) {
  const router = useRouter();
  const sessionRepository = useMemo(
    () => createBrowserAnalysisSessionRepository(),
    []
  );
  const [formState, setFormState] = useState<IntakeFormState>(emptyState);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof IntakeFormState>(
    key: K,
    value: IntakeFormState[K]
  ) {
    setFormState((current) => ({
      ...current,
      [key]: value
    }));
  }

  function resetForm() {
    setFormState(emptyState);
    setError(null);
  }

  useEffect(() => {
    if (!seededPosting) {
      setFormState(emptyState);
      setError(null);
      return;
    }

    setFormState(toFormState(seededPosting));
    setError(null);
  }, [seededPosting]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const jobPosting = buildJobPostingFromFormState(formState);
      const { session } = analyzeJobPosting(jobPosting);

      sessionRepository.save(session);
      setError(null);
      startTransition(() => {
        router.push(`/analysis/${session.sessionId}`);
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The posting could not be normalized for analysis."
      );
    }
  }

  return (
    <div className="space-y-4" id="job-intake-section">
      <form
        onSubmit={handleSubmit}
        className="app-panel space-y-5 border-emerald-200/70 bg-[linear-gradient(180deg,rgba(252,252,245,0.98),rgba(250,248,242,0.96)_54%,rgba(240,248,246,0.94))] p-6 shadow-sm sm:p-7"
      >
        <div className="space-y-3 rounded-[26px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(236,253,245,0.74),rgba(255,251,245,0.92)_52%,rgba(239,248,255,0.78))] px-5 py-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_10px_24px_rgba(15,23,42,0.04)] sm:px-6">
          <p className="app-kicker">Job Intake</p>
          <h2 className="text-2xl font-semibold text-ink">
            {selectedScenarioId ? "Review the demo job posting" : "Structured posting input"}
          </h2>
          <p className="app-copy">
            {selectedScenarioId
              ? "The selected scenario has loaded these visible posting fields below."
              : "Enter one posting in structured form. Partial data is allowed, but unknown fields stay unknown."}
          </p>
        </div>

        <section
          className="app-form-section group relative overflow-hidden border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(249,247,240,0.92))] shadow-sm"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-300/90 via-emerald-300/90 to-transparent" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="app-kicker">Core Posting Details</p>
              <p className="text-sm leading-6 text-ink/72">
                Start with the main facts so the review begins with the clearest picture of the job.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company">
                <input
                  value={formState.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  className="app-input"
                />
              </Field>
              <Field label="Title" required>
                <input
                  value={formState.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="app-input"
                  required
                />
              </Field>
              <Field label="Location">
                <input
                  value={formState.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  className="app-input"
                />
              </Field>
              <Field label="Work Mode">
                <select
                  value={formState.workMode}
                  onChange={(event) =>
                    updateField("workMode", event.target.value as JobPosting["workMode"])
                  }
                  className="app-input"
                >
                  <option value="unknown">Unknown</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
              </Field>
              <Field label="Pay">
                <input
                  value={formState.pay}
                  onChange={(event) => updateField("pay", event.target.value)}
                  className="app-input"
                />
              </Field>
              <Field label="Benefits">
                <input
                  value={formState.benefits}
                  onChange={(event) => updateField("benefits", event.target.value)}
                  className="app-input"
                />
              </Field>
            </div>

            <Field label="Schedule">
              <textarea
                value={formState.schedule}
                onChange={(event) => updateField("schedule", event.target.value)}
                rows={3}
                className="app-input"
              />
            </Field>
          </div>
        </section>

        <details
          className="app-form-section group relative overflow-hidden border-sky-200/80 bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(249,247,240,0.92))] shadow-sm"
          open={false}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-300/90 via-sky-300/90 to-transparent" />
          <summary className="cursor-pointer list-none">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="app-kicker">What The Job Asks For</p>
                <p className="text-sm leading-6 text-ink/72">
                  Use one item per line so each responsibility, requirement, or tool stays easy to review.
                </p>
              </div>
              <span className="app-disclosure-toggle">
                <span className="inline group-open:hidden">EXPAND HERE</span>
                <span className="hidden group-open:inline">COLLAPSE SECTION</span>
              </span>
            </div>
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Responsibilities">
              <textarea
                value={formState.responsibilities}
                onChange={(event) =>
                  updateField("responsibilities", event.target.value)
                }
                rows={7}
                className="app-input"
              />
            </Field>
            <Field label="Requirements">
              <textarea
                value={formState.requirements}
                onChange={(event) => updateField("requirements", event.target.value)}
                rows={7}
                className="app-input"
              />
            </Field>
            <Field label="Tools">
              <textarea
                value={formState.tools}
                onChange={(event) => updateField("tools", event.target.value)}
                rows={5}
                className="app-input"
              />
            </Field>
            <Field label="Leadership Signals">
              <textarea
                value={formState.leadershipSignals}
                onChange={(event) =>
                  updateField("leadershipSignals", event.target.value)
                }
                rows={5}
                className="app-input"
              />
            </Field>
          </div>
        </details>

        <details
          className="app-form-section group relative overflow-hidden border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(249,247,240,0.92))] shadow-sm"
          open={false}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-300/90 via-emerald-300/90 to-transparent" />
          <summary className="cursor-pointer list-none">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="app-kicker">Optional Details</p>
                <p className="text-sm leading-6 text-ink/72">
                  Add extra notes only if they help explain the job or what is still unclear.
                </p>
              </div>
              <span className="app-disclosure-toggle">
                <span className="inline group-open:hidden">EXPAND HERE</span>
                <span className="hidden group-open:inline">COLLAPSE SECTION</span>
              </span>
            </div>
          </summary>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Unclear or missing details" hint="One item per line">
                <textarea
                  value={formState.ambiguitySignals}
                  onChange={(event) =>
                    updateField("ambiguitySignals", event.target.value)
                  }
                  rows={5}
                  className="app-input"
                />
              </Field>
              <Field label="Industry or team context">
                <textarea
                  value={formState.domain}
                  onChange={(event) => updateField("domain", event.target.value)}
                  rows={5}
                  className="app-input"
                />
              </Field>
            </div>

            <Field label="Source link or note">
              <input
                value={formState.sourceUrlOrIdentifier}
                onChange={(event) =>
                  updateField("sourceUrlOrIdentifier", event.target.value)
                }
                className="app-input"
              />
            </Field>
          </div>
        </details>

        {error ? (
          <p className="rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="app-button-primary"
          >
            Review this job
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="app-button-secondary"
          >
            Reset
          </button>
        </div>
        <p className="text-sm leading-6 text-ink/66">
          For the smoothest demo, keep the recommended example as-is, review the result, then save it to the tracker.
        </p>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
};

function Field({ label, children, hint, required }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="app-label">
        {label}
        {required ? " *" : ""}
      </span>
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
      {children}
    </label>
  );
}

