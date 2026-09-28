import { describe, expect, it } from 'vitest';
import { generateCaseSlice } from './generateCase';
import { countries, namingRulesFor, surnamesFor } from './data/nameCatalogue';
import { causesOfDeath } from './data/murderCatalogue';
import { russianPatronymics } from './data/namePools/russianPatronymics';

function expectedFullName(victim: ReturnType<typeof generateCaseSlice>['victim']): string {
  const personalNames = [victim.givenName, ...victim.middleNames].join(' ');
  return victim.nameOrder === 'family-given'
    ? `${victim.surname} ${personalNames}`
    : `${personalNames} ${victim.surname}`;
}

describe('country name catalogue', () => {
  it('contains all 32 countries with 50 male names, 50 female names, and 100 surname forms', () => {
    expect(countries).toHaveLength(32);

    for (const country of countries) {
      expect(country.givenNames.male, `${country.name} male names`).toHaveLength(50);
      expect(country.givenNames.female, `${country.name} female names`).toHaveLength(50);
      expect(surnamesFor(country, 'male'), `${country.name} male surnames`).toHaveLength(100);
      expect(surnamesFor(country, 'female'), `${country.name} female surnames`).toHaveLength(100);

      expect(new Set(country.givenNames.male.map(name => name.toLocaleLowerCase())).size).toBe(50);
      expect(new Set(country.givenNames.female.map(name => name.toLocaleLowerCase())).size).toBe(50);
      expect(new Set(surnamesFor(country, 'male').map(name => name.toLocaleLowerCase())).size).toBe(100);
      expect(new Set(surnamesFor(country, 'female').map(name => name.toLocaleLowerCase())).size).toBe(100);
    }
  });

  it('keeps country naming rules within valid structural ranges', () => {
    for (const country of countries) {
      const rules = namingRulesFor(country);
      expect(rules.multiSurnameChance).toBeGreaterThanOrEqual(0);
      expect(rules.multiSurnameChance).toBeLessThanOrEqual(1);
      expect(rules.multiSurnameSeparators.length).toBeGreaterThan(0);
    }
  });
});

describe('generateCaseSlice', () => {
  it('is deterministic for the same seed', () => {
    expect(generateCaseSlice('same-seed')).toEqual(generateCaseSlice('same-seed'));
  });

  it('generates a complete victim identity from catalogue data', () => {
    const generated = generateCaseSlice('victim-test');
    expect(generated.victim.fullName).toBe(expectedFullName(generated.victim));
    expect(generated.victim.countryName.length).toBeGreaterThan(0);
    expect(generated.victim.continentName.length).toBeGreaterThan(0);
  });

  it('stress-tests 100,000 generated identities for structural invariants', () => {
    const seenCountries = new Set<string>();
    let sawMultipleSurname = false;
    let sawHyphenatedSurname = false;
    let sawRussianPatronymic = false;
    let sawEgyptianLineage = false;
    let sawKenyanMiddleName = false;

    for (let index = 0; index < 100000; index += 1) {
      const victim = generateCaseSlice(`identity-stress-${index}`).victim;
      seenCountries.add(victim.countryId);

      if (!victim.givenName || !victim.surname || !victim.fullName) {
        throw new Error(`Empty name component for seed identity-stress-${index}`);
      }
      if (victim.fullName !== expectedFullName(victim)) {
        throw new Error(`Malformed full name for seed identity-stress-${index}: ${victim.fullName}`);
      }

      const normalizedSurnameParts = victim.surnameParts.map(part => part.toLocaleLowerCase());
      if (new Set(normalizedSurnameParts).size !== normalizedSurnameParts.length) {
        throw new Error(`Repeated surname component for seed identity-stress-${index}: ${victim.surname}`);
      }

      if (victim.hasMultipleSurnames) {
        sawMultipleSurname = true;
        if (victim.surnameParts.length !== 2 || victim.surnameSeparator === null) {
          throw new Error(`Invalid multiple surname for seed identity-stress-${index}: ${victim.surname}`);
        }
        if (victim.surname !== victim.surnameParts.join(victim.surnameSeparator)) {
          throw new Error(`Multiple surname does not match its components for seed identity-stress-${index}`);
        }
      } else if (victim.surnameParts.length !== 1 || victim.surnameSeparator !== null) {
        throw new Error(`Invalid single surname structure for seed identity-stress-${index}: ${victim.surname}`);
      }

      if (victim.hasHyphenatedSurname) {
        sawHyphenatedSurname = true;
        if (victim.surnameSeparator !== '-' || !victim.surname.includes('-')) {
          throw new Error(`Hyphenation metadata mismatch for seed identity-stress-${index}`);
        }
      }

      if (['japan', 'south-korea', 'china'].includes(victim.countryId)) {
        if (!victim.fullName.startsWith(`${victim.surname} `)) {
          throw new Error(`Family-name-first order failed for ${victim.countryId}: ${victim.fullName}`);
        }
      }

      if (['mexico', 'colombia', 'chile', 'spain'].includes(victim.countryId)) {
        if (victim.surnameParts.length !== 2 || victim.surnameSeparator !== ' ') {
          throw new Error(`Two-surname convention failed for ${victim.countryId}: ${victim.surname}`);
        }
      }

      if (victim.countryId === 'russia') {
        sawRussianPatronymic = true;
        if (victim.middleNames.length !== 1 || victim.middleNameStyle !== 'russian-patronymic') {
          throw new Error(`Russian patronymic structure failed: ${victim.fullName}`);
        }
      }

      if (victim.countryId === 'egypt') {
        sawEgyptianLineage = true;
        if (victim.middleNames.length !== 2 || victim.middleNameStyle !== 'egyptian-lineage') {
          throw new Error(`Egyptian lineage structure failed: ${victim.fullName}`);
        }
        const components = [victim.givenName, ...victim.middleNames].map(name => name.toLocaleLowerCase());
        if (new Set(components).size !== components.length) {
          throw new Error(`Repeated Egyptian lineage component: ${victim.fullName}`);
        }
      }

      if (victim.countryId === 'kenya') {
        sawKenyanMiddleName = true;
        if (victim.middleNames.length !== 1 || victim.middleNameStyle !== 'kenyan-tribal') {
          throw new Error(`Kenyan middle/tribal-name structure failed: ${victim.fullName}`);
        }
        if (victim.middleNames[0]?.localeCompare(victim.givenName, undefined, { sensitivity: 'base' }) === 0) {
          throw new Error(`Repeated Kenyan personal-name component: ${victim.fullName}`);
        }
      }
    }

    expect(seenCountries.size).toBe(32);
    expect(sawMultipleSurname).toBe(true);
    expect(sawHyphenatedSurname).toBe(true);
    expect(sawRussianPatronymic).toBe(true);
    expect(sawEgyptianLineage).toBe(true);
    expect(sawKenyanMiddleName).toBe(true);
  });

  it('uses gender-appropriate Russian patronymic forms', () => {
    const maleForms = new Set(Object.values(russianPatronymics).map(forms => forms.male));
    const femaleForms = new Set(Object.values(russianPatronymics).map(forms => forms.female));
    let checked = 0;

    for (let index = 0; index < 20000 && checked < 100; index += 1) {
      const victim = generateCaseSlice(`russian-patronymic-${index}`).victim;
      if (victim.countryId !== 'russia') continue;
      checked += 1;
      expect(victim.middleNames).toHaveLength(1);
      expect(victim.gender === 'male' ? maleForms : femaleForms).toContain(victim.middleNames[0]);
    }

    expect(checked).toBeGreaterThan(0);
  });

  it('uses feminine Polish surname forms where Polish surnames inflect', () => {
    const polish = countries.find(country => country.id === 'poland');
    expect(polish).toBeDefined();
    const femaleSurnames = new Set(surnamesFor(polish!, 'female'));

    let checked = 0;
    for (let index = 0; index < 20000 && checked < 100; index += 1) {
      const victim = generateCaseSlice(`polish-name-${index}`).victim;
      if (victim.countryId !== 'poland' || victim.gender !== 'female') continue;
      checked += 1;
      victim.surnameParts.forEach(part => expect(femaleSurnames).toContain(part));
    }

    expect(checked).toBeGreaterThan(0);
  });

  it('generates deterministic victim ages from 16 through 100 inclusive', () => {
    for (let index = 0; index < 10000; index += 1) {
      const victim = generateCaseSlice(`age-check-${index}`).victim;
      expect(victim.age).toBeGreaterThanOrEqual(16);
      expect(victim.age).toBeLessThanOrEqual(100);
      expect(Number.isInteger(victim.age)).toBe(true);
    }
  });

  it('keeps murder method, instrument, and location causally compatible', () => {
    for (let index = 0; index < 10000; index += 1) {
      const generated = generateCaseSlice(`murder-check-${index}`);
      const cause = causesOfDeath.find(item => item.name === generated.murder.causeOfDeath);
      const method = cause?.methods.find(item => item.name === generated.murder.method);
      const instrument = method?.instruments.find(item => item.name === generated.murder.weaponOrInstrument);
      expect(cause).toBeDefined();
      expect(method).toBeDefined();
      expect(instrument).toBeDefined();
      expect(instrument?.locations).toContain(generated.murder.location);
    }
  });

  it('does not claim validation has run', () => {
    expect(generateCaseSlice('validation-test').validation.status).toBe('not-run');
  });
});
