import type { GeneratedCaseSlice, MurderTruth } from './generateCase';

const locationPhrases: Readonly<Record<string, string>> = {
  'Victim’s home': 'at their home',
  'Perpetrator’s home': 'at the perpetrator’s home',
  'Victim’s kitchen': 'in their kitchen',
  'Perpetrator’s kitchen': 'in the perpetrator’s kitchen',
  'Victim’s garden': 'in their garden',
  'Perpetrator’s garden': 'in the perpetrator’s garden',
  'Victim’s bedroom': 'in their bedroom',
  'Perpetrator’s bedroom': 'in the perpetrator’s bedroom',
  'Victim’s living room': 'in their living room',
  'Perpetrator’s living room': 'in the perpetrator’s living room',
  'Victim’s bathroom': 'in their bathroom',
  'Perpetrator’s bathroom': 'in the perpetrator’s bathroom',
  Street: 'on a street',
  Park: 'in a park',
  Office: 'in an office',
  School: 'at a school',
  Workshop: 'in a workshop',
  Garage: 'in a garage',
  Hotel: 'at a hotel',
  Restaurant: 'at a restaurant',
  'Sports club': 'at a sports club',
  'Garden centre': 'at a garden centre',
  'Bowling alley': 'at a bowling alley',
  'Public building': 'in a public building',
  Salon: 'at a salon',
  Study: 'in a study',
  Pub: 'at a pub',
  Bar: 'at a bar',
  'Hotel room': 'in a hotel room',
  Warehouse: 'in a warehouse',
  'Hotel lounge': 'in a hotel lounge',
  'Restaurant kitchen': 'in a restaurant kitchen',
  'Pet shop': 'in a pet shop',
  'Aquarium shop': 'in an aquarium shop',
  'Restaurant with aquarium': 'at a restaurant with an aquarium',
  'Office with aquarium': 'in an office with an aquarium',
  'Leisure centre': 'at a leisure centre',
  'Hotel pool': 'in a hotel pool',
  'Private swimming pool': 'in a private swimming pool',
  Pond: 'in a pond',
  'Country estate': 'at a country estate',
  Fountain: 'in a fountain',
  'Public square': 'in a public square',
  'Hotel courtyard': 'in a hotel courtyard',
  Farm: 'at a farm',
  'Shooting club': 'at a shooting club',
  'Abandoned building': 'in an abandoned building',
  'Apartment balcony': 'from an apartment balcony',
  'Hotel balcony': 'from a hotel balcony',
  Clifftop: 'at a clifftop',
  Bridge: 'from a bridge',
  Rooftop: 'from a rooftop',
  'Theatre balcony': 'from a theatre balcony',
  'Workplace canteen': 'in a workplace canteen',
};

function lowerFirst(value: string): string {
  return value.length ? value[0]!.toLocaleLowerCase() + value.slice(1) : value;
}

function instrumentWithArticle(instrument: string): string {
  const lower = lowerFirst(instrument);
  const article = /^[aeiou]/i.test(lower) ? 'an' : 'a';
  return `${article} ${lower}`;
}

function methodPhrase(murder: MurderTruth): string {
  const instrument = murder.weaponOrInstrument;

  switch (murder.method) {
    case 'Struck with an object':
      return `was struck with ${instrumentWithArticle(instrument)}`;
    case 'Beaten':
      return instrument === 'None'
        ? 'was beaten to death'
        : `was beaten with ${instrumentWithArticle(instrument)}`;
    case 'Stabbed':
      return `was stabbed with ${instrumentWithArticle(instrument)}`;
    case 'Slashed':
      return `was fatally slashed with ${instrumentWithArticle(instrument)}`;
    case 'Shot':
      return `was shot with ${instrumentWithArticle(instrument)}`;
    case 'Manual strangulation':
      return 'was manually strangled';
    case 'Ligature strangulation':
      return `was strangled with ${instrumentWithArticle(instrument)}`;
    case 'Smothered':
      return `was smothered with ${instrumentWithArticle(instrument)}`;
    case 'Airway deliberately obstructed':
      return instrument === 'None'
        ? 'was killed by deliberate airway obstruction'
        : `was suffocated with ${instrumentWithArticle(instrument)}`;
    case 'Head forcibly submerged':
      return `was drowned by forced submersion in ${instrumentWithArticle(instrument)}`;
    case 'Deliberately submerged':
      return `was deliberately drowned in ${instrumentWithArticle(instrument)}`;
    case 'Poisoned drink':
      return 'was poisoned via a drink';
    case 'Poisoned food':
      return 'was poisoned via a meal';
    case 'Deliberate overdose':
      return 'was killed by a deliberate medication overdose';
    case 'Deliberately set alight':
      return 'was deliberately set alight';
    case 'Trapped in deliberately started fire':
      return 'was killed after being trapped in a deliberately started fire';
    case 'Pushed from height':
      return 'was pushed to their death';
    case 'Thrown from height':
      return 'was thrown to their death';
    case 'Forced over an edge':
      return 'was forced over an edge to their death';
    default:
      return `died by ${lowerFirst(murder.method)}`;
  }
}

function locationPhrase(location: string): string {
  return locationPhrases[location] ?? `at ${lowerFirst(location)}`;
}

export function formatDisplayDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return date;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function murderNarrative(generated: GeneratedCaseSlice): string {
  const death = generated.murder.timeOfDeath.exact;
  return `${generated.victim.fullName} ${methodPhrase(generated.murder)} ${locationPhrase(generated.murder.location)} on ${formatDisplayDate(death.localDate)} at ${death.localTime}.`;
}

export function estimatedDeathWindowLabel(generated: GeneratedCaseSlice): string {
  const { start, end } = generated.murder.timeOfDeath.estimatedWindow;
  if (start.localDate === end.localDate) {
    return `${formatDisplayDate(start.localDate)}, ${start.localTime}–${end.localTime}`;
  }
  return `${formatDisplayDate(start.localDate)} ${start.localTime} – ${formatDisplayDate(end.localDate)} ${end.localTime}`;
}
