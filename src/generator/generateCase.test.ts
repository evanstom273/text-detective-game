import { describe, expect, it } from 'vitest';
import { generateCaseSlice } from './generateCase';
import { causesOfDeath } from './data/murderCatalogue';

describe('generateCaseSlice', () => {
  it('is deterministic for the same seed', () => {
    expect(generateCaseSlice('same-seed')).toEqual(generateCaseSlice('same-seed'));
  });

  it('generates a complete victim identity from catalogue data', () => {
    const generated = generateCaseSlice('victim-test');
    expect(generated.victim.fullName).toBe(`${generated.victim.firstName} ${generated.victim.surname}`);
    expect(generated.victim.countryName.length).toBeGreaterThan(0);
    expect(generated.victim.continentName.length).toBeGreaterThan(0);
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
