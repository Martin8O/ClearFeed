// =============================================
//  ClearFeed — words.js
//  Default word stems for the built-in "Sport"
//  category. These only SEED the category on first
//  run; afterwards the list lives in storage and is
//  fully editable in the popup (just like any other
//  category).
//
//  NOTE: Matching uses a word boundary, so a STEM is
//  enough and endings are covered automatically:
//    "footbal" catches football, footballer, footballers…
//  while it won't match inside an unrelated word.
//  That's why trailing spaces are not needed here.
// =============================================

const DEFAULT_SPORT_WORDS = [
  // === GENERAL SPORTS ===
  "sport", "athlet", "footbal", "soccer", "hockey", "tennis", "basketbal",
  "volleybal", "handbal", "rugby", "golf", "boxing", "wrestl", "swimming",
  "cycling", "skiing", "snowboard", "rowing", "canoe", "judo", "karate",
  "taekwondo", "martial arts", "motorsport", "rally",

  // === FOOTBALL / SOCCER ===
  "premier league", "bundesliga", "serie a", "la liga", "champions league",
  "uefa", "fifa", "goal", "goalkeeper", "penalty", "offside",
  "manchester", "arsenal", "chelsea", "liverpool", "barcelona", "real madrid",
  "juventus", "bayern", "dortmund", "transfer", "midfielder", "striker",
  "defender", "referee", "stadium", "derby", "world cup",

  // === HOCKEY ===
  "nhl", "khl", "iihf", "puck", "power play", "faceoff",

  // === TENNIS ===
  "wimbledon", "roland garros", "us open", "australian open", "atp", "wta",
  "grand slam", "serve", "racket",

  // === BASKETBALL ===
  "nba", "euroleague", "three-pointer", "free throw", "playoff",

  // === CYCLING / MOTORSPORT ===
  "tour de france", "giro", "vuelta", "peloton", "formula 1", "formula one",
  "verstappen", "hamilton", "ferrari", "motogp", "dakar",

  // === OLYMPICS / TITLES ===
  "olympic", "paralympic", "world championship", "european championship",
  "gold medal", "silver medal", "bronze medal",

  // === RESULTS / COVERAGE ===
  "score", "standings", "semifinal", "quarterfinal", "final",
  "win", "loss", "draw", "match", "fixture", "tournament", "league",
  "coach", "player", "fitness", "workout", "baseball"
];
// Shared as a global with content.js and popup.js (both load this first).
