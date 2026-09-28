import { describe, expect, it } from 'vitest';
import { generateCaseSlice } from './generateCase';

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

  it('does not claim validation has run', () => {
    expect(generateCaseSlice('validation-test').validation.status).toBe('not-run');
  });
});
