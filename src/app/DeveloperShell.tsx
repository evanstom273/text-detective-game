import { useState, type ReactNode } from 'react';
import { PwaControls } from './PwaControls';
import { generateBulk, type BulkGenerationResult } from '../generator/bulkGeneration';
import { generateCaseSlice, type GeneratedCaseSlice } from '../generator/generateCase';
import { createRandomSeed } from '../generator/random';

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
  return <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 sm:p-6" aria-labelledby={id}>
    <h2 id={id} className="text-sm font-semibold tracking-[0.18em] text-slate-100">{heading}</h2>
    <div className="mt-5">{children}</div>
  </section>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-2 border-b border-slate-800/80 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.8fr)] sm:items-center sm:gap-6">
    <dt className="text-sm text-slate-300">{label}</dt><dd className="text-sm text-slate-500">{value}</dd>
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
  anchor.href = url; anchor.download = filename; anchor.click();
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
      `- Gender: ${item.victim.gender}`,
      `- Continent: ${item.victim.continentName}`,
      `- Country: ${item.victim.countryName}`,
      `- Cause of death: ${item.murder.causeOfDeath}`,
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

export function DeveloperShell() {
  const [seed, setSeed] = useState('');
  const [generated, setGenerated] = useState<GeneratedCaseSlice | null>(null);
  const [error, setError] = useState('');
  const [bulkCount, setBulkCount] = useState('100');
  const [bulk, setBulk] = useState<BulkGenerationResult | null>(null);

  const generate = (nextSeed = seed) => {
    try { setGenerated(generateCaseSlice(nextSeed)); setError(''); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Generation failed.'); }
  };

  const randomSeed = () => {
    setSeed(createRandomSeed());
    setError('');
  };

  const runBulk = () => {
    try { setBulk(generateBulk(Number(bulkCount), createRandomSeed)); setError(''); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Bulk generation failed.'); }
  };

  const caseRows = [
    ['Victim', generated ? `${generated.victim.fullName}, ${generated.victim.age}` : 'Not generated'],
    ['Cause of death', generated?.murder.causeOfDeath ?? 'Not generated'], ['Time of death', 'Not generated'],
    ['Perpetrator', 'Not generated'], ['Motive', 'Not generated'], ['Method', generated?.murder.method ?? 'Not generated'],
    ['Weapon / instrument', generated?.murder.weaponOrInstrument ?? 'Not generated'], ['Murder location', generated?.murder.location ?? 'Not generated'],
    ['Timeline', 'None generated'], ['Evidence', 'None generated'], ['Other suspects', 'None generated'],
    ['Relevant / misleading circumstances', 'None generated'],
  ];

  return <div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="border-b border-slate-800/80 bg-slate-950/90"><div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-8 sm:px-8 sm:py-10">
      <div><p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-300">Text Detective Game</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">V0 Case Generator</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Seeded victim identity generation and stress-test tooling.</p></div><PwaControls />
    </div></header>
    <main className="mx-auto grid max-w-5xl gap-5 px-5 py-6 sm:px-8 sm:py-8">
      <DeveloperSection heading="CASE GENERATOR" id="case-generator-heading">
        <div className="grid gap-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center"><label className="text-sm font-medium text-slate-300" htmlFor="seed-input">Seed:</label>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <input id="seed-input" className="min-w-0 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={seed} onChange={(event)=>setSeed(event.target.value)} placeholder="Enter any seed" />
            <button className="rounded-md border border-slate-700 px-3 py-2 text-sm" type="button" onClick={()=>generate()}>Generate</button>
            <button className="rounded-md border border-slate-700 px-3 py-2 text-sm" type="button" onClick={randomSeed}>Random Seed</button>
          </div>
        </div>{error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
      </DeveloperSection>
      <DeveloperSection heading="CASE TRUTH" id="case-truth-heading"><dl>{caseRows.map(([label,value])=><Row key={label} label={label} value={value}/>)}</dl></DeveloperSection>
      <DeveloperSection heading="AUTOMATED VALIDATION" id="automated-validation-heading">
        <div className="divide-y divide-slate-800/80">{validationChecks.map(check=><div key={check} className="flex items-center justify-between gap-4 py-3"><span className="text-sm text-slate-300">{check}</span><span className="shrink-0 text-xs uppercase tracking-[0.12em] text-slate-500">Not run</span></div>)}</div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-700 pt-4"><span className="text-sm font-medium text-slate-300">Status:</span><span className="text-sm font-semibold tracking-[0.12em] text-slate-400">NOT RUN</span></div>
      </DeveloperSection>
      <DeveloperSection heading="BULK GENERATION" id="bulk-generation-heading">
        <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center"><label className="text-sm font-medium text-slate-300" htmlFor="case-count-input">Number of cases:</label><input id="case-count-input" className="min-w-0 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" type="number" min="1" max="100000" value={bulkCount} onChange={event=>setBulkCount(event.target.value)}/><button className="rounded-md border border-slate-700 px-3 py-2 text-sm" type="button" onClick={runBulk}>Generate</button></div>
        <dl className="mt-5 divide-y divide-slate-800/80 border-y border-slate-800/80"><Row label="Generated:" value={bulk ? String(bulk.cases.length) : 'Not generated'}/><Row label="Passed validation:" value="Not run"/><Row label="Failed validation:" value="Not run"/></dl>
        <div className="mt-5 flex flex-wrap gap-2"><button className="rounded-md border border-slate-700 px-3 py-2 text-sm disabled:opacity-50" disabled={!bulk} onClick={()=>bulk && downloadJson(`text-detective-cases_${exportTimestamp()}.json`, bulk)}>Download JSON</button><button className="rounded-md border border-slate-700 px-3 py-2 text-sm disabled:opacity-50" disabled={!bulk} onClick={()=>bulk && downloadText(`text-detective-cases_${exportTimestamp()}.md`, bulkMarkdown(bulk), 'text/markdown')}>Download Markdown</button><button className="rounded-md border border-slate-700 px-3 py-2 text-sm disabled:opacity-50" disabled={!bulk} onClick={()=>bulk && downloadJson(`text-detective-generation-failures_${exportTimestamp()}.json`, bulk.generationFailures)}>Download Failures</button></div>
      </DeveloperSection>
      <DeveloperSection heading="RAW UNDERLYING DATA" id="raw-underlying-data-heading">
        {generated ? <dl><Row label="Seed" value={generated.seed}/><Row label="Continent" value={generated.victim.continentName}/><Row label="Country" value={generated.victim.countryName}/><Row label="Gender" value={generated.victim.gender}/><Row label="Age" value={String(generated.victim.age)}/><Row label="Given name" value={generated.victim.givenName}/><Row label="Middle names" value={generated.victim.middleNames.length ? generated.victim.middleNames.join(' ') : 'None'}/><Row label="Surname" value={generated.victim.surname}/><Row label="Surname components" value={generated.victim.surnameParts.join(' | ')}/><Row label="Name order" value={generated.victim.nameOrder}/><Row label="Middle-name style" value={generated.victim.middleNameStyle}/><Row label="Multiple surnames" value={generated.victim.hasMultipleSurnames ? 'Yes' : 'No'}/><Row label="Hyphenated surname" value={generated.victim.hasHyphenatedSurname ? 'Yes' : 'No'}/><Row label="Cause of death" value={generated.murder.causeOfDeath}/><Row label="Method" value={generated.murder.method}/><Row label="Weapon / instrument" value={generated.murder.weaponOrInstrument}/><Row label="Murder location" value={generated.murder.location}/></dl> : <p className="text-sm text-slate-500">Nothing generated yet.</p>}
      </DeveloperSection>
    </main>
  </div>;
}
