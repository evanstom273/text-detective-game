import { namePools, type NamePoolCountryId } from './namePools';

export type Gender = 'male' | 'female';

export type Continent =
  | 'north-america'
  | 'south-america'
  | 'europe'
  | 'asia'
  | 'africa'
  | 'oceania';

export type SurnameData =
  | readonly string[]
  | Readonly<Record<Gender, readonly string[]>>;

export type NameOrder = 'given-family' | 'family-given';
export type SurnameSeparator = ' ' | '-';
export type MiddleNameStyle = 'none' | 'russian-patronymic' | 'egyptian-lineage';

export interface NamingRules {
  readonly order: NameOrder;
  readonly compoundSurnameChance: number;
  readonly compoundSurnameSeparators: readonly SurnameSeparator[];
  readonly middleNameStyle: MiddleNameStyle;
}

export interface CountryNameData {
  readonly id: NamePoolCountryId;
  readonly name: string;
  readonly continent: Continent;
  readonly firstNames: Readonly<Record<Gender, readonly string[]>>;
  readonly surnames: SurnameData;
  readonly naming?: Partial<NamingRules>;
}

interface CountryDefinition {
  readonly id: NamePoolCountryId;
  readonly name: string;
  readonly continent: Continent;
  readonly naming?: Partial<NamingRules>;
}

export const defaultNamingRules: NamingRules = {
  order: 'given-family',
  compoundSurnameChance: 0,
  compoundSurnameSeparators: ['-'],
  middleNameStyle: 'none',
};

export function namingRulesFor(country: CountryNameData): NamingRules {
  return { ...defaultNamingRules, ...country.naming };
}

export function formatFullName(
  givenName: string,
  middleNames: readonly string[],
  surname: string,
  rules: NamingRules,
): string {
  const personalNames = [givenName, ...middleNames].join(' ');
  return rules.order === 'family-given'
    ? `${surname} ${personalNames}`
    : `${personalNames} ${surname}`;
}

export const continentNames: Readonly<Record<Continent, string>> = {
  'north-america': 'North America',
  'south-america': 'South America',
  europe: 'Europe',
  asia: 'Asia',
  africa: 'Africa',
  oceania: 'Oceania',
};

// Compound-surname chances are variety heuristics for the generator, not claims
// about national population frequencies. Legal/cultural structure is encoded
// separately from demographic weighting so the pools remain equal-choice.
const countryDefinitions: readonly CountryDefinition[] = [
  { id: 'united-states', name: 'United States', continent: 'north-america', naming: { compoundSurnameChance: 0.08, compoundSurnameSeparators: ['-'] } },
  { id: 'canada', name: 'Canada', continent: 'north-america', naming: { compoundSurnameChance: 0.08, compoundSurnameSeparators: ['-'] } },
  { id: 'mexico', name: 'Mexico', continent: 'north-america', naming: { compoundSurnameChance: 1, compoundSurnameSeparators: [' '] } },

  { id: 'brazil', name: 'Brazil', continent: 'south-america', naming: { compoundSurnameChance: 0.9, compoundSurnameSeparators: [' '] } },
  { id: 'colombia', name: 'Colombia', continent: 'south-america', naming: { compoundSurnameChance: 1, compoundSurnameSeparators: [' '] } },
  { id: 'argentina', name: 'Argentina', continent: 'south-america', naming: { compoundSurnameChance: 0.35, compoundSurnameSeparators: [' '] } },
  { id: 'chile', name: 'Chile', continent: 'south-america', naming: { compoundSurnameChance: 1, compoundSurnameSeparators: [' '] } },

  { id: 'united-kingdom', name: 'United Kingdom', continent: 'europe', naming: { compoundSurnameChance: 0.08, compoundSurnameSeparators: ['-'] } },
  { id: 'ireland', name: 'Ireland', continent: 'europe', naming: { compoundSurnameChance: 0.08, compoundSurnameSeparators: ['-'] } },
  { id: 'france', name: 'France', continent: 'europe', naming: { compoundSurnameChance: 0.12, compoundSurnameSeparators: [' ', '-'] } },
  { id: 'germany', name: 'Germany', continent: 'europe', naming: { compoundSurnameChance: 0.08, compoundSurnameSeparators: ['-', ' '] } },
  { id: 'italy', name: 'Italy', continent: 'europe', naming: { compoundSurnameChance: 0.2, compoundSurnameSeparators: [' '] } },
  { id: 'poland', name: 'Poland', continent: 'europe', naming: { compoundSurnameChance: 0.1, compoundSurnameSeparators: ['-'] } },
  { id: 'spain', name: 'Spain', continent: 'europe', naming: { compoundSurnameChance: 1, compoundSurnameSeparators: [' '] } },
  { id: 'portugal', name: 'Portugal', continent: 'europe', naming: { compoundSurnameChance: 0.85, compoundSurnameSeparators: [' '] } },
  { id: 'russia', name: 'Russia', continent: 'europe', naming: { middleNameStyle: 'russian-patronymic' } },

  { id: 'japan', name: 'Japan', continent: 'asia', naming: { order: 'family-given' } },
  { id: 'south-korea', name: 'South Korea', continent: 'asia', naming: { order: 'family-given' } },
  { id: 'china', name: 'China', continent: 'asia', naming: { order: 'family-given' } },
  { id: 'india', name: 'India', continent: 'asia' },
  { id: 'thailand', name: 'Thailand', continent: 'asia' },
  { id: 'turkey', name: 'Turkey', continent: 'asia' },

  { id: 'nigeria', name: 'Nigeria', continent: 'africa' },
  { id: 'egypt', name: 'Egypt', continent: 'africa', naming: { middleNameStyle: 'egyptian-lineage' } },
  { id: 'south-africa', name: 'South Africa', continent: 'africa' },
  { id: 'ghana', name: 'Ghana', continent: 'africa' },
  { id: 'kenya', name: 'Kenya', continent: 'africa' },
  { id: 'uganda', name: 'Uganda', continent: 'africa' },

  { id: 'australia', name: 'Australia', continent: 'oceania', naming: { compoundSurnameChance: 0.08, compoundSurnameSeparators: ['-'] } },
  { id: 'new-zealand', name: 'New Zealand', continent: 'oceania', naming: { compoundSurnameChance: 0.08, compoundSurnameSeparators: ['-'] } },
  { id: 'samoa', name: 'Samoa', continent: 'oceania' },
  { id: 'papua-new-guinea', name: 'Papua New Guinea', continent: 'oceania' },
] as const;

export const countries: readonly CountryNameData[] = countryDefinitions.map(definition => {
  const pool = namePools[definition.id];
  return {
    ...definition,
    firstNames: { male: pool.male, female: pool.female },
    surnames: pool.surnames,
  };
});

function hasGenderedSurnames(
  surnames: SurnameData,
): surnames is Readonly<Record<Gender, readonly string[]>> {
  return !Array.isArray(surnames);
}

export function surnamesFor(country: CountryNameData, gender: Gender): readonly string[] {
  return hasGenderedSurnames(country.surnames)
    ? country.surnames[gender]
    : country.surnames;
}

export const countriesByContinent: Readonly<Record<Continent, readonly CountryNameData[]>> = {
  'north-america': countries.filter(country => country.continent === 'north-america'),
  'south-america': countries.filter(country => country.continent === 'south-america'),
  europe: countries.filter(country => country.continent === 'europe'),
  asia: countries.filter(country => country.continent === 'asia'),
  africa: countries.filter(country => country.continent === 'africa'),
  oceania: countries.filter(country => country.continent === 'oceania'),
};
