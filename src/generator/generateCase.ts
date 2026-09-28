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
import { choose, createSeededRandom, randomInteger } from './random';
import { causesOfDeath } from './data/murderCatalogue';

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
  readonly gender: Gender;
  readonly continent: Continent;
  readonly continentName: string;
  readonly countryId: string;
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

function eligibleSurnames(givenName: string, surnames: readonly string[]): readonly string[] {
  return surnames.filter(
    surname => surname.localeCompare(givenName, undefined, { sensitivity: 'base' }) !== 0,
  );
}

function chooseSurname(givenName: string, surnames: readonly string[], random: () => number): string {
  const eligible = eligibleSurnames(givenName, surnames);
  if (eligible.length === 0) {
    throw new Error(`No eligible surname remains for given name "${givenName}".`);
  }
  return choose(eligible, random);
}

function chooseDifferent(
  values: readonly string[],
  excluded: readonly string[],
  random: () => number,
): string {
  const eligible = values.filter(value => !excluded.some(
    item => item.localeCompare(value, undefined, { sensitivity: 'base' }) === 0,
  ));
  if (eligible.length === 0) throw new Error('No distinct name component remains.');
  return choose(eligible, random);
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
    const fatherName = chooseDifferent(maleGivenNames, [givenName], random);
    const forms = russianPatronymics[fatherName as keyof typeof russianPatronymics];
    if (!forms) throw new Error(`Missing Russian patronymic forms for "${fatherName}".`);
    return [forms[gender]];
  }

  if (countryId === 'egypt') {
    const fatherName = chooseDifferent(maleGivenNames, [givenName], random);
    const grandfatherName = chooseDifferent(maleGivenNames, [givenName, fatherName], random);
    return [fatherName, grandfatherName];
  }

  if (countryId === 'kenya') {
    return [chooseDifferent(currentGenderGivenNames, [givenName], random)];
  }

  return [];
}

export function generateCaseSlice(seed: string): GeneratedCaseSlice {
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
  const secondSurnamePool = eligibleSurnames(givenName, surnamePool).filter(
    surname => surname.localeCompare(firstSurname, undefined, { sensitivity: 'base' }) !== 0,
  );
  const surnameParts = hasMultipleSurnames && secondSurnamePool.length > 0
    ? [firstSurname, choose(secondSurnamePool, namingRandom)]
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

  return {
    seed: normalizedSeed,
    victim: {
      age,
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
    },
    validation: { status: 'not-run', results: [] },
  };
}
