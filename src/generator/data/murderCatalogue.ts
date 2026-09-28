export interface MurderMethod {
  readonly name: string;
  readonly instruments: readonly MurderInstrument[];
}

export interface MurderInstrument {
  readonly name: string;
  readonly locations: readonly string[];
}

export interface CauseOfDeath {
  readonly name: string;
  readonly methods: readonly MurderMethod[];
}

const instrument = (name: string, ...locations: string[]): MurderInstrument => ({ name, locations });

export const causesOfDeath: readonly CauseOfDeath[] = [
  { name: 'Blunt-force trauma', methods: [
    { name: 'Struck with an object', instruments: [
      instrument('Hammer', 'Victim’s home', 'Perpetrator’s home', 'Workshop', 'Garage'),
      instrument('Candlestick', 'Victim’s home', 'Perpetrator’s home', 'Hotel', 'Restaurant'),
      instrument('Trophy', 'Victim’s home', 'Sports club', 'Office', 'School'),
      instrument('Frying pan', 'Victim’s kitchen', 'Perpetrator’s kitchen', 'Restaurant kitchen'),
      instrument('Garden gnome', 'Victim’s garden', 'Perpetrator’s garden', 'Garden centre'),
      instrument('Bowling ball', 'Bowling alley', 'Victim’s home', 'Sports club'),
      instrument('Fire extinguisher', 'Office', 'Hotel', 'Restaurant', 'Public building'),
    ]},
    { name: 'Beaten', instruments: [
      instrument('Baseball bat', 'Victim’s home', 'Perpetrator’s home', 'Sports club', 'Park'),
      instrument('Walking stick', 'Victim’s home', 'Perpetrator’s home', 'Hotel', 'Park'),
      instrument('None', 'Victim’s home', 'Perpetrator’s home', 'Street', 'Park'),
    ]},
  ]},
  { name: 'Sharp-force injury', methods: [
    { name: 'Stabbed', instruments: [
      instrument('Kitchen knife', 'Victim’s kitchen', 'Perpetrator’s kitchen', 'Restaurant kitchen'),
      instrument('Scissors', 'Victim’s home', 'Office', 'Salon', 'Workshop'),
      instrument('Letter opener', 'Office', 'Study', 'Hotel'),
      instrument('Broken bottle', 'Pub', 'Bar', 'Restaurant', 'Street'),
    ]},
    { name: 'Slashed', instruments: [
      instrument('Knife', 'Victim’s home', 'Perpetrator’s home', 'Street', 'Park'),
      instrument('Broken glass', 'Bar', 'Restaurant', 'Victim’s home', 'Hotel'),
    ]},
  ]},
  { name: 'Gunshot injury', methods: [
    { name: 'Shot', instruments: [
      instrument('Handgun', 'Victim’s home', 'Perpetrator’s home', 'Street', 'Office'),
      instrument('Shotgun', 'Victim’s home', 'Perpetrator’s home', 'Farm', 'Country estate'),
      instrument('Rifle', 'Country estate', 'Farm', 'Shooting club', 'Victim’s home'),
    ]},
  ]},
  { name: 'Strangulation', methods: [
    { name: 'Manual strangulation', instruments: [instrument('None', 'Victim’s home', 'Perpetrator’s home', 'Hotel room', 'Office')] },
    { name: 'Ligature strangulation', instruments: [
      instrument('Rope', 'Garage', 'Workshop', 'Victim’s home', 'Warehouse'),
      instrument('Electrical cord', 'Victim’s home', 'Office', 'Hotel room'),
      instrument('Belt', 'Victim’s home', 'Perpetrator’s home', 'Hotel room'),
      instrument('Curtain cord', 'Victim’s home', 'Hotel room'),
    ]},
  ]},
  { name: 'Suffocation', methods: [
    { name: 'Smothered', instruments: [
      instrument('Pillow', 'Victim’s bedroom', 'Perpetrator’s bedroom', 'Hotel room'),
      instrument('Cushion', 'Victim’s living room', 'Perpetrator’s living room', 'Hotel lounge'),
    ]},
    { name: 'Airway deliberately obstructed', instruments: [
      instrument('Plastic bag', 'Victim’s home', 'Perpetrator’s home', 'Office', 'Warehouse'),
      instrument('None', 'Victim’s home', 'Perpetrator’s home', 'Hotel room'),
    ]},
  ]},
  { name: 'Drowning', methods: [
    { name: 'Head forcibly submerged', instruments: [
      instrument('Bath', 'Victim’s bathroom', 'Perpetrator’s bathroom', 'Hotel bathroom'),
      instrument('Kitchen sink', 'Victim’s kitchen', 'Perpetrator’s kitchen', 'Restaurant kitchen'),
      instrument('Fish tank', 'Victim’s living room', 'Perpetrator’s living room', 'Pet shop', 'Aquarium shop', 'Restaurant with aquarium', 'Office with aquarium'),
    ]},
    { name: 'Deliberately submerged', instruments: [
      instrument('Swimming pool', 'Leisure centre', 'Hotel pool', 'Private swimming pool'),
      instrument('Pond', 'Park', 'Victim’s garden', 'Country estate'),
      instrument('Fountain', 'Public square', 'Hotel courtyard', 'Country estate'),
    ]},
  ]},
  { name: 'Poisoning', methods: [
    { name: 'Poisoned drink', instruments: [
      instrument('Poisoned drink', 'Victim’s home', 'Pub', 'Bar', 'Restaurant', 'Hotel'),
    ]},
    { name: 'Poisoned food', instruments: [
      instrument('Poisoned meal', 'Victim’s home', 'Restaurant', 'Hotel', 'Workplace canteen'),
    ]},
    { name: 'Deliberate overdose', instruments: [
      instrument('Medication', 'Victim’s home', 'Perpetrator’s home', 'Hotel room'),
    ]},
  ]},
  { name: 'Burns / fire', methods: [
    { name: 'Deliberately set alight', instruments: [
      instrument('Accelerant and ignition source', 'Victim’s home', 'Warehouse', 'Garage', 'Abandoned building'),
    ]},
    { name: 'Trapped in deliberately started fire', instruments: [
      instrument('Accelerant and ignition source', 'Victim’s home', 'Office', 'Warehouse', 'Hotel'),
    ]},
  ]},
  { name: 'Fatal fall', methods: [
    { name: 'Pushed from height', instruments: [
      instrument('None', 'Apartment balcony', 'Hotel balcony', 'Clifftop', 'Bridge', 'Rooftop', 'Theatre balcony'),
    ]},
    { name: 'Thrown from height', instruments: [
      instrument('None', 'Apartment balcony', 'Hotel balcony', 'Bridge', 'Rooftop'),
    ]},
    { name: 'Forced over an edge', instruments: [
      instrument('None', 'Clifftop', 'Bridge', 'Rooftop', 'Theatre balcony'),
    ]},
  ]},
] as const;
