import { describe, expect, it } from 'vitest';
import { generateCaseSlice } from './generateCase';
import { causesOfDeath } from './data/murderCatalogue';

describe('generateCaseSlice', () => {
  it('is deterministic for the same seed', () => {
    expect(generateCaseSlice('same-seed')).toEqual(generateCaseSlice('same-seed'));
  });

  it('generates a complete victim identity from catalogue data', () => {
    const generated = generateCaseSlice('victim-test');
    const expectedName = generated.victim.nameOrder === 'family-given'
      ? `${generated.victim.surname} ${generated.victim.firstName}`
      : `${generated.victim.firstName} ${generated.victim.surname}`;
    expect(generated.victim.fullName).toBe(expectedName);
    expect(generated.victim.countryName.length).toBeGreaterThan(0);
    expect(generated.victim.continentName.length).toBeGreaterThan(0);
  });

  it('uses family-name-first display order for configured East Asian catalogues', () => {
    const matches = Array.from({ length: 20000 }, (_, index) => generateCaseSlice(`name-order-${index}`))
      .filter(item => ['japan', 'south-korea', 'china'].includes(item.victim.countryId));
    expect(matches.length).toBeGreaterThan(0);
    matches.forEach(item => expect(item.victim.fullName.startsWith(`${item.victim.surname} `)).toBe(true));
  });

  it('never creates a repeated component in a generated hyphenated surname', () => {
    for (let index = 0; index < 20000; index += 1) {
      const victim = generateCaseSlice(`hyphen-check-${index}`).victim;
      if (victim.hasHyphenatedSurname) {
        expect(victim.surnameParts).toHaveLength(2);
        expect(victim.surnameParts[0].toLocaleLowerCase()).not.toBe(victim.surnameParts[1].toLocaleLowerCase());
      }
    }
  });

  it('uses feminine Polish adjectival surname forms', () => {
    const matches = Array.from({ length: 50000 }, (_, index) => generateCaseSlice(`polish-name-${index}`))
      .filter(item => item.victim.countryId === 'poland' && item.victim.gender === 'female');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some(item => ['Kowalska', 'Wiśniewska'].includes(item.victim.surname))).toBe(true);
    expect(matches.every(item => !['Kowalski', 'Wiśniewski'].includes(item.victim.surname))).toBe(true);
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
