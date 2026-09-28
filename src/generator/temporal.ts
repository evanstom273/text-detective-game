import { choose, randomInteger } from './random';
import { timeZonesByCountry } from './data/timeZoneCatalogue';
import type { NamePoolCountryId } from './data/namePools';

export const WORLD_EPOCH_DATE = '2026-01-01';
export const DEFAULT_WORKBENCH_END_DATE = '2035-12-31';

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;
const TOD_WINDOW_CHOICES = [10, 15, 20, 30, 45, 60] as const;

interface CivilDateTimeParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
}

export interface ZonedMoment {
  readonly utcIso: string;
  readonly localIso: string;
  readonly localDate: string;
  readonly localTime: string;
  readonly offset: string;
  readonly timeZone: string;
}

export interface DeathTimeTruth {
  readonly timeZone: string;
  readonly exact: ZonedMoment;
  readonly estimatedWindow: {
    readonly start: ZonedMoment;
    readonly end: ZonedMoment;
    readonly beforeMinutes: number;
    readonly afterMinutes: number;
  };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function dateOnlyIso(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function timeOnlyIso(hour: number, minute: number): string {
  return `${pad(hour)}:${pad(minute)}`;
}

function parseDateOnly(value: string): { year: number; month: number; day: number } {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) throw new Error(`Invalid date: ${value}`);
  return { year, month, day };
}

function dateOnlyMs(value: string): number {
  const { year, month, day } = parseDateOnly(value);
  return Date.UTC(year, month - 1, day);
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  formatterCache.set(timeZone, formatter);
  return formatter;
}

function partsAtInstant(instantMs: number, timeZone: string): CivilDateTimeParts {
  const formatter = formatterFor(timeZone);
  const values = Object.fromEntries(
    formatter.formatToParts(new Date(instantMs))
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, Number(part.value)]),
  );

  return {
    year: values.year!,
    month: values.month!,
    day: values.day!,
    hour: values.hour!,
    minute: values.minute!,
  };
}

function sameCivil(a: CivilDateTimeParts, b: CivilDateTimeParts): boolean {
  return a.year === b.year
    && a.month === b.month
    && a.day === b.day
    && a.hour === b.hour
    && a.minute === b.minute;
}

function offsetMinutesAtInstant(instantMs: number, timeZone: string): number {
  const parts = partsAtInstant(instantMs, timeZone);
  const representedAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
  const instantRoundedToMinute = Math.floor(instantMs / MINUTE_MS) * MINUTE_MS;
  return Math.round((representedAsUtc - instantRoundedToMinute) / MINUTE_MS);
}

function formatOffset(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const absolute = Math.abs(offsetMinutes);
  return `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
}

function findInstantForCivil(parts: CivilDateTimeParts, timeZone: string): number | null {
  const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
  let guess = localAsUtc;

  for (let index = 0; index < 4; index += 1) {
    const offsetMinutes = offsetMinutesAtInstant(guess, timeZone);
    const next = localAsUtc - offsetMinutes * MINUTE_MS;
    if (next === guess) break;
    guess = next;
  }

  if (sameCivil(partsAtInstant(guess, timeZone), parts)) return guess;

  // Ambiguous DST clock times can map to two instants. Search a bounded window
  // and pick the earlier valid instant deterministically.
  for (let offset = -180; offset <= 180; offset += 1) {
    const candidate = guess + offset * MINUTE_MS;
    if (sameCivil(partsAtInstant(candidate, timeZone), parts)) return candidate;
  }

  return null;
}

function resolveCivilDateTime(parts: CivilDateTimeParts, timeZone: string): number {
  const base = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);

  // During a spring-forward gap a local clock time may not exist. Advance to
  // the first valid civil minute rather than creating an impossible timestamp.
  for (let shift = 0; shift <= 180; shift += 1) {
    const shifted = new Date(base + shift * MINUTE_MS);
    const candidate: CivilDateTimeParts = {
      year: shifted.getUTCFullYear(),
      month: shifted.getUTCMonth() + 1,
      day: shifted.getUTCDate(),
      hour: shifted.getUTCHours(),
      minute: shifted.getUTCMinutes(),
    };
    const resolved = findInstantForCivil(candidate, timeZone);
    if (resolved !== null) return resolved;
  }

  throw new Error(`Could not resolve local time in ${timeZone}.`);
}

export function zonedMoment(instantMs: number, timeZone: string): ZonedMoment {
  const parts = partsAtInstant(instantMs, timeZone);
  const offset = formatOffset(offsetMinutesAtInstant(instantMs, timeZone));
  const localDate = dateOnlyIso(parts.year, parts.month, parts.day);
  const localTime = timeOnlyIso(parts.hour, parts.minute);

  return {
    utcIso: new Date(instantMs).toISOString(),
    localIso: `${localDate}T${localTime}${offset}`,
    localDate,
    localTime,
    offset,
    timeZone,
  };
}

export function generateDeathTime(
  countryId: NamePoolCountryId,
  random: () => number,
  earliestDate = WORLD_EPOCH_DATE,
  latestDate = DEFAULT_WORKBENCH_END_DATE,
): DeathTimeTruth {
  const startMs = dateOnlyMs(earliestDate);
  const endMs = dateOnlyMs(latestDate);
  if (endMs < startMs) throw new Error('Death date range ends before it begins.');

  const dayOffset = randomInteger(0, Math.floor((endMs - startMs) / DAY_MS), random);
  const date = new Date(startMs + dayOffset * DAY_MS);
  const minuteOfDay = randomInteger(0, 1439, random);
  const timeZone = choose(timeZonesByCountry[countryId], random);
  const civil: CivilDateTimeParts = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: Math.floor(minuteOfDay / 60),
    minute: minuteOfDay % 60,
  };
  const exactMs = resolveCivilDateTime(civil, timeZone);
  const beforeMinutes = choose(TOD_WINDOW_CHOICES, random);
  const afterMinutes = choose(TOD_WINDOW_CHOICES, random);

  return {
    timeZone,
    exact: zonedMoment(exactMs, timeZone),
    estimatedWindow: {
      start: zonedMoment(exactMs - beforeMinutes * MINUTE_MS, timeZone),
      end: zonedMoment(exactMs + afterMinutes * MINUTE_MS, timeZone),
      beforeMinutes,
      afterMinutes,
    },
  };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function anniversaryMs(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, Math.min(day, daysInMonth(year, month)));
}

export function generateDateOfBirth(
  ageAtDeath: number,
  deathLocalDate: string,
  random: () => number,
): string {
  const death = parseDateOnly(deathLocalDate);
  const latest = anniversaryMs(death.year - ageAtDeath, death.month, death.day);
  const previousAnniversary = anniversaryMs(death.year - ageAtDeath - 1, death.month, death.day);
  const earliest = previousAnniversary + DAY_MS;
  const availableDays = Math.floor((latest - earliest) / DAY_MS);
  const chosen = new Date(earliest + randomInteger(0, availableDays, random) * DAY_MS);

  return dateOnlyIso(chosen.getUTCFullYear(), chosen.getUTCMonth() + 1, chosen.getUTCDate());
}

export function ageOnDate(dateOfBirth: string, onDate: string): number {
  const birth = parseDateOnly(dateOfBirth);
  const current = parseDateOnly(onDate);
  let age = current.year - birth.year;
  const birthdayThisYear = anniversaryMs(current.year, birth.month, birth.day);
  const currentMs = Date.UTC(current.year, current.month - 1, current.day);
  if (currentMs < birthdayThisYear) age -= 1;
  return age;
}
