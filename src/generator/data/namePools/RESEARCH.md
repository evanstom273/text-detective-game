# Naming research notes

This file records the sources used to shape the V0 naming rules. The generator does **not** treat nationality as ethnicity, religion or ancestry. Where a country contains several naming systems, V0 uses a broad mixed catalogue and records the limitation rather than inventing a single "national" rule.

The 50/50/100 pools are intentionally **not frequency-weighted**. Official statistics and civil-registration guidance were used where available; broader reference data was used to widen the catalogue when an official top-100 list was not available.

| Country | Structural conclusion used in V0 | Research basis |
| --- | --- | --- |
| United States | Given name + surname; optional generated hyphenated family name | US Census Bureau name-frequency data: https://www.census.gov/topics/population/genealogy/data.html |
| Canada | Given name + surname; optional generated hyphenated family name | Statistics Canada first-name data: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710014701 |
| Mexico | Given name + two family-name components | HMPO Mexico profile: https://www.gov.uk/government/publications/mexico-knowledge-base-profile/mexico-knowledge-base-profile |
| Brazil | Given name + maternal/paternal family-name components | Brazilian Civil Records Act and HMPO Brazil profile: https://www.gov.uk/government/publications/brazil-knowledge-base-profile/brazil-knowledge-base-profile |
| Colombia | Given name + father/mother surname components | HMPO Colombia profile: https://www.gov.uk/government/publications/colombia-knowledge-base-profile/colombia-knowledge-base-profile |
| Argentina | Given name + surname; second parental surname may also be used | Argentina Civil and Commercial Code guidance: https://www.argentina.gob.ar/justicia/derechofacil/leysimple/nombre-de-las-personas |
| Chile | Given name + father/mother surname components | HMPO Chile profile: https://www.gov.uk/government/publications/chile-knowledge-base-profile/chile-knowledge-base-profile |
| United Kingdom | Given name + surname; optional generated hyphenated family name | ONS baby-name data: https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths/datasets/babynamesinenglandandwalesfrom1996/1996tocurrent |
| Ireland | Given name + surname; Irish spellings retained | CSO baby-name and surname data: https://www.cso.ie/en/statistics/birthsdeathsandmarriages/irishbabiesnames/ |
| France | Given name + surname; limited multi-surname support | INSEE first-name data: https://www.insee.fr/fr/statistiques/8595130 |
| Germany | Given name + surname in V0 | HMPO Germany profile: https://www.gov.uk/government/publications/germany-knowledge-base-profile/germany-knowledge-base-profile |
| Italy | Given name + surname in V0 | HMPO Italy profile: https://www.gov.uk/government/publications/italy-knowledge-base-profile/italy-knowledge-base-profile |
| Poland | Given name + gender-appropriate surname form; double surnames may be hyphenated | HMPO Poland profile: https://www.gov.uk/government/publications/poland-knowledge-base-profile/poland-knowledge-base-profile |
| Spain | Given name + two surname components; no generated hyphen between the two legal surnames | HMPO Spain profile: https://www.gov.uk/government/publications/spain-knowledge-base-profile/spain-knowledge-base-profile |
| Portugal | Given name + maternal/paternal surname components | HMPO Portugal profile: https://www.gov.uk/government/publications/portugal-knowledge-base-profile/portugal-knowledge-base-profile |
| Russia | Given name + patronymic + gender-appropriate surname | HMPO Russia profile: https://www.gov.uk/government/publications/russia-knowledge-base-profile/russia-knowledge-base-profile |
| Japan | Family name first in game display; no generated middle name | Japan Agency for Cultural Affairs surname-first romanisation guidance: https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kakuki/22/tosin04/17.html |
| South Korea | Family name first; given-name syllables may be hyphenated; no middle name | National Institute of Korean Language romanisation guidance: https://www.korean.go.kr/front_eng/roman/roman_01.do |
| China | Family name first | HMPO China profile: https://www.gov.uk/government/publications/china-knowledge-base-profile/china-knowledge-base-profile |
| India | V0 uses a broad mixed given-name/surname profile and does not pretend there is one Indian naming system | HMPO India profile documents distinct Hindu, Muslim and Sikh conventions: https://www.gov.uk/government/publications/india-knowledge-base-profile/india-knowledge-base-profile |
| Thailand | One given name + one surname in V0 | HMPO Thailand profile: https://www.gov.uk/government/publications/thailand-knowledge-base-profile/thailand-knowledge-base-profile |
| Turkey | One generated given name + surname in V0; diacritics retained | HMPO Turkey profile: https://www.gov.uk/government/publications/turkey-knowledge-base-profile/turkey-knowledge-base-profile |
| Nigeria | Broad mixed personal-name/surname profile; nationality is not used as a proxy for ethnicity or religion | HMPO Nigeria profile: https://www.gov.uk/government/publications/nigeria-knowledge-base-profile/nigeria-knowledge-base-profile |
| Egypt | Personal name + father + grandfather + family surname | HMPO Egypt profile: https://www.gov.uk/government/publications/egypt-knowledge-base-profile/egypt-knowledge-base-profile |
| South Africa | Broad mixed given-name/surname profile | HMPO South Africa profile: https://www.gov.uk/government/publications/south-africa-knowledge-base-profile/south-africa-knowledge-base-profile |
| Ghana | Broad mixed profile including Akan day names | HMPO Ghana profile: https://www.gov.uk/government/publications/ghana-knowledge-base-profile/ghana-knowledge-base-profile |
| Kenya | Given name + middle/tribal name + surname | HMPO Kenya profile: https://www.gov.uk/government/publications/kenya-knowledge-base-profile/kenya-knowledge-base-profile |
| Uganda | Given-name-first display chosen for the game; source notes official documents can vary in order | HMPO Uganda profile: https://www.gov.uk/government/publications/uganda-knowledge-base-profile/uganda-knowledge-base-profile |
| Australia | Broad mixed profile; optional procedurally composed double-barrelled surname | HMPO Australia profile: https://www.gov.uk/government/publications/australia-knowledge-base-profile/australia-knowledge-base-profile |
| New Zealand | One or more forenames + surname; optional generated hyphenated surname in V0 | HMPO New Zealand profile: https://www.gov.uk/government/publications/new-zealand-knowledge-base-profile/new-zealand-knowledge-base-profile |
| Samoa | Given name + modern surname in V0; titles are not treated as surnames | FamilySearch Samoan naming guidance: https://www.familysearch.org/en/help/helpcenter/article/how-to-enter-samoan-names-into-family-tree and Gagana Sāmoa orthography guidance: https://mpia.govt.nz/assets/Resources/Orthography-guidelines/gagana-samoa-orthography-guidelines.pdf |
| Papua New Guinea | One or more forenames + surname in V0 | HMPO Papua New Guinea profile: https://www.gov.uk/government/publications/papua-new-guinea-knowledge-base-profile/papua-new-guinea-knowledge-base-profile |

## Important limits

- These rules are a **V0 identity generator**, not an ethnographic model.
- A person's country currently selects a naming catalogue. Later world generation can separate nationality/residence from heritage, language, religion and family naming tradition.
- The generator deliberately avoids frequency weighting for now. Equal-choice pools make stress testing easier and stop highly common names from drowning out rarer but plausible names.
- Multi-surname generation is structural. The generated components become canonical facts that future family generation must respect.
