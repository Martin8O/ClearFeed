// =============================================
//  ClearFeed — presets.js
//  A library of suggested "topics to mute" the user can add with one click.
//  Each preset is seeded with a word list per UI language so blocking works
//  on local-language sites. Once added, a preset becomes a normal editable
//  category in storage — nothing here is fixed.
//
//  Matching uses a word boundary + stem, so a STEM is enough and endings are
//  covered automatically. Words are matched case-insensitively.
//  Loaded (as a shared global) before popup.js.
// =============================================

// Stable metadata shared across languages.
const PRESET_META = [
  { id: "sports",    color: "#e74c3c", icon: "🏟️" },
  { id: "politics",  color: "#e67e22", icon: "🏛️" },
  { id: "celebrity", color: "#9b59b6", icon: "⭐" },
  { id: "crime",     color: "#34495e", icon: "🚨" },
  { id: "money",     color: "#16a085", icon: "📈" },
  { id: "spoilers",  color: "#2980b9", icon: "🎬" },
];

// Localized display name + seed words per language.
const PRESET_CONTENT = {
  en: {
    sports:    { name: "Sports", words: ["football", "soccer", "basketball", "baseball", "hockey", "tennis", "golf", "olympic", "fifa", "uefa", "nba", "nhl", "premier league", "champions league", "playoff", "world cup"] },
    politics:  { name: "Politics", words: ["election", "parliament", "senate", "congress", "president", "minister", "referendum", "campaign", "government", "coalition", "sanction", "lawmaker"] },
    celebrity: { name: "Celebrity gossip", words: ["celebrity", "gossip", "kardashian", "red carpet", "influencer", "paparazzi", "breakup", "reality star", "royal family", "tabloid"] },
    crime:     { name: "Crime & disasters", words: ["murder", "shooting", "homicide", "assault", "terror", "kidnap", "wildfire", "earthquake", "hurricane", "disaster", "manslaughter", "fatal"] },
    money:     { name: "Money & crypto", words: ["bitcoin", "crypto", "ethereum", "stock market", "inflation", "recession", "nasdaq", "layoff", "interest rate", "dogecoin"] },
    spoilers:  { name: "Spoilers", words: ["spoiler", "season finale", "episode", "trailer", "marvel", "box office", "recap", "ending explained", "plot twist"] },
  },
  es: {
    sports:    { name: "Deportes", words: ["fútbol", "baloncesto", "tenis", "golf", "olímpic", "mundial", "champions", "liga", "partido", "deportiv", "ciclismo", "balonmano", "gol"] },
    politics:  { name: "Política", words: ["elecci", "parlamento", "senado", "congreso", "presidente", "ministro", "referéndum", "campaña", "gobierno", "coalición", "diputad"] },
    celebrity: { name: "Famosos y cotilleo", words: ["celebridad", "famoso", "chisme", "cotilleo", "alfombra roja", "influencer", "paparazzi", "ruptura", "realeza"] },
    crime:     { name: "Crímenes y desastres", words: ["asesinato", "tiroteo", "homicidio", "terror", "secuestro", "incendio", "terremoto", "huracán", "desastre", "víctima"] },
    money:     { name: "Dinero y cripto", words: ["bitcoin", "cripto", "bolsa", "inflación", "recesión", "nasdaq", "despido", "ethereum"] },
    spoilers:  { name: "Spoilers", words: ["spoiler", "final de temporada", "episodio", "tráiler", "estreno", "taquilla", "final explicado"] },
  },
  de: {
    sports:    { name: "Sport", words: ["fußball", "bundesliga", "tor", "spieler", "trainer", "olympia", "weltmeisterschaft", "tennis", "handball", "eishockey", "basketball", "verein", "pokal"] },
    politics:  { name: "Politik", words: ["wahl", "parlament", "bundestag", "senat", "präsident", "minister", "referendum", "wahlkampf", "regierung", "koalition", "abgeordnet"] },
    celebrity: { name: "Promi-Klatsch", words: ["promi", "klatsch", "roter teppich", "influencer", "paparazzi", "trennung", "königsfamilie", "boulevard"] },
    crime:     { name: "Verbrechen & Katastrophen", words: ["mord", "schießerei", "totschlag", "terror", "entführung", "waldbrand", "erdbeben", "hurrikan", "katastrophe", "opfer"] },
    money:     { name: "Geld & Krypto", words: ["bitcoin", "krypto", "börse", "inflation", "rezession", "aktienmarkt", "zinsen", "entlassung", "ethereum"] },
    spoilers:  { name: "Spoiler", words: ["spoiler", "staffelfinale", "episode", "trailer", "kinostart", "einspielergebnis", "ende erklärt"] },
  },
  fr: {
    sports:    { name: "Sport", words: ["football", "basket", "tennis", "golf", "olympique", "mondial", "championnat", "ligue", "but", "joueur", "entraîneur", "cyclisme", "rugby"] },
    politics:  { name: "Politique", words: ["élection", "parlement", "sénat", "président", "ministre", "référendum", "campagne", "gouvernement", "coalition", "député"] },
    celebrity: { name: "People & potins", words: ["célébrité", "people", "ragot", "potin", "tapis rouge", "influenceur", "paparazzi", "rupture", "famille royale"] },
    crime:     { name: "Faits divers & catastrophes", words: ["meurtre", "fusillade", "homicide", "terrorisme", "enlèvement", "incendie", "séisme", "ouragan", "catastrophe", "victime"] },
    money:     { name: "Argent & crypto", words: ["bitcoin", "crypto", "bourse", "inflation", "récession", "nasdaq", "licenciement", "ethereum"] },
    spoilers:  { name: "Spoilers", words: ["spoiler", "fin de saison", "épisode", "bande-annonce", "sortie", "box-office", "fin expliquée"] },
  },
};

// Return the preset list for a language, merging metadata + localized content.
// Falls back to English for any language/preset that isn't translated.
function getPresets(lang) {
  const content = PRESET_CONTENT[lang] || PRESET_CONTENT.en;
  return PRESET_META.map((m) => {
    const c = content[m.id] || PRESET_CONTENT.en[m.id];
    return { id: m.id, color: m.color, icon: m.icon, name: c.name, words: c.words.slice() };
  });
}

// Codes that have a full preset translation (used for tests / language list).
function presetLangCodes() {
  return Object.keys(PRESET_CONTENT);
}
