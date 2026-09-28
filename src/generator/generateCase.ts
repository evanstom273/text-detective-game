import {
  continentNames,
  countriesByContinent,
  surnamesFor,
  namingRulesFor,
  formatFullName,
  type Continent,
  type Gender,
} from './data/nameCatalogue';
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
  readonly firstName: string;
  readonly surname: string;
  readonly surnameParts: readonly string[];
  readonly fullName: string;
  readonly nameOrder: 'given-family' | 'family-given';
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

function eligibleSurnames(firstName: string, surnames: readonly string[]): readonly string[] {
  return surnames.filter(
    (surname) => surname.localeCompare(firstName, undefined, { sensitivity: 'base' }) !== 0,
  );
}

function chooseSurname(firstName: string, surnames: readonly string[], random: () => number): string {
  const eligible = eligibleSurnames(firstName, surnames);
  if (eligible.length === 0) {
    throw new Error(`No eligible surname remains for first name "${firstName}".`);
  }
  return choose(eligible, random);
}

export function generateCaseSlice(seed: string): GeneratedCaseSlice {
  const normalizedSeed = seed.trim();
  if (!normalizedSeed) throw new Error('A seed is required.');

  const random = createSeededRandom(normalizedSeed);
  const continent = choose(continents, random);
  const country = choose(countriesByContinent[continent], random);
  const gender = choose(genders, random);
  const firstName = choose(country.firstNames[gender], random);
  const surnamePool = surnamesFor(country, gender);
  const firstSurname = chooseSurname(firstName, surnamePool, random);
  const namingRules = namingRulesFor(country);
  const canHyphenate = (namingRules.hyphenatedSurnameChance ?? 0) > 0 && surnamePool.length > 1;
  const hasHyphenatedSurname = canHyphenate && random() < (namingRules.hyphenatedSurnameChance ?? 0);
  const secondSurnamePool = eligibleSurnames(firstName, surnamePool).filter(
    surname => surname.localeCompare(firstSurname, undefined, { sensitivity: 'base' }) !== 0,
  );
  const surnameParts = hasHyphenatedSurname && secondSurnamePool.length > 0
    ? [firstSurname, choose(secondSurnamePool, random)]
    : [firstSurname];
  const surname = surnameParts.join('-');
  const fullName = formatFullName(firstName, surname, namingRules);
  const age = randomInteger(16, 100, random);
  const cause = choose(causesOfDeath, random);
  const method = choose(cause.methods, random);
  const weaponOrInstrument = choose(method.instruments, random);
  const location = choose(weaponOrInstrument.locations, random);

  return {
    seed: normalizedSeed,
    victim: {
      age,
      gender,
      continent,
      continentName: continentNames[continent],
      countryId: country.id,
      countryName: country.name,
      firstName,
      surname,
      surnameParts,
      fullName,
      nameOrder: namingRules.order,
      hasHyphenatedSurname: surnameParts.length > 1,
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
