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
export type MiddleNameStyle = 'none' | 'russian-patronymic' | 'egyptian-lineage' | 'kenyan-tribal';

export interface NamingRules {
  readonly order: NameOrder;
  readonly multiSurnameChance: number;
  readonly multiSurnameSeparators: readonly SurnameSeparator[];
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
  multiSurnameChance: 0,
  multiSurnameSeparators: ['-'],
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

// Multi-surname chances are generator heuristics, not claims about national
// population frequencies. A value of 1 is used where the researched naming
// convention structurally expects two family-name components in V0.
const countryDefinitions: readonly CountryDefinition[] = [
  { id: 'united-states', name: 'United States', continent: 'north-america', naming: { multiSurnameChance: 0.08, multiSurnameSeparators: ['-'] } },
  { id: 'canada', name: 'Canada', continent: 'north-america', naming: { multiSurnameChance: 0.08, multiSurnameSeparators: ['-'] } },
  { id: 'mexico', name: 'Mexico', continent: 'north-america', naming: { multiSurnameChance: 1, multiSurnameSeparators: [' '] } },

  { id: 'brazil', name: 'Brazil', continent: 'south-america', naming: { multiSurnameChance: 1, multiSurnameSeparators: [' '] } },
  { id: 'colombia', name: 'Colombia', continent: 'south-america', naming: { multiSurnameChance: 1, multiSurnameSeparators: [' '] } },
  { id: 'argentina', name: 'Argentina', continent: 'south-america', naming: { multiSurnameChance: 0.35, multiSurnameSeparators: [' '] } },
  { id: 'chile', name: 'Chile', continent: 'south-america', naming: { multiSurnameChance: 1, multiSurnameSeparators: [' '] } },

  { id: 'united-kingdom', name: 'United Kingdom', continent: 'europe', naming: { multiSurnameChance: 0.08, multiSurnameSeparators: ['-'] } },
  { id: 'ireland', name: 'Ireland', continent: 'europe', naming: { multiSurnameChance: 0.08, multiSurnameSeparators: ['-'] } },
  { id: 'france', name: 'France', continent: 'europe', naming: { multiSurnameChance: 0.12, multiSurnameSeparators: [' ', '-'] } },
  { id: 'germany', name: 'Germany', continent: 'europe' },
  { id: 'italy', name: 'Italy', continent: 'europe' },
  { id: 'poland', name: 'Poland', continent: 'europe', naming: { multiSurnameChance: 0.1, multiSurnameSeparators: ['-'] } },
  { id: 'spain', name: 'Spain', continent: 'europe', naming: { multiSurnameChance: 1, multiSurnameSeparators: [' '] } },
  { id: 'portugal', name: 'Portugal', continent: 'europe', naming: { multiSurnameChance: 1, multiSurnameSeparators: [' '] } },
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
  { id: 'kenya', name: 'Kenya', continent: 'africa', naming: { middleNameStyle: 'kenyan-tribal' } },
  { id: 'uganda', name: 'Uganda', continent: 'africa' },

  { id: 'australia', name: 'Australia', continent: 'oceania', naming: { multiSurnameChance: 0.08, multiSurnameSeparators: ['-'] } },
  { id: 'new-zealand', name: 'New Zealand', continent: 'oceania', naming: { multiSurnameChance: 0.08, multiSurnameSeparators: ['-'] } },
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
