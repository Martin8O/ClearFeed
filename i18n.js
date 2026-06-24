// =============================================
//  ClearFeed — i18n.js
//  Lightweight runtime translation for the popup UI. Unlike chrome.i18n /
//  _locales (which follows the browser language and isn't switchable), this
//  lets the user pick the app language in the popup at any time.
//  Loaded (as a shared global) before popup.js.
//
//  Use {n} / {name} placeholders; fill them with fmt(string, {n: 3}).
// =============================================

const LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
];

const UI = {
  en: {
    tagline: "Focus on what matters to you",
    articlesHidden: "items hidden", reset: "reset",
    blockingActive: "Filtering on", blockingPaused: "Filtering paused",
    revealNothing: "Nothing hidden on this page", reveal: "Reveal hidden", hideAgain: "Hide again",
    categories: "Your topics",
    emptyCats: "No topics yet. Pick a suggestion below to start cleaning your feed.",
    suggested: "Suggested topics", added: "Added",
    addCategory: "Add your own", catNamePlaceholder: "Topic name…", add: "Add",
    wordsPlaceholder: "Separate words with commas or new lines…\ne.g. election, celebrity, spoiler",
    wordsHint: 'A word stem is enough — "elect" catches election, elections, electoral…',
    save: "Save", deleteCat: "Delete topic", deleteConfirm: 'Delete the "{name}" topic?',
    excludedHeader: "Never filter on these sites", excludeCurrent: "Don't filter the site I'm on",
    exclPlaceholder: "e.g. mybank.com", exclEmpty: "None — filtering runs everywhere.",
    backup: "Backup", export: "Export", import: "Import",
    exported: "Settings exported.", importedN: "Imported {n} topics.", importFail: "Import failed.",
    words: "words", language: "Language",
  },
  es: {
    tagline: "Céntrate en lo que te importa",
    articlesHidden: "ocultos", reset: "reiniciar",
    blockingActive: "Filtrado activado", blockingPaused: "Filtrado en pausa",
    revealNothing: "Nada oculto en esta página", reveal: "Mostrar ocultos", hideAgain: "Ocultar de nuevo",
    categories: "Tus temas",
    emptyCats: "Aún no hay temas. Elige una sugerencia para empezar a limpiar tu feed.",
    suggested: "Temas sugeridos", added: "Añadido",
    addCategory: "Añade el tuyo", catNamePlaceholder: "Nombre del tema…", add: "Añadir",
    wordsPlaceholder: "Separa las palabras con comas o saltos de línea…\nej.: elecciones, famoso, spoiler",
    wordsHint: 'Basta la raíz — "elec" detecta elección, elecciones, electoral…',
    save: "Guardar", deleteCat: "Eliminar tema", deleteConfirm: '¿Eliminar el tema "{name}"?',
    excludedHeader: "Nunca filtrar en estos sitios", excludeCurrent: "No filtrar el sitio actual",
    exclPlaceholder: "ej.: mibanco.com", exclEmpty: "Ninguno — el filtrado se aplica en todas partes.",
    backup: "Copia de seguridad", export: "Exportar", import: "Importar",
    exported: "Ajustes exportados.", importedN: "{n} temas importados.", importFail: "Error al importar.",
    words: "palabras", language: "Idioma",
  },
  de: {
    tagline: "Konzentrier dich auf das Wesentliche",
    articlesHidden: "ausgeblendet", reset: "zurücksetzen",
    blockingActive: "Filter aktiv", blockingPaused: "Filter pausiert",
    revealNothing: "Nichts auf dieser Seite ausgeblendet", reveal: "Ausgeblendete zeigen", hideAgain: "Wieder ausblenden",
    categories: "Deine Themen",
    emptyCats: "Noch keine Themen. Wähle unten einen Vorschlag, um deinen Feed aufzuräumen.",
    suggested: "Vorgeschlagene Themen", added: "Hinzugefügt",
    addCategory: "Eigenes hinzufügen", catNamePlaceholder: "Themenname…", add: "Hinzufügen",
    wordsPlaceholder: "Wörter mit Kommas oder Zeilenumbrüchen trennen…\nz. B. Wahl, Promi, Spoiler",
    wordsHint: 'Ein Wortstamm genügt — "wahl" erfasst Wahlen, Wahlkampf …',
    save: "Speichern", deleteCat: "Thema löschen", deleteConfirm: 'Thema "{name}" löschen?',
    excludedHeader: "Auf diesen Seiten nie filtern", excludeCurrent: "Aktuelle Seite nicht filtern",
    exclPlaceholder: "z. B. meinebank.de", exclEmpty: "Keine — der Filter läuft überall.",
    backup: "Backup", export: "Exportieren", import: "Importieren",
    exported: "Einstellungen exportiert.", importedN: "{n} Themen importiert.", importFail: "Import fehlgeschlagen.",
    words: "Wörter", language: "Sprache",
  },
  fr: {
    tagline: "Concentre-toi sur l'essentiel",
    articlesHidden: "masqués", reset: "réinitialiser",
    blockingActive: "Filtrage activé", blockingPaused: "Filtrage en pause",
    revealNothing: "Rien de masqué sur cette page", reveal: "Afficher les masqués", hideAgain: "Masquer à nouveau",
    categories: "Tes thèmes",
    emptyCats: "Aucun thème pour l'instant. Choisis une suggestion pour nettoyer ton fil.",
    suggested: "Thèmes suggérés", added: "Ajouté",
    addCategory: "Ajouter le tien", catNamePlaceholder: "Nom du thème…", add: "Ajouter",
    wordsPlaceholder: "Sépare les mots par des virgules ou des retours à la ligne…\nex. : élection, célébrité, spoiler",
    wordsHint: 'Une racine suffit — « élec » détecte élection, élections, électoral…',
    save: "Enregistrer", deleteCat: "Supprimer le thème", deleteConfirm: 'Supprimer le thème « {name} » ?',
    excludedHeader: "Ne jamais filtrer sur ces sites", excludeCurrent: "Ne pas filtrer le site actuel",
    exclPlaceholder: "ex. : mabanque.fr", exclEmpty: "Aucun — le filtrage s'applique partout.",
    backup: "Sauvegarde", export: "Exporter", import: "Importer",
    exported: "Paramètres exportés.", importedN: "{n} thèmes importés.", importFail: "Échec de l'import.",
    words: "mots", language: "Langue",
  },
};

// Translate a key for a language, falling back to English then the key itself.
function t(lang, key) {
  return (UI[lang] && UI[lang][key]) || UI.en[key] || key;
}

// Fill {placeholders} in a translated string.
function fmt(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars) ? vars[k] : m);
}

function uiLangCodes() {
  return LANGS.map((l) => l.code);
}
