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

// Inline SVG line icons (viewBox 0 0 24 24, stroke = currentColor). Replace the
// flat emoji icons so the suggestions look consistent with the rest of the UI.
// Trusted constants — injected as innerHTML without escaping.
const PRESET_ICONS = {
  sports:    '<path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"/><path d="M12 7.5l3.2 2.3-1.2 3.7h-4L8.8 9.8z"/><path d="M12 7.5V4M14 13.5l2.8 1M10 13.5l-2.8 1"/>',
  politics:  '<path d="M3 21h18"/><path d="M5 21V10M9.5 21V10M14.5 21V10M19 21V10"/><path d="M4 10h16"/><path d="M12 3l8 5H4z"/>',
  celebrity: '<path d="M12 3.5l2.4 5 5.4.5-4.1 3.6 1.2 5.3L12 20.2 7.1 18l1.2-5.3L4.2 9l5.4-.5z"/>',
  crime:     '<path d="M12 3.5L2.5 20.5h19z"/><path d="M12 10v4"/><path d="M12 17.5h.01"/>',
  money:     '<path d="M3 3v18h18"/><path d="M6.5 14.5l4-4 3 2.5 4.5-5.5"/><path d="M18 7.5h-3M18 7.5v3"/>',
  spoilers:  '<rect x="3" y="8.5" width="18" height="11.5" rx="1.5"/><path d="M3.5 8.5l3-4.5h3l-3 4.5M9.5 8.5l3-4.5h3l-3 4.5M15.5 8.5l3-4.5h3l-3 4.5"/>',
};

function presetIcon(id) {
  const body = PRESET_ICONS[id] || '<circle cx="12" cy="12" r="8"/>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
         'stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
}

// Stable metadata shared across languages.
const PRESET_META = [
  { id: "sports",    color: "#e74c3c" },
  { id: "politics",  color: "#e67e22" },
  { id: "celebrity", color: "#9b59b6" },
  { id: "crime",     color: "#34495e" },
  { id: "money",     color: "#16a085" },
  { id: "spoilers",  color: "#2980b9" },
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
  cs: {
    sports:    { name: "Sport", words: ["fotbal", "hokej", "tenis", "basketbal", "olympi", "liga", "gól", "zápas", "reprezentace", "mistrovství"] },
    politics:  { name: "Politika", words: ["volb", "parlament", "senát", "prezident", "vláda", "ministr", "referend", "poslanec", "koalice", "sněmovna"] },
    celebrity: { name: "Celebrity a drby", words: ["celebrit", "drby", "bulvár", "influencer", "paparazzi", "rozchod", "královská rodina"] },
    crime:     { name: "Krimi a katastrofy", words: ["vražd", "střelb", "vrah", "terorism", "únos", "požár", "zemětřesení", "hurikán", "katastrof", "oběť"] },
    money:     { name: "Peníze a krypto", words: ["bitcoin", "krypto", "burza", "inflace", "recese", "akcie", "úrok", "ethereum"] },
    spoilers:  { name: "Spoilery", words: ["spoiler", "finále série", "epizoda", "trailer", "premiéra", "upoutávka"] },
  },
  pl: {
    sports:    { name: "Sport", words: ["piłka nożna", "koszykówka", "tenis", "hokej", "olimpi", "liga", "gol", "mecz", "mistrzostwa", "reprezentacja"] },
    politics:  { name: "Polityka", words: ["wybor", "parlament", "senat", "prezydent", "rząd", "minister", "referendum", "poseł", "koalicja", "sejm"] },
    celebrity: { name: "Celebryci i plotki", words: ["celebryt", "plotki", "tabloid", "influencer", "paparazzi", "rozstanie", "rodzina królewska"] },
    crime:     { name: "Przestępstwa i katastrofy", words: ["morderstwo", "strzelanin", "zabójstwo", "terror", "porwanie", "pożar", "trzęsienie ziemi", "huragan", "katastrof", "ofiar"] },
    money:     { name: "Pieniądze i krypto", words: ["bitcoin", "krypto", "giełda", "inflacja", "recesja", "akcje", "stopa procentowa"] },
    spoilers:  { name: "Spoilery", words: ["spoiler", "finał sezonu", "odcinek", "zwiastun", "premiera", "box office"] },
  },
  it: {
    sports:    { name: "Sport", words: ["calcio", "serie a", "pallacanestro", "tennis", "golf", "olimpi", "mondiale", "champions", "partita", "ciclismo", "formula 1"] },
    politics:  { name: "Politica", words: ["elezion", "parlamento", "senato", "governo", "ministro", "referendum", "deputat", "presidente", "coalizione", "camera"] },
    celebrity: { name: "Gossip e celebrità", words: ["celebrità", "gossip", "vip", "tappeto rosso", "influencer", "paparazzi", "famiglia reale"] },
    crime:     { name: "Cronaca nera e disastri", words: ["omicidio", "sparatoria", "terrorismo", "sequestro", "incendio", "terremoto", "uragano", "disastro", "vittima", "femminicidio"] },
    money:     { name: "Soldi e cripto", words: ["bitcoin", "cripto", "borsa", "inflazione", "recessione", "azioni", "ethereum"] },
    spoilers:  { name: "Spoiler", words: ["spoiler", "finale di stagione", "episodio", "trailer", "uscita", "incassi", "finale spiegato"] },
  },
  pt: {
    sports:    { name: "Esportes", words: ["futebol", "basquete", "tênis", "golfe", "olímpic", "mundial", "libertadores", "champions", "vôlei", "fórmula 1", "copa do mundo"] },
    politics:  { name: "Política", words: ["eleiç", "parlamento", "senado", "governo", "ministro", "referendo", "deputad", "presidente", "congresso", "câmara"] },
    celebrity: { name: "Celebridades e fofocas", words: ["celebridade", "fofoca", "famoso", "tapete vermelho", "influenciador", "paparazzi", "realeza"] },
    crime:     { name: "Crime e desastres", words: ["assassinato", "tiroteio", "homicídio", "terror", "sequestro", "incêndio", "terremoto", "furacão", "desastre", "vítima"] },
    money:     { name: "Dinheiro e cripto", words: ["bitcoin", "cripto", "bolsa", "inflação", "recessão", "ações", "juros", "ethereum"] },
    spoilers:  { name: "Spoilers", words: ["spoiler", "final de temporada", "episódio", "trailer", "estreia", "bilheteria", "final explicado"] },
  },
  nl: {
    sports:    { name: "Sport", words: ["voetbal", "basketbal", "tennis", "golf", "olympi", "wereldkampioenschap", "champions league", "wedstrijd", "doelpunt", "wielrennen", "eredivisie"] },
    politics:  { name: "Politiek", words: ["verkiez", "parlement", "senaat", "regering", "minister", "referendum", "kamerlid", "premier", "coalitie", "tweede kamer"] },
    celebrity: { name: "Beroemdheden en roddels", words: ["beroemdheid", "roddel", "bekende", "rode loper", "influencer", "paparazzi", "koninklijke familie"] },
    crime:     { name: "Misdaad en rampen", words: ["moord", "schietpartij", "doodslag", "terreur", "ontvoering", "brand", "aardbeving", "orkaan", "ramp", "slachtoffer"] },
    money:     { name: "Geld en crypto", words: ["bitcoin", "crypto", "beurs", "inflatie", "recessie", "aandelen", "rente", "ethereum"] },
    spoilers:  { name: "Spoilers", words: ["spoiler", "seizoensfinale", "aflevering", "trailer", "première", "box office", "einde uitgelegd"] },
  },
  ru: {
    sports:    { name: "Спорт", words: ["футбол", "баскетбол", "хоккей", "теннис", "гольф", "олимпи", "чемпионат", "лига чемпионов", "матч", "биатлон", "сборная"] },
    politics:  { name: "Политика", words: ["выбор", "парламент", "сенат", "правительство", "министр", "референдум", "депутат", "президент", "коалиция", "дума"] },
    celebrity: { name: "Знаменитости и сплетни", words: ["знаменитост", "сплетн", "звезд", "красная дорожка", "инфлюенсер", "папарацци", "королевская семья"] },
    crime:     { name: "Криминал и катастрофы", words: ["убийств", "стрельб", "теракт", "похищение", "пожар", "землетрясение", "ураган", "катастроф", "жертв"] },
    money:     { name: "Деньги и крипто", words: ["биткоин", "крипто", "биржа", "инфляция", "рецессия", "акции", "ставка", "эфириум"] },
    spoilers:  { name: "Спойлеры", words: ["спойлер", "финал сезона", "серия", "трейлер", "премьера", "сборы", "концовка"] },
  },
  uk: {
    sports:    { name: "Спорт", words: ["футбол", "баскетбол", "хокей", "теніс", "гольф", "олімпі", "чемпіонат", "ліга чемпіонів", "матч", "біатлон", "збірна"] },
    politics:  { name: "Політика", words: ["вибор", "парламент", "сенат", "уряд", "міністр", "референдум", "депутат", "президент", "коаліція", "рада"] },
    celebrity: { name: "Знаменитості та плітки", words: ["знаменитост", "плітк", "зірк", "червона доріжка", "інфлюенсер", "папараці", "королівська родина"] },
    crime:     { name: "Кримінал і катастрофи", words: ["вбивств", "стрілянин", "теракт", "викрадення", "пожежа", "землетрус", "ураган", "катастроф", "жертв"] },
    money:     { name: "Гроші та крипто", words: ["біткоїн", "крипто", "біржа", "інфляція", "рецесія", "акції", "ставка", "ефіріум"] },
    spoilers:  { name: "Спойлери", words: ["спойлер", "фінал сезону", "серія", "трейлер", "прем'єра", "збори", "кінцівка"] },
  },
  tr: {
    sports:    { name: "Spor", words: ["futbol", "basketbol", "tenis", "golf", "olimpiyat", "şampiyon", "dünya kupası", "maç", "voleybol", "formula 1"] },
    politics:  { name: "Siyaset", words: ["seçim", "meclis", "senato", "hükümet", "bakan", "referandum", "milletvekili", "cumhurbaşkan", "koalisyon", "parlamento"] },
    celebrity: { name: "Magazin ve ünlüler", words: ["ünlü", "dedikodu", "magazin", "kırmızı halı", "influencer", "paparazzi", "kraliyet ailesi"] },
    crime:     { name: "Suç ve felaketler", words: ["cinayet", "silahlı saldırı", "terör", "kaçırma", "yangın", "deprem", "kasırga", "felaket", "kurban"] },
    money:     { name: "Para ve kripto", words: ["bitcoin", "kripto", "borsa", "enflasyon", "resesyon", "hisse", "faiz", "ethereum"] },
    spoilers:  { name: "Spoiler", words: ["spoiler", "sezon finali", "bölüm", "fragman", "vizyon", "gişe", "final açıklaması"] },
  },
  sv: {
    sports:    { name: "Sport", words: ["fotboll", "basket", "ishockey", "tennis", "golf", "olympisk", "mästerskap", "champions league", "allsvenskan", "handboll"] },
    politics:  { name: "Politik", words: ["val", "riksdag", "senat", "regering", "minister", "folkomröstning", "riksdagsledamot", "statsminister", "koalition", "parlament"] },
    celebrity: { name: "Kändisar och skvaller", words: ["kändis", "skvaller", "kungafamilj", "röda mattan", "influencer", "paparazzi", "uppbrott"] },
    crime:     { name: "Brott och katastrofer", words: ["mord", "skjutning", "dråp", "terror", "kidnappning", "brand", "jordbävning", "orkan", "katastrof", "offer"] },
    money:     { name: "Pengar och krypto", words: ["bitcoin", "krypto", "börs", "inflation", "recession", "aktier", "ränta", "ethereum"] },
    spoilers:  { name: "Spoilers", words: ["spoiler", "säsongsfinal", "avsnitt", "trailer", "premiär", "biljettintäkter", "slutet förklarat"] },
  },
  da: {
    sports:    { name: "Sport", words: ["fodbold", "basketball", "ishockey", "tennis", "golf", "olympisk", "mesterskab", "champions league", "superliga", "håndbold"] },
    politics:  { name: "Politik", words: ["valg", "folketing", "senat", "regering", "minister", "folkeafstemning", "folketingsmedlem", "statsminister", "koalition", "parlament"] },
    celebrity: { name: "Kendisser og sladder", words: ["kendis", "sladder", "kongefamilie", "røde løber", "influencer", "paparazzi", "brud"] },
    crime:     { name: "Kriminalitet og katastrofer", words: ["mord", "skyderi", "drab", "terror", "kidnapning", "brand", "jordskælv", "orkan", "katastrofe", "offer"] },
    money:     { name: "Penge og krypto", words: ["bitcoin", "krypto", "børs", "inflation", "recession", "aktier", "rente", "ethereum"] },
    spoilers:  { name: "Spoilers", words: ["spoiler", "sæsonfinale", "afsnit", "trailer", "premiere", "billetsalg", "slutningen forklaret"] },
  },
  no: {
    sports:    { name: "Sport", words: ["fotball", "basketball", "ishockey", "tennis", "golf", "olympisk", "mesterskap", "champions league", "eliteserien", "håndball"] },
    politics:  { name: "Politikk", words: ["valg", "storting", "senat", "regjering", "minister", "folkeavstemning", "stortingsrepresentant", "statsminister", "koalisjon", "parlament"] },
    celebrity: { name: "Kjendiser og sladder", words: ["kjendis", "sladder", "kongefamilie", "rød løper", "influenser", "paparazzi", "brudd"] },
    crime:     { name: "Kriminalitet og katastrofer", words: ["drap", "skyting", "terror", "kidnapping", "brann", "jordskjelv", "orkan", "katastrofe", "offer"] },
    money:     { name: "Penger og krypto", words: ["bitcoin", "krypto", "børs", "inflasjon", "resesjon", "aksjer", "rente", "ethereum"] },
    spoilers:  { name: "Spoilere", words: ["spoiler", "sesongfinale", "episode", "trailer", "premiere", "billettsalg", "slutten forklart"] },
  },
  fi: {
    sports:    { name: "Urheilu", words: ["jalkapallo", "koripallo", "jääkiekko", "tennis", "golf", "olympia", "mestaruus", "mestarien liiga", "ottelu", "veikkausliiga"] },
    politics:  { name: "Politiikka", words: ["vaali", "eduskunta", "senaatti", "hallitus", "ministeri", "kansanäänestys", "kansanedustaja", "pääministeri", "koalitio", "parlamentti"] },
    celebrity: { name: "Julkkikset ja juorut", words: ["julkkis", "juoru", "kuninkaallis", "punainen matto", "vaikuttaja", "paparazzi", "kohu"] },
    crime:     { name: "Rikokset ja katastrofit", words: ["murha", "ampuminen", "tappo", "terrori", "sieppaus", "tulipalo", "maanjäristys", "hirmumyrsky", "katastrofi", "uhri"] },
    money:     { name: "Raha ja krypto", words: ["bitcoin", "krypto", "pörssi", "inflaatio", "taantuma", "osakkeet", "korko", "ethereum"] },
    spoilers:  { name: "Spoilerit", words: ["spoiler", "kauden finaali", "jakso", "traileri", "ensi-ilta", "lipputulot", "loppu selitetty"] },
  },
};

// Return the preset list for a language, merging metadata + localized content.
// Falls back to English for any language/preset that isn't translated.
function getPresets(lang) {
  const content = PRESET_CONTENT[lang] || PRESET_CONTENT.en;
  return PRESET_META.map((m) => {
    const c = content[m.id] || PRESET_CONTENT.en[m.id];
    return { id: m.id, color: m.color, icon: presetIcon(m.id), name: c.name, words: c.words.slice() };
  });
}

// Codes that have a full preset translation (used for tests / language list).
function presetLangCodes() {
  return Object.keys(PRESET_CONTENT);
}
