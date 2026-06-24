// Loads a real extension source file (e.g. content.js / popup.js) inside a
// sandboxed VM context with minimal browser/chrome stubs, so tests can call the
// actual functions without a real browser. Top-level side effects (event
// listeners, the initial storage read) run against no-op stubs and do nothing.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import vm from "node:vm";

const ROOT = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));

function fakeEl() {
  return {
    checked: false, value: "", textContent: "",
    dataset: {}, style: { setProperty() {}, removeProperty() {}, getPropertyValue() { return ""; } },
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {},
    querySelector() { return fakeEl(); },
    querySelectorAll() { return []; },
    appendChild() {},
    set innerHTML(_v) {}, get innerHTML() { return ""; },
    cloneNode() { return fakeEl(); },
    remove() {},
  };
}

export function loadModule(file) {
  const chrome = {
    storage: { local: { get() {}, set() {} }, onChanged: { addListener() {} } },
    runtime: { onMessage: { addListener() {} }, sendMessage() { return { catch() {} }; } },
    tabs: { query() {}, sendMessage() { return { catch() {} }; } },
  };
  const document = {
    getElementById() { return fakeEl(); },
    createElement() { return fakeEl(); },
    querySelector() { return fakeEl(); },
    querySelectorAll() { return []; },
    addEventListener() {},
    documentElement: fakeEl(),
    body: fakeEl(),
  };
  const ctx = vm.createContext({
    chrome, document, console, URL,
    navigator: { language: "en" },
    location: { hostname: "" },
    setTimeout() {}, clearTimeout() {},
    MutationObserver: class { observe() {} disconnect() {} },
  });
  // Shared globals loaded before the module under test (as in popup.html).
  vm.runInContext(fs.readFileSync(path.join(ROOT, "i18n.js"), "utf8"), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "presets.js"), "utf8"), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx);
  return ctx;
}
