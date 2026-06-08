// content/dona.ts
// Copy for the new /dona-streets page (the definitive Doña streets page; future
// 301 target for thedonastreets.com). Derived from the Land Acquisition and
// West Laurelwood source copy. NO em dashes.
//
// `streets` names every Doña street that appears in the fetched Wix source copy.
// The live neighborhood may include more; only add a street here when it is
// confirmed in source material (do not fabricate). See STATE.md.

export const donaContent = {
  eyebrow: "Heritage",
  title: "The Doña Streets",
  subtitle: "The Spanish-named streets at the heart of Laurelwood.",

  body: [
    "One of the most defining and culturally significant aspects of both West and East Laurelwood is its collection of Spanish-inspired street names. Reflecting the area's heritage and unique identity, names that carry the Spanish title of respect, Doña, are not just routes through the neighborhood. They are symbols of the area's deep connection to Southern California's Spanish roots.",
    "These names connect the neighborhood to Southern California's cultural roots, though they are not tied to historical figures. They were chosen to give Laurelwood a distinct sense of place, a character that has endured for more than sixty years.",
    "In 2001, residents took action to ensure this legacy was preserved, successfully petitioning for the correct use of Spanish accents on the street signs. The inclusion of the tilde over the 'n' in Doña highlights the community's dedication to honoring its cultural background. This small detail marks a significant stand against the erosion of cultural markers and ensures future generations will continue to experience Laurelwood's authentic flair.",
  ],

  // Doña streets we can attest to. Emilia/Rosa/Pegita come from the fetched
  // source copy; Maria Dr. is confirmed by the street-sign asset (3100 N);
  // Dorotea Dr. and Mema Pl. were provided by the site owner. The live
  // neighborhood may include more; do not fabricate beyond these.
  streets: [
    "Doña Dorotea Dr.",
    "Doña Emilia Dr.",
    "Doña Maria Dr.",
    "Doña Mema Pl.",
    "Doña Pegita Dr.",
    "Doña Rosa Dr.",
  ],

  closing:
    "Each Doña street reflects Southern California's historical ties, creating an environment that blends tradition with modern living. Owning a home on one of the Doña streets means owning a piece of that legacy.",

  // Jack-approved copy (word-for-word) for the two sections inserted after the
  // existing intro. Accented "Doña" throughout. NO em dashes.
  whatDonaMeans: {
    heading: "What Doña Means",
    body: [
      "Doña is a Spanish honorific, a title of respect placed before a woman's first name, the equivalent of Lady or Madam. Its male counterpart is Don. The title does not translate to a thing or a place; it confers dignity on the name that follows. Every street sign in Laurelwood therefore reads like a small courtesy: Doña Maria Drive is, quite literally, Lady Mary Drive.",
      "The names themselves are classic Spanish women's names, and several are affectionate nicknames rather than formal given names. That detail tells a story. These streets do not commemorate documented historical figures; they were the developer's romantic evocation of Spanish California, chosen in the late 1950s to give the new neighborhood its warmth and identity. One street breaks the pattern: Duque Drive, Spanish for Duke, the lone nobleman among the ladies.",
    ],
  },

  glossary: {
    heading: "The Names, Street by Street",
    west: [
      { name: "Doña Dorotea Dr.", meaning: "Dorothea, a Greek name meaning gift of God" },
      { name: "Doña Mema Pl.", meaning: "an affectionate Spanish nickname, often for Guillermina or Mercedes" },
      { name: "Doña Evita Dr.", meaning: "little Eva, a diminutive of Eva, meaning life" },
      { name: "Doña Teresa Dr.", meaning: "Theresa, a classic Spanish name borne by St. Teresa of Avila" },
      { name: "Doña Christina Pl.", meaning: "Christina, meaning follower of Christ" },
      { name: "Doña Elena Pl.", meaning: "the Spanish form of Helen, meaning light or torch" },
      { name: "Duque Dr.", meaning: "Spanish for Duke, the one gentleman on the map" },
      { name: "Doña Pepita Pl.", meaning: "little Pepa, an affectionate nickname for Josefa, the Spanish form of Josephine" },
      { name: "Doña Maria Dr.", meaning: "Mary, the most beloved name in the Spanish tradition" },
      { name: "Doña Cecilia Dr.", meaning: "Cecilia, the patron saint of music" },
      { name: "Doña Raquel Pl.", meaning: "Rachel, a Hebrew name meaning ewe, a symbol of gentleness" },
      { name: "Doña Alicia Pl.", meaning: "the Spanish form of Alice, meaning noble" },
      { name: "Doña Dolores Pl.", meaning: "sorrows, from Maria de los Dolores, Our Lady of Sorrows" },
    ],
    east: [
      { name: "Doña Emilia Dr.", meaning: "Emilia, from a Roman family name meaning striving" },
      { name: "Doña Nenita Pl.", meaning: "little girl, one of the most affectionate Spanish endearments" },
      { name: "Doña Isabel Dr.", meaning: "the Spanish form of Elizabeth, meaning devoted to God" },
      { name: "Doña Susana Dr.", meaning: "Susanna, a Hebrew name meaning lily" },
      { name: "Doña Marta Dr.", meaning: "Martha, meaning lady of the house, making this street doubly a lady" },
      { name: "Doña Sarita Pl.", meaning: "little Sarah, a diminutive of Sara, meaning princess" },
      { name: "Doña Pegita Dr.", meaning: "an affectionate diminutive, likely a variant of Pepita" },
      { name: "Doña Lola Dr.", meaning: "the classic nickname for Dolores, the very name honored across the canyon in West Laurelwood" },
      { name: "Doña Lisa Dr.", meaning: "a short form of Elisa, from Elizabeth" },
      { name: "Doña Rosa Dr.", meaning: "Rose" },
      { name: "Doña Sofia Dr.", meaning: "Sofia, the Greek name meaning wisdom" },
    ],
  },
};
