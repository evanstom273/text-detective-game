import {
  continentNames,
  countriesByContinent,
  surnamesFor,
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
  readonly fullName: string;
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

function chooseSurname(firstName: string, surnames: readonly string[], random: () => number): string {
  const eligible = surnames.filter(
    (surname) => surname.localeCompare(firstName, undefined, { sensitivity: 'base' }) !== 0,
  );
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
  const surname = chooseSurname(firstName, surnamesFor(country, gender), random);
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
      fullName: `${firstName} ${surname}`,
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
