# Naming data and conventions

This directory contains the V0 country-aware identity catalogue used by the seeded case generator.

## Data target

Every one of the 32 supported countries has:

- 50 male given names
- 50 female given names
- 100 surname entries or 100 gender-specific surname forms
- deterministic equal-choice generation within each relevant pool

The catalogue is intentionally broad rather than frequency-weighted. A name appearing in a pool means it is a supported plausible option, not that the generator is claiming the name has the same real-world prevalence as every other entry.

## Structural rules

The generator stores a display name and its underlying components separately. This is deliberate: future family generation can reason about inherited surname components instead of parsing a rendered string.

Current country-aware structures include:

| Country / group | V0 structure |
| --- | --- |
| United States, Canada, United Kingdom, Ireland, Australia, New Zealand | Given name + surname, with a small seeded chance of a procedurally composed hyphenated surname |
| Mexico, Colombia, Chile, Spain | Given name + two distinct surname components, rendered space-separated |
| Brazil, Portugal | Given name + two distinct surname components, rendered space-separated |
| Argentina | Given name + one surname or two surname components |
| France | Given name + surname; generated multiple surnames may be space-separated or hyphenated |
| Germany | Given name + surname |
| Italy | Given name + surname |
| Poland | Given name + surname; gendered adjectival surname forms are stored separately, with a small chance of a hyphenated compound surname |
| Russia | Given name + gender-appropriate patronymic + gender-appropriate surname |
| Japan, South Korea, China | Family name first, followed by given name |
| Egypt | Given name + father's given name + grandfather's given name + family surname |
| India | Given name + surname in V0; the pool deliberately spans several naming communities rather than pretending India has one universal national naming system |
| Nigeria, South Africa, Ghana, Uganda | Given name + surname in V0; pools deliberately include multiple linguistic, regional and/or religious naming traditions |
| Kenya | Given name + middle/tribal name + surname |
| Thailand, Turkey, Samoa, Papua New Guinea | Given name + surname in V0 |

## Research approach

Naming *structure* was checked against government, civil-registration, national-statistics, language/cultural, or other authoritative references where available. Examples include:

- US Census Bureau name data
- Statistics Canada name data
- UK Office for National Statistics baby-name data
- Central Statistics Office Ireland baby-name and surname data
- civil-registration / government guidance for Mexico, Colombia, Argentina, Chile, France, Germany, Spain and Portugal
- Polish surname-form references and Polish government/language guidance
- Russian family-name and patronymic conventions
- official or government-backed romanisation / cultural guidance for Korean, Japanese and Chinese name order
- government knowledge-base material covering India's varied naming conventions
- Egyptian personal-name lineage conventions

Surname and given-name pool curation also uses broad public name/surname reference data where a complete official top-100 dataset is not available.

The catalogue is not intended to claim that nationality determines ethnicity, religion, language or naming tradition. Countries such as India, Nigeria, South Africa, Kenya, Uganda, Canada, the United States, the United Kingdom, Australia, New Zealand and Papua New Guinea contain many naming systems. V0 uses broad mixed pools; future world-generation work can split naming profile / heritage from residence or nationality if the simulation needs that distinction.

## Composition rules

Multiple surnames are generated from two distinct catalogue surname components. They are never stored as a finite list of preconstructed combinations unless the name itself is an established surname entry.

This means a configured hyphenated-name country can generate, for example:

- Smith-Jones
- Jones-Wilson
- Wilson-Taylor

without needing every possible pair in the data.

Countries whose ordinary multi-surname convention is not a British-style double-barrelled surname use a space rather than being forced through the hyphenation rule.

## Data-quality invariants

Tests enforce:

- exactly 32 countries
- exactly 50 male and 50 female given names per country
- exactly 100 surname choices/forms per gender
- no duplicate entries inside a pool
- deterministic generation
- distinct components in generated multiple surnames
- family-name-first rendering for Japan, South Korea and China
- two-component surname structure for Mexico, Brazil, Colombia, Chile, Spain and Portugal
- gender-appropriate Russian patronymics
- Polish gendered surname forms
- Egyptian father/grandfather lineage components
- Kenyan middle/tribal-name components
- a 100,000-identity structural stress run
