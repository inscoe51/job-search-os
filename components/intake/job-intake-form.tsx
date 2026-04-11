"use client";

import { useMemo, useState, startTransition, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { analyzeJobPosting } from "@/lib/analysis/analyze-job-posting";
import { loadSampleJobPostingFixture } from "@/lib/demo/sample-job-posting";
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

export function JobIntakeForm() {
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

  function loadSampleFixture() {
    setFormState(toFormState(loadSampleJobPostingFixture()));
    setError(null);
  }

  function resetForm() {
    setFormState(emptyState);
    setError(null);
  }

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
        <div className="space-y-2">
          <p className="app-kicker">Screen 1</p>
          <h2 className="text-2xl font-semibold text-ink">New Analysis / Job Intake</h2>
          <p className="app-copy">
            Enter one posting in structured form. Partial data is allowed, but
            unknown fields stay unknown.
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
            onClick={loadSampleFixture}
            className="app-button-secondary"
          >
            Load seeded sample
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

      <aside className="app-panel space-y-5 p-6 sm:p-7">
        <div>
          <p className="app-kicker">Guardrails</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">First-pass scope only</h3>
        </div>
        <ul className="space-y-3 text-sm leading-6 text-ink/75">
          <li className="app-card px-4 py-3">Only the approved profile and rule files drive the analysis.</li>
          <li className="app-card px-4 py-3">Unknown posting fields stay unresolved instead of being invented.</li>
          <li className="app-card px-4 py-3">The seeded sample fixture lives in demo data and still runs through the same validation and session flow.</li>
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
