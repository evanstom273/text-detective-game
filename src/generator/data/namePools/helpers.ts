export interface PlainNamePool {
  readonly male: readonly string[];
  readonly female: readonly string[];
  readonly surnames: readonly string[];
}

export interface GenderedSurnamePool {
  readonly male: readonly string[];
  readonly female: readonly string[];
  readonly surnames: {
    readonly male: readonly string[];
    readonly female: readonly string[];
  };
}

export type CountryNamePool = PlainNamePool | GenderedSurnamePool;

function splitValues(value: string): readonly string[] {
  return value.split('|').map(item => item.trim()).filter(Boolean);
}

function assertCount(country: string, label: string, values: readonly string[], expected: number) {
  if (values.length !== expected) {
    throw new Error(`${country} ${label} expected ${expected} entries, received ${values.length}.`);
  }
  const normalized = values.map(value => value.toLocaleLowerCase());
  if (new Set(normalized).size !== normalized.length) {
    throw new Error(`${country} ${label} contains duplicate entries.`);
  }
}

export function definePool(
  country: string,
  male: string,
  female: string,
  surnames: string,
): PlainNamePool {
  const result = {
    male: splitValues(male),
    female: splitValues(female),
    surnames: splitValues(surnames),
  };
  assertCount(country, 'male given names', result.male, 50);
  assertCount(country, 'female given names', result.female, 50);
  assertCount(country, 'surnames', result.surnames, 100);
  return result;
}

export function defineGenderedSurnamePool(
  country: string,
  male: string,
  female: string,
  maleSurnames: string,
  femaleSurnames: string,
): GenderedSurnamePool {
  const result = {
    male: splitValues(male),
    female: splitValues(female),
    surnames: {
      male: splitValues(maleSurnames),
      female: splitValues(femaleSurnames),
    },
  };
  assertCount(country, 'male given names', result.male, 50);
  assertCount(country, 'female given names', result.female, 50);
  assertCount(country, 'male surname forms', result.surnames.male, 100);
  assertCount(country, 'female surname forms', result.surnames.female, 100);
  return result;
}
