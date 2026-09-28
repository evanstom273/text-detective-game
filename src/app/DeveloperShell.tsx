import { useState, type ReactNode } from 'react';
import { PwaControls } from './PwaControls';
import { generateBulk, type BulkGenerationResult } from '../generator/bulkGeneration';
import { generateCaseSlice, type GeneratedCaseSlice } from '../generator/generateCase';
import { createRandomSeed } from '../generator/random';
import { estimatedDeathWindowLabel, formatDisplayDate, murderNarrative } from '../generator/caseNarrative';

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

const panelClass = 'rounded-2xl border border-slate-800/90 bg-slate-900/70 shadow-xl shadow-slate-950/20 backdrop-blur';

function Panel({
  children,
  heading,
  id,
  className = '',
}: {
  children: ReactNode;
  heading: string;
  id: string;
  className?: string;
}) {
  return <section className={`${panelClass} ${className}`} aria-labelledby={id}>
    <div className="border-b border-slate-800/80 px-5 py-4 sm:px-6">
      <h2 id={id} className="text-xs font-semibold tracking-[0.2em] text-slate-200">{heading}</h2>
    </div>
    <div className="p-5 sm:p-6">{children}</div>
  </section>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1.5 border-b border-slate-800/70 py-3 last:border-b-0 sm:grid-cols-[minmax(0,0.9fr)_minmax(12rem,1.1fr)] sm:items-center sm:gap-5">
    <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">{label}</dt>
    <dd className="text-sm leading-6 text-slate-300">{value}</dd>
  </div>;
}

function StatusPill({ children }: { children: ReactNode }) {
  return <span className="shrink-0 rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
    {children}
  </span>;
}

function PlaceholderBlock({ label }: { label: string }) {
  return <div className="rounded-xl border border-slate-800/80 bg-slate-950/35 px-4 py-3.5">
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
    <p className="mt-1.5 text-sm text-slate-600">Not generated</p>
  </div>;
}

function exportTimestamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadJson(filename: string, value: unknown) {
  downloadText(filename, JSON.stringify(value, null, 2), 'application/json');
}

function bulkMarkdown(bulk: BulkGenerationResult) {
  const lines = [
    '# Text Detective Game — Bulk Generation Export',
    '',
    `Generated cases: ${bulk.cases.length}`,
    `Requested cases: ${bulk.requested}`,
    `Generation failures: ${bulk.generationFailures.length}`,
    '',
    '## Statistics',
    '',
    '### Continents',
    ...bulk.statistics.continents.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Countries',
    ...bulk.statistics.countries.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Countries by continent',
    ...Object.entries(bulk.statistics.countriesByContinent).flatMap(([continent, items]) => [
      '',
      `#### ${continent}`,
      ...items.map(item => `- ${item.value}: ${item.count}`),
    ]),
    '',
    '### Genders',
    ...bulk.statistics.genders.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Ages',
    ...bulk.statistics.ages.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Given names',
    ...bulk.statistics.givenNames.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Surnames',
    ...bulk.statistics.surnames.map(item => `- ${item.value}: ${item.count}`),
    '',
    `### Multiple surnames: ${bulk.statistics.multipleSurnames}`,
    '',
    `### Hyphenated surnames: ${bulk.statistics.hyphenatedSurnames}`,
    '',
    '### Name orders',
    ...bulk.statistics.nameOrders.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Middle-name styles',
    ...bulk.statistics.middleNameStyles.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Causes of death',
    ...bulk.statistics.causesOfDeath.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Methods',
    ...bulk.statistics.methods.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Weapons / instruments',
    ...bulk.statistics.weaponsOrInstruments.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Murder locations',
    ...bulk.statistics.murderLocations.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Death years',
    ...bulk.statistics.deathYears.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Death months',
    ...bulk.statistics.deathMonths.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Death hours',
    ...bulk.statistics.deathHours.map(item => `- ${String(item.value).padStart(2, '0')}:00: ${item.count}`),
    '',
    '### Time zones',
    ...bulk.statistics.timeZones.map(item => `- ${item.value}: ${item.count}`),
    '',
    '### Time-of-death window widths',
    ...bulk.statistics.timeOfDeathWindowWidths.map(item => `- ${item.value} minutes: ${item.count}`),
    '',
    '---',
    '',
    '## Cases',
    '',
  ];

  bulk.cases.forEach((item, index) => {
    lines.push(
      `### Case ${index + 1}`,
      '',
      `- Seed: \`${item.seed}\``,
      `- Victim: ${item.victim.fullName}, ${item.victim.age}`,
      `- Date of birth: ${item.victim.dateOfBirth}`,
      `- Gender: ${item.victim.gender}`,
      `- Continent: ${item.victim.continentName}`,
      `- Country: ${item.victim.countryName}`,
      `- Murder: ${murderNarrative(item)}`,
      `- Cause of death: ${item.murder.causeOfDeath}`,
      `- Exact death datetime: ${item.murder.timeOfDeath.exact.localIso}`,
      `- Estimated time of death: ${estimatedDeathWindowLabel(item)}`,
      `- Time zone: ${item.murder.timeOfDeath.timeZone}`,
      `- Method: ${item.murder.method}`,
      `- Weapon / instrument: ${item.murder.weaponOrInstrument}`,
      `- Murder location: ${item.murder.location}`,
      `- Validation: ${item.validation.status}`,
      '',
    );
  });

  if (bulk.generationFailures.length) {
    lines.push('---', '', '## Generation Failures', '');
    bulk.generationFailures.forEach((failure, index) => {
      lines.push(`### Failure ${index + 1}`, '', `- Seed: \`${failure.seed}\``, `- Error: ${failure.error}`, '');
    });
  }

  return lines.join('\n');
}

function VictimSummary({ generated }: { generated: GeneratedCaseSlice }) {
  const victim = generated.victim;
  return <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4 sm:p-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Victim</p>
        <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">{victim.fullName}</h3>
        <p className="mt-2 text-sm text-slate-400">
          {victim.gender === 'male' ? 'Male' : 'Female'} · {victim.age} · {victim.countryName}
        </p>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 sm:text-right">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Date of birth</p>
        <p className="mt-1 text-sm text-slate-300">{formatDisplayDate(victim.dateOfBirth)}</p>
      </div>
    </div>
  </div>;
}

function MurderSummary({ generated }: { generated: GeneratedCaseSlice }) {
  const murder = generated.murder;
  const death = murder.timeOfDeath;
  return <div className="rounded-xl border border-sky-900/70 bg-gradient-to-br from-sky-950/35 to-slate-950/60 p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">Murder</p>
      <span className="rounded-full border border-sky-900/80 bg-sky-950/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-sky-300">
        {murder.causeOfDeath}
      </span>
    </div>
    <p className="mt-3 text-base leading-7 text-slate-200 sm:text-lg">{murderNarrative(generated)}</p>
    <div className="mt-4 grid gap-3 border-t border-sky-950/80 pt-4 sm:grid-cols-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Exact death</p>
        <p className="mt-1 text-sm text-slate-300">{formatDisplayDate(death.exact.localDate)}, {death.exact.localTime}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Estimated TOD</p>
        <p className="mt-1 text-sm text-slate-300">{estimatedDeathWindowLabel(generated)}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Time zone</p>
        <p className="mt-1 break-words text-sm text-slate-300">{death.timeZone} <span className="text-slate-500">({death.exact.offset})</span></p>
      </div>
    </div>
  </div>;
}

export function DeveloperShell() {
  const [seed, setSeed] = useState('');
  const [generated, setGenerated] = useState<GeneratedCaseSlice | null>(null);
  const [error, setError] = useState('');
  const [bulkCount, setBulkCount] = useState('100');
  const [bulk, setBulk] = useState<BulkGenerationResult | null>(null);

  const generate = (nextSeed = seed) => {
    try {
      setGenerated(generateCaseSlice(nextSeed));
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Generation failed.');
    }
  };

  const randomSeed = () => {
    setSeed(createRandomSeed());
    setError('');
  };

  const runBulk = () => {
    try {
      setBulk(generateBulk(Number(bulkCount), createRandomSeed));
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Bulk generation failed.');
    }
  };

  return <div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="border-b border-slate-800/80 bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 sm:py-9 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-300">Text Detective Game</p>
          <h1 className="mt-2.5 text-3xl font-semibold tracking-tight sm:text-4xl">V0 Case Generator</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Seeded case truth generation, chronology, and stress-test tooling.
          </p>
        </div>
        <PwaControls />
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <Panel heading="CASE GENERATOR" id="case-generator-heading">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-slate-500" htmlFor="seed-input">Seed:</label>
            <input
              id="seed-input"
              className="w-full min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-950"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              placeholder="Enter any seed"
            />
          </div>
          <button className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500" type="button" onClick={() => generate()}>
            Generate
          </button>
          <button className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800" type="button" onClick={randomSeed}>
            Random Seed
          </button>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(20rem,0.8fr)] lg:items-start">
        <div className="grid gap-5">
          <Panel heading="CASE TRUTH" id="case-truth-heading">
            {generated ? <div className="grid gap-4">
              <VictimSummary generated={generated} />
              <MurderSummary generated={generated} />

              <div className="grid gap-3 sm:grid-cols-2">
                <PlaceholderBlock label="Perpetrator" />
                <PlaceholderBlock label="Motive" />
              </div>

              <dl className="mt-1">
                <DetailRow label="Timeline" value="None generated" />
                <DetailRow label="Evidence" value="None generated" />
                <DetailRow label="Other suspects" value="None generated" />
                <DetailRow label="Relevant / misleading circumstances" value="None generated" />
              </dl>
            </div> : <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-5 py-10 text-center">
              <p className="text-sm font-medium text-slate-400">No case generated yet.</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">Enter a seed or generate a random one to build the hidden case truth.</p>
            </div>}
          </Panel>

          <Panel heading="RAW UNDERLYING DATA" id="raw-underlying-data-heading">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-950/70">
                <span>{generated ? 'Show structured case facts' : 'Nothing generated yet.'}</span>
                <span className="text-slate-600 transition group-open:rotate-180">⌄</span>
              </summary>
              {generated && <dl className="mt-3 rounded-lg border border-slate-800/80 bg-slate-950/30 px-4">
                <DetailRow label="Seed" value={generated.seed} />
                <DetailRow label="Continent" value={generated.victim.continentName} />
                <DetailRow label="Country" value={generated.victim.countryName} />
                <DetailRow label="Gender" value={generated.victim.gender} />
                <DetailRow label="Age at death" value={String(generated.victim.age)} />
                <DetailRow label="Date of birth" value={generated.victim.dateOfBirth} />
                <DetailRow label="Given name" value={generated.victim.givenName} />
                <DetailRow label="Middle names" value={generated.victim.middleNames.length ? generated.victim.middleNames.join(' ') : 'None'} />
                <DetailRow label="Surname" value={generated.victim.surname} />
                <DetailRow label="Surname components" value={generated.victim.surnameParts.join(' | ')} />
                <DetailRow label="Name order" value={generated.victim.nameOrder} />
                <DetailRow label="Middle-name style" value={generated.victim.middleNameStyle} />
                <DetailRow label="Multiple surnames" value={generated.victim.hasMultipleSurnames ? 'Yes' : 'No'} />
                <DetailRow label="Hyphenated surname" value={generated.victim.hasHyphenatedSurname ? 'Yes' : 'No'} />
                <DetailRow label="Cause of death" value={generated.murder.causeOfDeath} />
                <DetailRow label="Method" value={generated.murder.method} />
                <DetailRow label="Weapon / instrument" value={generated.murder.weaponOrInstrument} />
                <DetailRow label="Murder location" value={generated.murder.location} />
                <DetailRow label="Exact death UTC" value={generated.murder.timeOfDeath.exact.utcIso} />
                <DetailRow label="Exact death local" value={generated.murder.timeOfDeath.exact.localIso} />
                <DetailRow label="Time zone" value={generated.murder.timeOfDeath.timeZone} />
                <DetailRow label="TOD window start" value={generated.murder.timeOfDeath.estimatedWindow.start.localIso} />
                <DetailRow label="TOD window end" value={generated.murder.timeOfDeath.estimatedWindow.end.localIso} />
              </dl>}
            </details>
          </Panel>
        </div>

        <aside className="grid gap-5 lg:sticky lg:top-5">
          <Panel heading="AUTOMATED VALIDATION" id="automated-validation-heading">
            <div className="divide-y divide-slate-800/70">
              {validationChecks.map(check => <div key={check} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-xs leading-5 text-slate-400">{check}</span>
                <StatusPill>Not run</StatusPill>
              </div>)}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-700/80 pt-4">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Status:</span>
              <StatusPill>NOT RUN</StatusPill>
            </div>
          </Panel>

          <Panel heading="BULK GENERATION" id="bulk-generation-heading">
            <label className="block text-xs font-medium uppercase tracking-[0.1em] text-slate-500" htmlFor="case-count-input">Number of cases:</label>
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <input
                id="case-count-input"
                className="min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm"
                type="number"
                min="1"
                max="100000"
                value={bulkCount}
                onChange={event => setBulkCount(event.target.value)}
              />
              <button className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-white" type="button" onClick={runBulk}>
                Generate
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/45 p-3">
                <p className="text-[10px] uppercase tracking-[0.1em] text-slate-600">Generated</p>
                <p className="mt-1 text-lg font-semibold text-slate-200">{bulk ? bulk.cases.length : '—'}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/45 p-3">
                <p className="text-[10px] uppercase tracking-[0.1em] text-slate-600">Passed</p>
                <p className="mt-1 text-sm font-medium text-slate-500">Not run</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/45 p-3">
                <p className="text-[10px] uppercase tracking-[0.1em] text-slate-600">Failed</p>
                <p className="mt-1 text-sm font-medium text-slate-500">Not run</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              <button className="rounded-lg border border-slate-700 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40" disabled={!bulk} onClick={() => bulk && downloadJson(`text-detective-cases_${exportTimestamp()}.json`, bulk)}>Download JSON</button>
              <button className="rounded-lg border border-slate-700 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40" disabled={!bulk} onClick={() => bulk && downloadText(`text-detective-cases_${exportTimestamp()}.md`, bulkMarkdown(bulk), 'text/markdown')}>Download Markdown</button>
              <button className="rounded-lg border border-slate-700 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40" disabled={!bulk} onClick={() => bulk && downloadJson(`text-detective-generation-failures_${exportTimestamp()}.json`, bulk.generationFailures)}>Download Failures</button>
            </div>
          </Panel>
        </aside>
      </div>
    </main>
  </div>;
}
