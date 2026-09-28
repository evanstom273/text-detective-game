import { generateCaseSlice, type GeneratedCaseSlice } from './generateCase';

export interface GenerationFailure {
  readonly seed: string;
  readonly error: string;
}

export interface BulkGenerationResult {
  readonly requested: number;
  readonly cases: readonly GeneratedCaseSlice[];
  readonly generationFailures: readonly GenerationFailure[];
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

  return { requested: count, cases, generationFailures };
}
