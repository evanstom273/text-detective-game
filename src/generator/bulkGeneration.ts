import { generateCaseSlice, type GeneratedCaseSlice } from './generateCase';

export interface GenerationFailure {
  readonly seed: string;
  readonly error: string;
}

export interface CountStatistic {
  readonly value: string | number;
  readonly count: number;
}

export interface BulkGenerationStatistics {
  readonly continents: readonly CountStatistic[];
  readonly countries: readonly CountStatistic[];
  readonly countriesByContinent: Readonly<Record<string, readonly CountStatistic[]>>;
  readonly genders: readonly CountStatistic[];
  readonly ages: readonly CountStatistic[];
}

export interface BulkGenerationResult {
  readonly requested: number;
  readonly statistics: BulkGenerationStatistics;
  readonly cases: readonly GeneratedCaseSlice[];
  readonly generationFailures: readonly GenerationFailure[];
}

function rankedCounts<T extends string | number>(values: readonly T[]): CountStatistic[] {
  const counts = new Map<T, number>();
  values.forEach(value => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || String(a.value).localeCompare(String(b.value)));
}

function statisticsFor(cases: readonly GeneratedCaseSlice[]): BulkGenerationStatistics {
  const continentNames = [...new Set(cases.map(item => item.victim.continentName))];
  return {
    continents: rankedCounts(cases.map(item => item.victim.continentName)),
    countries: rankedCounts(cases.map(item => item.victim.countryName)),
    countriesByContinent: Object.fromEntries(continentNames.map(continent => [
      continent,
      rankedCounts(cases.filter(item => item.victim.continentName === continent).map(item => item.victim.countryName)),
    ])),
    genders: rankedCounts(cases.map(item => item.victim.gender)),
    ages: rankedCounts(cases.map(item => item.victim.age)),
  };
}

export function generateBulk(count: number, seedFactory: () => string): BulkGenerationResult {
  if (!Number.isInteger(count) || count < 1 || count > 100000) {
    throw new Error('Number of cases must be an integer between 1 and 100000.');
  }

  const cases: GeneratedCaseSlice[] = [];
  const generationFailures: GenerationFailure[] = [];

  for (let index = 0; index < count; index += 1) {
    const seed = seedFactory();
    try {
      cases.push(generateCaseSlice(seed));
    } catch (error) {
      generationFailures.push({
        seed,
        error: error instanceof Error ? error.message : 'Unknown generation error',
      });
    }
  }

  return { requested: count, statistics: statisticsFor(cases), cases, generationFailures };
}
