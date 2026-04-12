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
import type { DemoScenarioId } from "@/lib/demo/sample-job-posting";
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

const scenarioLabelById: Record<DemoScenarioId, string> = {
  "strong-fit-example": "Strong Fit Example",
  "borderline-workable-fit-example": "Borderline / Workable Fit Example",
  "poor-fit-pass-example": "Poor Fit / Pass Example"
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <form
        onSubmit={handleSubmit}
        className="app-panel space-y-6 p-6 sm:p-7"
      >
        <div className="space-y-3">
          <p className="app-kicker">Job Intake</p>
          <h2 className="text-2xl font-semibold text-ink">Structured posting input</h2>
          <p className="app-copy">
            Enter one posting in structured form. Partial data is allowed, but
            unknown fields stay unknown.
          </p>
          {selectedScenarioId ? (
            <div className="app-callout">
              <p className="app-mini-label">Active Seed</p>
              <p className="mt-2 text-sm leading-6 text-ink/80">
                Loaded from Demo Guide: {scenarioLabelById[selectedScenarioId]}
              </p>
            </div>
          ) : null}
        </div>

        <section className="app-form-section space-y-4">
          <div className="space-y-1">
            <p className="app-kicker">Core Posting Details</p>
            <p className="text-sm leading-6 text-ink/72">
              Capture the highest-signal role facts first so the first-pass analysis starts with the right frame.
            </p>
          </div>
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
        </section>

        <section className="app-form-section space-y-4">
          <div className="space-y-1">
            <p className="app-kicker">Role Requirements And Execution</p>
            <p className="text-sm leading-6 text-ink/72">
              Use one item per line to preserve the exact language the engine will analyze.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Responsibilities" hint="One item per line">
              <textarea
                value={formState.responsibilities}
                onChange={(event) =>
                  updateField("responsibilities", event.target.value)
                }
                rows={7}
                className="app-input"
              />
            </Field>
            <Field label="Requirements" hint="One item per line">
              <textarea
                value={formState.requirements}
                onChange={(event) => updateField("requirements", event.target.value)}
                rows={7}
                className="app-input"
              />
            </Field>
            <Field label="Tools" hint="One item per line">
              <textarea
                value={formState.tools}
                onChange={(event) => updateField("tools", event.target.value)}
                rows={5}
                className="app-input"
              />
            </Field>
            <Field label="Leadership Signals" hint="One item per line">
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
        </section>

        <section className="app-form-section space-y-4">
          <div className="space-y-1">
            <p className="app-kicker">Context And Provenance</p>
            <p className="text-sm leading-6 text-ink/72">
              Keep ambiguity visible instead of smoothing it away.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ambiguity Signals" hint="One item per line">
              <textarea
                value={formState.ambiguitySignals}
                onChange={(event) =>
                  updateField("ambiguitySignals", event.target.value)
                }
                rows={5}
                className="app-input"
              />
            </Field>
            <Field label="Domain / Context">
              <textarea
                value={formState.domain}
                onChange={(event) => updateField("domain", event.target.value)}
                rows={5}
                className="app-input"
              />
            </Field>
          </div>

          <Field label="Source URL or Identifier">
            <input
              value={formState.sourceUrlOrIdentifier}
              onChange={(event) =>
                updateField("sourceUrlOrIdentifier", event.target.value)
              }
              className="app-input"
            />
          </Field>
        </section>

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
            Run first-pass analysis
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="app-button-secondary"
          >
            Reset
          </button>
        </div>
      </form>

      <aside className="app-accent-panel space-y-5 p-6 sm:p-7 lg:sticky lg:top-6">
        <div>
          <p className="app-kicker">Intake Notes</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">The live engine stays unchanged</h3>
          <p className="mt-3 text-sm leading-6 text-ink/74">
            This screen is polished for demo presentation, but the guardrails and downstream session flow stay exactly the same.
          </p>
        </div>
        <ul className="space-y-3 text-sm leading-6 text-ink/75">
          <li className="app-card px-4 py-3">Only the approved profile and rule files drive the analysis.</li>
          <li className="app-card px-4 py-3">Unknown posting fields stay unresolved instead of being invented.</li>
          <li className="app-card px-4 py-3">Seeded demo scenarios populate this exact form and still run through the same validation, routing, and saved-session flow.</li>
          <li className="app-card px-4 py-3">
            Open issues like APW title/date precision and hard metrics remain visible
            as unresolved credibility constraints.
          </li>
        </ul>
      </aside>
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
