import {
  continentNames,
  countriesByContinent,
  surnamesFor,
  namingRulesFor,
  formatFullName,
  type Continent,
  type Gender,
  type SurnameSeparator,
} from './data/nameCatalogue';
import { russianPatronymics } from './data/namePools/russianPatronymics';
import type { NamePoolCountryId } from './data/namePools';
import { choose, createSeededRandom, randomInteger } from './random';
import { causesOfDeath } from './data/murderCatalogue';
import { ageOnDate, generateDateOfBirth, generateDeathTime, type DeathTimeTruth } from './temporal';

const continents: readonly Continent[] = [
  'north-america',
  'south-america',
  'europe',
  'asia',
  'africa',
  'oceania',
];
const genders: readonly Gender[] = ['male', 'female'];

export interface VictimIdentity {
  readonly age: number;
  readonly dateOfBirth: string;
  readonly gender: Gender;
  readonly continent: Continent;
  readonly continentName: string;
  readonly countryId: NamePoolCountryId;
  readonly countryName: string;
  readonly givenName: string;
  readonly middleNames: readonly string[];
  readonly surname: string;
  readonly surnameParts: readonly string[];
  readonly surnameSeparator: SurnameSeparator | null;
  readonly fullName: string;
  readonly nameOrder: 'given-family' | 'family-given';
  readonly middleNameStyle: 'none' | 'russian-patronymic' | 'egyptian-lineage' | 'kenyan-tribal';
  readonly hasMultipleSurnames: boolean;
  readonly hasHyphenatedSurname: boolean;
}

export interface MurderTruth {
  readonly causeOfDeath: string;
  readonly method: string;
  readonly weaponOrInstrument: string;
  readonly location: string;
  readonly timeOfDeath: DeathTimeTruth;
}

export interface GeneratedCaseSlice {
  readonly seed: string;
  readonly victim: VictimIdentity;
  readonly murder: MurderTruth;
  readonly validation: {
    readonly status: 'not-run';
    readonly results: readonly [];
  };
}

function sameName(a: string, b: string): boolean {
  return a.localeCompare(b, undefined, { sensitivity: 'base' }) === 0;
}

function chooseDistinct(
  values: readonly string[],
  excluded: readonly string[],
  random: () => number,
): string {
  if (values.length === 0) throw new Error('Cannot choose from an empty name collection.');

  // Use exactly one RNG call, then scan only if that indexed value collides
  // with an excluded component. This keeps seeded call counts stable without
  // filtering a 100-entry pool for every generated identity.
  const startIndex = Math.floor(random() * values.length);
  for (let offset = 0; offset < values.length; offset += 1) {
    const candidate = values[(startIndex + offset) % values.length]!;
    if (!excluded.some(item => sameName(item, candidate))) return candidate;
  }

  throw new Error('No distinct name component remains.');
}

function chooseSurname(givenName: string, surnames: readonly string[], random: () => number): string {
  return chooseDistinct(surnames, [givenName], random);
}

function culturalMiddleNames(
  countryId: string,
  gender: Gender,
  givenName: string,
  maleGivenNames: readonly string[],
  currentGenderGivenNames: readonly string[],
  random: () => number,
): readonly string[] {
  if (countryId === 'russia') {
    const fatherName = chooseDistinct(maleGivenNames, [givenName], random);
    const forms = russianPatronymics[fatherName as keyof typeof russianPatronymics];
    if (!forms) throw new Error(`Missing Russian patronymic forms for "${fatherName}".`);
    return [forms[gender]];
  }

  if (countryId === 'egypt') {
    const fatherName = chooseDistinct(maleGivenNames, [givenName], random);
    const grandfatherName = chooseDistinct(maleGivenNames, [givenName, fatherName], random);
    return [fatherName, grandfatherName];
  }

  if (countryId === 'kenya') {
    return [chooseDistinct(currentGenderGivenNames, [givenName], random)];
  }

  return [];
}

export interface CaseGenerationOptions {
  readonly earliestDeathDate?: string;
  readonly latestDeathDate?: string;
}

export function generateCaseSlice(seed: string, options: CaseGenerationOptions = {}): GeneratedCaseSlice {
  const normalizedSeed = seed.trim();
  if (!normalizedSeed) throw new Error('A seed is required.');

  const random = createSeededRandom(normalizedSeed);
  const continent = choose(continents, random);
  const country = choose(countriesByContinent[continent], random);
  const gender = choose(genders, random);
  const givenName = choose(country.givenNames[gender], random);
  const surnamePool = surnamesFor(country, gender);
  const firstSurname = chooseSurname(givenName, surnamePool, random);

  // Keep the original case RNG stream stable: extra naming complexity must not
  // reshuffle age or murder facts merely because a culture needs more name parts.
  const age = randomInteger(16, 100, random);
  const cause = choose(causesOfDeath, random);
  const method = choose(cause.methods, random);
  const weaponOrInstrument = choose(method.instruments, random);
  const location = choose(weaponOrInstrument.locations, random);

  const namingRules = namingRulesFor(country);
  const namingRandom = createSeededRandom(`${normalizedSeed}::name-structure`);
  const canCompound = namingRules.multiSurnameChance > 0 && surnamePool.length > 1;
  const hasMultipleSurnames = canCompound && namingRandom() < namingRules.multiSurnameChance;
  const surnameParts = hasMultipleSurnames
    ? [firstSurname, chooseDistinct(surnamePool, [givenName, firstSurname], namingRandom)]
    : [firstSurname];
  const surnameSeparator = surnameParts.length > 1
    ? choose(namingRules.multiSurnameSeparators, namingRandom)
    : null;
  const surname = surnameParts.join(surnameSeparator ?? '');

  const middleNames = culturalMiddleNames(
    country.id,
    gender,
    givenName,
    country.givenNames.male,
    country.givenNames[gender],
    namingRandom,
  );
  const fullName = formatFullName(givenName, middleNames, surname, namingRules);

  const temporalRandom = createSeededRandom(`${normalizedSeed}::death-time`);
  const timeOfDeath = generateDeathTime(
    country.id,
    temporalRandom,
    options.earliestDeathDate,
    options.latestDeathDate,
  );
  const birthRandom = createSeededRandom(`${normalizedSeed}::birth-date`);
  const dateOfBirth = generateDateOfBirth(age, timeOfDeath.exact.localDate, birthRandom);
  const derivedAge = ageOnDate(dateOfBirth, timeOfDeath.exact.localDate);
  if (derivedAge !== age) {
    throw new Error(`Generated date of birth does not match age at death for seed "${normalizedSeed}".`);
  }

  return {
    seed: normalizedSeed,
    victim: {
      age: derivedAge,
      dateOfBirth,
      gender,
      continent,
      continentName: continentNames[continent],
      countryId: country.id,
      countryName: country.name,
      givenName,
      middleNames,
      surname,
      surnameParts,
      surnameSeparator,
      fullName,
      nameOrder: namingRules.order,
      middleNameStyle: namingRules.middleNameStyle,
      hasMultipleSurnames: surnameParts.length > 1,
      hasHyphenatedSurname: surnameParts.length > 1 && surnameSeparator === '-',
    },
    murder: {
      causeOfDeath: cause.name,
      method: method.name,
      weaponOrInstrument: weaponOrInstrument.name,
      location,
      timeOfDeath,
    },
    validation: { status: 'not-run', results: [] },
  };
}
