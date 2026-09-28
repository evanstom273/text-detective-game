import { describe, expect, it } from 'vitest';
import { countries, surnamesFor } from './data/nameCatalogue';
import { generateCaseSlice } from './generateCase';

describe('name generation rules', () => {
  it('keeps the initial catalogue at exactly 32 countries', () => {
    expect(countries).toHaveLength(32);
  });

  it('uses gender-aware Russian surname forms', () => {
    const russia = countries.find((country) => country.id === 'russia');
    expect(russia).toBeDefined();
    const maleSurnames = surnamesFor(russia!, 'male');
    const femaleSurnames = surnamesFor(russia!, 'female');
    expect(maleSurnames).toHaveLength(100);
    expect(femaleSurnames).toHaveLength(100);
    expect(maleSurnames).toEqual(expect.arrayContaining(['Ivanov', 'Smirnov', 'Kuznetsov']));
    expect(femaleSurnames).toEqual(expect.arrayContaining(['Ivanova', 'Smirnova', 'Kuznetsova']));
  });

  it('never generates identical given names and surname components in a large deterministic sample', () => {
    for (let index = 0; index < 10000; index += 1) {
      const victim = generateCaseSlice(`duplicate-check-${index}`).victim;
      victim.surnameParts.forEach(surname => {
        expect(victim.givenName.toLocaleLowerCase()).not.toBe(surname.toLocaleLowerCase());
      });
    }
  });
});
