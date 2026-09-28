import { describe, expect, it } from 'vitest';
import { countries, surnamesFor } from './data/nameCatalogue';
import { generateCaseSlice } from './generateCase';

describe('name generation rules', () => {
  it('keeps the initial catalogue at exactly 32 countries', () => {
    expect(countries).toHaveLength(32);
    expect(countries.some((country) => country.id === 'indonesia')).toBe(false);
  });

  it('uses gender-aware Russian surname forms', () => {
    const russia = countries.find((country) => country.id === 'russia');
    expect(russia).toBeDefined();
    expect(surnamesFor(russia!, 'male')).toEqual(['Ivanov', 'Smirnov', 'Kuznetsov']);
    expect(surnamesFor(russia!, 'female')).toEqual(['Ivanova', 'Smirnova', 'Kuznetsova']);
  });

  it('never generates identical first and surnames in a large deterministic sample', () => {
    for (let index = 0; index < 10000; index += 1) {
      const victim = generateCaseSlice(`duplicate-check-${index}`).victim;
      expect(victim.firstName.toLocaleLowerCase()).not.toBe(victim.surname.toLocaleLowerCase());
    }
  });
});
