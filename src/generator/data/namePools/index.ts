import { northAmericaNamePools } from './northAmerica';
import { southAmericaNamePools } from './southAmerica';
import { europeWestNamePools } from './europeWest';
import { europeSouthEastNamePools } from './europeSouthEast';
import { russiaNamePool } from './russia';
import { eastAsiaNamePools } from './eastAsia';
import { southWestAsiaNamePools } from './southWestAsia';
import { africaNamePools } from './africa';
import { australiaNewZealandNamePools } from './australiaNewZealand';
import { samoaPapuaNewGuineaNamePools } from './samoaPapuaNewGuinea';

export const namePools = {
  ...northAmericaNamePools,
  ...southAmericaNamePools,
  ...europeWestNamePools,
  ...europeSouthEastNamePools,
  russia: russiaNamePool,
  ...eastAsiaNamePools,
  ...southWestAsiaNamePools,
  ...africaNamePools,
  ...australiaNewZealandNamePools,
  ...samoaPapuaNewGuineaNamePools,
} as const;

export type NamePoolCountryId = keyof typeof namePools;
