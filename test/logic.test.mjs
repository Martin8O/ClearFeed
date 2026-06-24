// Functional tests for ClearFeed's real matching and validation logic.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadModule } from "./harness.mjs";

const content = loadModule("content.js");
const popup = loadModule("popup.js");

// Helper that mirrors content.js: build matchers from categories, test text.
function blocks(text, categories) {
  const matchers = content.buildMatchers(categories);
  return matchers.some((re) => re.test(text.toLowerCase()));
}

test("word-boundary matching catches stems but not substrings", () => {
  const cats = [{ enabled: true, words: ["sport", "football"] }];
  assert.equal(blocks("Tonight's football highlights", cats), true);
  assert.equal(blocks("Latest sports results", cats), true, "stem 'sport' should match 'sports'");
  // 'sport' lives inside 'transport' but is preceded by a letter -> must NOT match.
  assert.equal(blocks("New public transport line opens", cats), false);
});

test("disabled categories contribute no matchers", () => {
  const cats = [{ enabled: false, words: ["sport", "football"] }];
  assert.equal(content.buildMatchers(cats).length, 0);
  assert.equal(blocks("football everywhere", cats), false);
});

test("seeded words compile and match content", () => {
  const seeded = [{ enabled: true, words: popup.parseWords("nhl, wimbledon, formula 1") }];
  assert.equal(blocks("The NHL playoffs continue", seeded), true);
  assert.equal(blocks("Wimbledon final set", seeded), true);
});

test("excluded-site matching covers subdomains, not lookalikes", () => {
  assert.equal(content.isSiteExcluded("mail.seznam.cz", ["seznam.cz"]), true);
  assert.equal(content.isSiteExcluded("seznam.cz", ["seznam.cz"]), true);
  assert.equal(content.isSiteExcluded("seznam.cz", ["www.seznam.cz"]), true, "www. is normalized away");
  assert.equal(content.isSiteExcluded("notseznam.cz", ["seznam.cz"]), false);
  assert.equal(content.isSiteExcluded("example.com", []), false);
});

test("normalizeDomain strips scheme, www, path and query", () => {
  assert.equal(popup.normalizeDomain("https://www.MyBank.com/login?x=1#a"), "mybank.com");
  assert.equal(popup.normalizeDomain("  HTTP://Example.org/  "), "example.org");
});

test("parseWords lowercases, trims, drops 1-char tokens and blanks", () => {
  // Array.from re-homes the VM-sandbox array into this realm for deep-equal.
  assert.deepEqual(Array.from(popup.parseWords("Foo, Bar\nBAZ ,  , a")), ["foo", "bar", "baz"]);
});

test("esc neutralizes HTML-significant characters", () => {
  assert.equal(popup.esc(`<img src=x onerror="alert('x')">`),
    "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;");
  assert.equal(popup.esc("a & b"), "a &amp; b");
});

test("sanitizeSettings normalizes a valid backup", () => {
  const out = popup.sanitizeSettings({
    enabled: false,
    categories: [{ id: "sport", name: "Sport", enabled: true, color: "#e74c3c", words: ["NHL", "a", " Goal "] }],
    excludedSites: [" MyBank.com ", ""],
  });
  assert.equal(out.enabled, false);
  assert.equal(out.categories.length, 1);
  assert.deepEqual(Array.from(out.categories[0].words), ["nhl", "goal"]); // lowercased, 1-char dropped
  assert.deepEqual(Array.from(out.excludedSites), ["mybank.com"]);
});

test("sanitizeSettings rejects malicious color and fills defaults", () => {
  const out = popup.sanitizeSettings({ categories: [{ words: [] }] });
  assert.equal(out.enabled, true, "missing enabled defaults to true");
  assert.equal(out.categories[0].color, "#888888");
  assert.equal(out.categories[0].name, "Unnamed");
  // a color that tries to break out of the inline style must be discarded
  const evil = popup.sanitizeSettings({ categories: [{ color: 'red;"></div><script>', words: [] }] });
  assert.equal(evil.categories[0].color, "#888888");
});

test("sanitizeSettings throws on invalid input", () => {
  assert.throws(() => popup.sanitizeSettings(null));
  assert.throws(() => popup.sanitizeSettings([]));
  assert.throws(() => popup.sanitizeSettings({ foo: 1 }), /no categories/);
});

test("i18n: t falls back to English, fmt fills placeholders", () => {
  assert.equal(popup.t("es", "save"), "Guardar");
  assert.equal(popup.t("xx", "save"), "Save");       // unknown language -> English
  assert.equal(popup.t("en", "___nope"), "___nope"); // unknown key -> key itself
  assert.equal(popup.fmt("Delete {name}?", { name: "Sports" }), "Delete Sports?");
  assert.deepEqual(Array.from(popup.uiLangCodes()), ["en", "es", "de", "fr"]);
});

test("presets: each language exposes the same topics with non-empty words", () => {
  const langs = Array.from(popup.presetLangCodes());
  assert.deepEqual(langs, ["en", "es", "de", "fr"]);
  const baseIds = Array.from(popup.getPresets("en").map((p) => p.id)).sort();
  for (const l of langs) {
    const ps = popup.getPresets(l);
    assert.deepEqual(Array.from(ps.map((p) => p.id)).sort(), baseIds, `same topic ids for ${l}`);
    for (const p of ps) {
      assert.ok(p.name && p.name.length, `name present for ${l}/${p.id}`);
      assert.ok(p.words.length >= 5, `enough words for ${l}/${p.id}`);
    }
  }
});

test("presetBaseId extracts the topic id (incl. legacy _xx suffix)", () => {
  assert.equal(popup.presetBaseId("preset_politics"), "politics");
  assert.equal(popup.presetBaseId("preset_politics_en"), "politics"); // legacy id
  assert.equal(popup.presetBaseId("preset_celebrity_de"), "celebrity");
  assert.equal(popup.presetBaseId("cat_1700000000000"), null);
  assert.equal(popup.presetBaseId(null), null);
});

test("localized preset words actually match local-language content", () => {
  const esPolitics = popup.getPresets("es").find((p) => p.id === "politics");
  const deSports = popup.getPresets("de").find((p) => p.id === "sports");
  assert.equal(blocks("Resultados de las elecciones municipales", [{ enabled: true, words: esPolitics.words }]), true);
  assert.equal(blocks("Bundesliga: Tor in der Nachspielzeit", [{ enabled: true, words: deSports.words }]), true);
});
