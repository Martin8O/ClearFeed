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

test("default Sport seed compiles and matches sport content", () => {
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
