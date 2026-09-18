import type { ReactNode } from 'react';
import { PwaControls } from './PwaControls';

const caseTruthFields = [
  { label: 'Victim', emptyState: 'Not generated' },
  { label: 'Cause of death', emptyState: 'Not generated' },
  { label: 'Time of death', emptyState: 'Not generated' },
  { label: 'Perpetrator', emptyState: 'Not generated' },
  { label: 'Motive', emptyState: 'Not generated' },
  { label: 'Method', emptyState: 'Not generated' },
  { label: 'Timeline', emptyState: 'None generated' },
  { label: 'Evidence', emptyState: 'None generated' },
  { label: 'Other suspects', emptyState: 'None generated' },
  { label: 'Relevant / misleading circumstances', emptyState: 'None generated' },
] as const;

const validationChecks = [
  'Victim alive before fatal event',
  'Murder occurs within time-of-death window',
  'Body discovered after murder',
  'Timeline is chronological',
  'Perpetrator can reach murder location',
  'Weapon exists and is available',
  'Witness is capable of witnessing claimed event',
  'Motive exists before murder',
  'Relationships are internally consistent',
  'Evidence derives from an actual event',
  'Generated statements do not require impossible knowledge',
] as const;

function DeveloperSection({ children, heading, id }: { children: ReactNode; heading: string; id: string }) {
  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 sm:p-6"
      aria-labelledby={id}
    >
      <h2 id={id} className="text-sm font-semibold tracking-[0.18em] text-slate-100">
        {heading}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function EmptyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-slate-800/80 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.8fr)] sm:items-center sm:gap-6">
      <dt className="text-sm text-slate-300">{label}</dt>
      <dd className="text-sm text-slate-500">{value}</dd>
    </div>
  );
}

export function DeveloperShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/90">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-8 sm:px-8 sm:py-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-300">Text Detective Game</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">V0 Case Generator</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Empty developer inspection shell. Generator systems are not implemented yet.
            </p>
          </div>
          <PwaControls />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-5 px-5 py-6 sm:px-8 sm:py-8">
        <DeveloperSection heading="CASE GENERATOR" id="case-generator-heading">
          <div className="grid gap-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center">
            <label className="text-sm font-medium text-slate-300" htmlFor="seed-input">
              Seed:
            </label>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
              <input
                id="seed-input"
                className="min-w-0 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
                type="text"
                placeholder="Not implemented"
                disabled
              />
              <button
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled
              >
                Generate
              </button>
              <button
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled
              >
                Random Seed
              </button>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Generation controls are reserved for a later implementation step.</p>
        </DeveloperSection>

        <DeveloperSection heading="CASE TRUTH" id="case-truth-heading">
          <dl>
            {caseTruthFields.map((field) => (
              <EmptyRow key={field.label} label={field.label} value={field.emptyState} />
            ))}
          </dl>
        </DeveloperSection>

        <DeveloperSection heading="AUTOMATED VALIDATION" id="automated-validation-heading">
          <div className="divide-y divide-slate-800/80">
            {validationChecks.map((check) => (
              <div key={check} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-slate-300">{check}</span>
                <span className="shrink-0 text-xs uppercase tracking-[0.12em] text-slate-500">Not run</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-700 pt-4">
            <span className="text-sm font-medium text-slate-300">Status:</span>
            <span className="text-sm font-semibold tracking-[0.12em] text-slate-400">NOT RUN</span>
          </div>
        </DeveloperSection>

        <DeveloperSection heading="BULK GENERATION" id="bulk-generation-heading">
          <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center">
            <label className="text-sm font-medium text-slate-300" htmlFor="case-count-input">
              Number of cases:
            </label>
            <input
              id="case-count-input"
              className="min-w-0 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
              type="number"
              placeholder="Not implemented"
              disabled
            />
            <button
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled
            >
              Generate
            </button>
          </div>

          <dl className="mt-5 divide-y divide-slate-800/80 border-y border-slate-800/80">
            <EmptyRow label="Generated:" value="Not generated" />
            <EmptyRow label="Passed validation:" value="Not generated" />
            <EmptyRow label="Failed validation:" value="Not generated" />
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled
            >
              Download All
            </button>
            <button
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled
            >
              Download Failures
            </button>
          </div>
        </DeveloperSection>

        <DeveloperSection heading="RAW UNDERLYING DATA" id="raw-underlying-data-heading">
          <p className="text-sm text-slate-500">Nothing generated yet.</p>
        </DeveloperSection>
      </main>
    </div>
  );
}
