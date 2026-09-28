import { describe, expect, it } from 'vitest';
import { generateCaseSlice } from './generateCase';
import { countries } from './data/nameCatalogue';
import { timeZonesByCountry } from './data/timeZoneCatalogue';
import { ageOnDate, DEFAULT_WORKBENCH_END_DATE, WORLD_EPOCH_DATE } from './temporal';

describe('timezone catalogue', () => {
  it('covers every supported country with valid IANA timezone identifiers', () => {
    expect(Object.keys(timeZonesByCountry)).toHaveLength(32);

    for (const country of countries) {
      const zones = timeZonesByCountry[country.id];
      expect(zones.length, country.name).toBeGreaterThan(0);

      for (const zone of zones) {
        expect(() => new Intl.DateTimeFormat('en-GB', { timeZone: zone }).format(new Date(0))).not.toThrow();
      }
    }
  });
});

describe('case chronology', () => {
  it('generates deterministic death datetimes from 1 January 2026 onward', () => {
    const first = generateCaseSlice('chronology-determinism');
    const second = generateCaseSlice('chronology-determinism');
    expect(first.murder.timeOfDeath).toEqual(second.murder.timeOfDeath);
    expect(first.victim.dateOfBirth).toBe(second.victim.dateOfBirth);
  });

  it('keeps dates, timezones, age, and estimated TOD windows internally consistent', () => {
    let sawWindowCrossDateBoundary = false;
    let sawNonUtcOffset = false;

    for (let index = 0; index < 10000; index += 1) {
      const generated = generateCaseSlice(`chronology-stress-${index}`);
      const death = generated.murder.timeOfDeath;
      const exactMs = Date.parse(death.exact.utcIso);
      const startMs = Date.parse(death.estimatedWindow.start.utcIso);
      const endMs = Date.parse(death.estimatedWindow.end.utcIso);

      expect(death.exact.localDate >= WORLD_EPOCH_DATE).toBe(true);
      expect(death.exact.localDate <= DEFAULT_WORKBENCH_END_DATE).toBe(true);
      expect(timeZonesByCountry[generated.victim.countryId as keyof typeof timeZonesByCountry]).toContain(death.timeZone);
      expect(startMs).toBeLessThanOrEqual(exactMs);
      expect(endMs).toBeGreaterThanOrEqual(exactMs);
      expect(death.estimatedWindow.beforeMinutes).toBeGreaterThan(0);
      expect(death.estimatedWindow.afterMinutes).toBeGreaterThan(0);
      expect(ageOnDate(generated.victim.dateOfBirth, death.exact.localDate)).toBe(generated.victim.age);
      expect(generated.victim.dateOfBirth < death.exact.localDate).toBe(true);

      if (death.estimatedWindow.start.localDate !== death.estimatedWindow.end.localDate) {
        sawWindowCrossDateBoundary = true;
      }
      if (death.exact.offset !== '+00:00') {
        sawNonUtcOffset = true;
      }
    }

    expect(sawWindowCrossDateBoundary).toBe(true);
    expect(sawNonUtcOffset).toBe(true);
  }, 120000);

  it('produces valid local ISO timestamps including their UTC offsets', () => {
    for (let index = 0; index < 2000; index += 1) {
      const exact = generateCaseSlice(`local-iso-${index}`).murder.timeOfDeath.exact;
      expect(exact.localIso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      expect(exact.localTime).toMatch(/^\d{2}:\d{2}$/);
    }
  }, 30000);
});
