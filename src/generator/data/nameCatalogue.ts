export type Gender = 'male' | 'female';

export type Continent =
  | 'north-america'
  | 'south-america'
  | 'europe'
  | 'asia'
  | 'africa'
  | 'oceania';

export type SurnameData =
  | readonly string[]
  | Readonly<Record<Gender, readonly string[]>>;

export interface CountryNameData {
  readonly id: string;
  readonly name: string;
  readonly continent: Continent;
  readonly firstNames: Readonly<Record<Gender, readonly string[]>>;
  readonly surnames: SurnameData;
}

export const continentNames: Readonly<Record<Continent, string>> = {
  'north-america': 'North America',
  'south-america': 'South America',
  europe: 'Europe',
  asia: 'Asia',
  africa: 'Africa',
  oceania: 'Oceania',
};

export const countries: readonly CountryNameData[] = [
  { id: 'united-states', name: 'United States', continent: 'north-america', firstNames: { male: ['James', 'Michael', 'Ethan'], female: ['Emily', 'Olivia', 'Sophia'] }, surnames: ['Smith', 'Johnson', 'Williams'] },
  { id: 'canada', name: 'Canada', continent: 'north-america', firstNames: { male: ['Liam', 'Noah', 'William'], female: ['Charlotte', 'Emma', 'Olivia'] }, surnames: ['Martin', 'Roy', 'Wilson'] },
  { id: 'mexico', name: 'Mexico', continent: 'north-america', firstNames: { male: ['Santiago', 'Mateo', 'Diego'], female: ['Sofía', 'Valentina', 'Camila'] }, surnames: ['García', 'Hernández', 'Martínez'] },

  { id: 'brazil', name: 'Brazil', continent: 'south-america', firstNames: { male: ['João', 'Gabriel', 'Lucas'], female: ['Ana', 'Beatriz', 'Mariana'] }, surnames: ['Silva', 'Santos', 'Oliveira'] },
  { id: 'colombia', name: 'Colombia', continent: 'south-america', firstNames: { male: ['Santiago', 'Sebastián', 'Mateo'], female: ['Valentina', 'Mariana', 'Isabella'] }, surnames: ['Rodríguez', 'Gómez', 'Martínez'] },
  { id: 'argentina', name: 'Argentina', continent: 'south-america', firstNames: { male: ['Mateo', 'Santiago', 'Tomás'], female: ['Sofía', 'Valentina', 'Martina'] }, surnames: ['González', 'Rodríguez', 'Fernández'] },
  { id: 'chile', name: 'Chile', continent: 'south-america', firstNames: { male: ['Benjamín', 'Vicente', 'Matías'], female: ['Sofía', 'Isidora', 'Antonia'] }, surnames: ['González', 'Muñoz', 'Rojas'] },

  { id: 'united-kingdom', name: 'United Kingdom', continent: 'europe', firstNames: { male: ['Oliver', 'George', 'Jack'], female: ['Olivia', 'Amelia', 'Isla'] }, surnames: ['Smith', 'Jones', 'Taylor'] },
  { id: 'ireland', name: 'Ireland', continent: 'europe', firstNames: { male: ['Seán', 'Cian', 'Oisín'], female: ['Aoife', 'Niamh', 'Saoirse'] }, surnames: ['Murphy', 'Kelly', 'O’Brien'] },
  { id: 'france', name: 'France', continent: 'europe', firstNames: { male: ['Louis', 'Gabriel', 'Jules'], female: ['Emma', 'Louise', 'Chloé'] }, surnames: ['Martin', 'Bernard', 'Dubois'] },
  { id: 'germany', name: 'Germany', continent: 'europe', firstNames: { male: ['Leon', 'Lukas', 'Felix'], female: ['Emma', 'Mia', 'Hannah'] }, surnames: ['Müller', 'Schmidt', 'Schneider'] },
  { id: 'italy', name: 'Italy', continent: 'europe', firstNames: { male: ['Lorenzo', 'Matteo', 'Alessandro'], female: ['Giulia', 'Sofia', 'Aurora'] }, surnames: ['Rossi', 'Russo', 'Ferrari'] },
  { id: 'poland', name: 'Poland', continent: 'europe', firstNames: { male: ['Jakub', 'Jan', 'Piotr'], female: ['Zuzanna', 'Julia', 'Maja'] }, surnames: ['Nowak', 'Kowalski', 'Wiśniewski'] },
  { id: 'spain', name: 'Spain', continent: 'europe', firstNames: { male: ['Hugo', 'Mateo', 'Alejandro'], female: ['Lucía', 'Sofía', 'Martina'] }, surnames: ['García', 'Fernández', 'González'] },
  { id: 'portugal', name: 'Portugal', continent: 'europe', firstNames: { male: ['João', 'Tiago', 'Afonso'], female: ['Maria', 'Leonor', 'Beatriz'] }, surnames: ['Silva', 'Santos', 'Ferreira'] },
  { id: 'russia', name: 'Russia', continent: 'europe', firstNames: { male: ['Aleksandr', 'Dmitri', 'Mikhail'], female: ['Anna', 'Sofia', 'Ekaterina'] }, surnames: { male: ['Ivanov', 'Smirnov', 'Kuznetsov'], female: ['Ivanova', 'Smirnova', 'Kuznetsova'] } },

  { id: 'japan', name: 'Japan', continent: 'asia', firstNames: { male: ['Haruto', 'Ren', 'Yuto'], female: ['Yui', 'Aoi', 'Hina'] }, surnames: ['Satō', 'Suzuki', 'Takahashi'] },
  { id: 'south-korea', name: 'South Korea', continent: 'asia', firstNames: { male: ['Min-jun', 'Seo-jun', 'Ji-ho'], female: ['Seo-yeon', 'Ji-woo', 'Ha-yoon'] }, surnames: ['Kim', 'Lee', 'Park'] },
  { id: 'china', name: 'China', continent: 'asia', firstNames: { male: ['Wei', 'Jun', 'Hao'], female: ['Mei', 'Xinyi', 'Jing'] }, surnames: ['Wang', 'Li', 'Zhang'] },
  { id: 'india', name: 'India', continent: 'asia', firstNames: { male: ['Arjun', 'Rahul', 'Vikram'], female: ['Ananya', 'Priya', 'Kavya'] }, surnames: ['Sharma', 'Patel', 'Singh'] },
  { id: 'thailand', name: 'Thailand', continent: 'asia', firstNames: { male: ['Anan', 'Niran', 'Kittisak'], female: ['Siriporn', 'Kanya', 'Pimchanok'] }, surnames: ['Saetang', 'Srisuk', 'Boonmee'] },
  { id: 'turkey', name: 'Turkey', continent: 'asia', firstNames: { male: ['Mehmet', 'Emre', 'Kerem'], female: ['Zeynep', 'Elif', 'Defne'] }, surnames: ['Yılmaz', 'Kaya', 'Demir'] },

  { id: 'nigeria', name: 'Nigeria', continent: 'africa', firstNames: { male: ['Chinedu', 'Tunde', 'Emeka'], female: ['Adaeze', 'Ngozi', 'Yetunde'] }, surnames: ['Okafor', 'Adeyemi', 'Balogun'] },
  { id: 'egypt', name: 'Egypt', continent: 'africa', firstNames: { male: ['Ahmed', 'Omar', 'Youssef'], female: ['Mariam', 'Nour', 'Salma'] }, surnames: ['Hassan', 'Mahmoud', 'Ibrahim'] },
  { id: 'south-africa', name: 'South Africa', continent: 'africa', firstNames: { male: ['Thabo', 'Sipho', 'Liam'], female: ['Naledi', 'Zanele', 'Amahle'] }, surnames: ['Dlamini', 'Nkosi', 'Botha'] },
  { id: 'ghana', name: 'Ghana', continent: 'africa', firstNames: { male: ['Kwame', 'Kofi', 'Kojo'], female: ['Akosua', 'Ama', 'Abena'] }, surnames: ['Mensah', 'Owusu', 'Boateng'] },
  { id: 'kenya', name: 'Kenya', continent: 'africa', firstNames: { male: ['Kamau', 'Otieno', 'Kiptoo'], female: ['Wanjiku', 'Akinyi', 'Njeri'] }, surnames: ['Mwangi', 'Omondi', 'Kiptoo'] },
  { id: 'uganda', name: 'Uganda', continent: 'africa', firstNames: { male: ['Kato', 'Mugisha', 'Okello'], female: ['Nabirye', 'Achen', 'Namukasa'] }, surnames: ['Okello', 'Kato', 'Ssemanda'] },

  { id: 'australia', name: 'Australia', continent: 'oceania', firstNames: { male: ['Oliver', 'Jack', 'Noah'], female: ['Charlotte', 'Amelia', 'Isla'] }, surnames: ['Smith', 'Williams', 'Brown'] },
  { id: 'new-zealand', name: 'New Zealand', continent: 'oceania', firstNames: { male: ['Oliver', 'Noah', 'Wiremu'], female: ['Isla', 'Amelia', 'Aroha'] }, surnames: ['Smith', 'Williams', 'Wilson'] },
  { id: 'samoa', name: 'Samoa', continent: 'oceania', firstNames: { male: ['Tavita', 'Sione', 'Malaki'], female: ['Litia', 'Mele', 'Sina'] }, surnames: ['Tuala', 'Fepulea’i', 'Leota'] },
  { id: 'papua-new-guinea', name: 'Papua New Guinea', continent: 'oceania', firstNames: { male: ['Kila', 'Tari', 'Wari'], female: ['Kuri', 'Meri', 'Lani'] }, surnames: ['Kidu', 'Somare', 'Temu'] },
] as const;

function hasGenderedSurnames(
  surnames: SurnameData,
): surnames is Readonly<Record<Gender, readonly string[]>> {
  return !Array.isArray(surnames);
}

export function surnamesFor(country: CountryNameData, gender: Gender): readonly string[] {
  return hasGenderedSurnames(country.surnames)
    ? country.surnames[gender]
    : country.surnames;
}

export const countriesByContinent: Readonly<Record<Continent, readonly CountryNameData[]>> = {
  'north-america': countries.filter((country) => country.continent === 'north-america'),
  'south-america': countries.filter((country) => country.continent === 'south-america'),
  europe: countries.filter((country) => country.continent === 'europe'),
  asia: countries.filter((country) => country.continent === 'asia'),
  africa: countries.filter((country) => country.continent === 'africa'),
  oceania: countries.filter((country) => country.continent === 'oceania'),
};
