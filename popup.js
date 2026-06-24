// =============================================
//  ClearFeed — popup.js  (v2.0)
//  Loads after i18n.js (UI strings) and presets.js (suggested topics).
// =============================================

const DEFAULT_CATEGORIES = []; // first run: no topics; user picks from suggestions
const COLORS = ["#e74c3c","#e67e22","#f39c12","#27ae60","#2980b9","#8e44ad","#16a085","#c0392b"];

// The only external link in the extension — opened in a new tab on user click.
const REPO_URL = "https://github.com/Martin8O/ClearFeed";
const COFFEE_URL = ""; // TODO: paste your "Buy Me a Coffee" URL here to enable the button.

// Preset category ids look like "preset_<topic>"; the "_xx" language suffix is legacy.
const PRESET_LANG_SUFFIX = /_(en|es|de|fr)$/;

let state = { enabled: true, blockedTotal: 0, categories: [], excludedSites: [], uiLang: "en", theme: "light" };

// --- Init ---
chrome.storage.local.get(["enabled","blockedTotal","categories","excludedSites","uiLang","theme"], (data) => {
  state.enabled       = data.enabled !== false;
  state.blockedTotal  = data.blockedTotal || 0;
  state.categories    = data.categories  || DEFAULT_CATEGORIES;
  state.excludedSites = data.excludedSites || [];
  state.uiLang        = pickLang(data.uiLang);
  state.theme         = pickTheme(data.theme);

  applyTheme(state.theme);
  document.documentElement.classList.add("cf-ready"); // reveal once themed (no flash)
  buildLangOptions();
  applyI18n();
  document.getElementById("count").textContent = state.blockedTotal;
  setMasterToggle(state.enabled);
  setVersion();

  renderCategories();
  renderPresets();
  renderExcluded();
  refreshRevealButton();
});

function pickTheme(stored) {
  if (stored === "light" || stored === "dark") return stored;
  const m = (typeof matchMedia === "function") && matchMedia("(prefers-color-scheme: dark)").matches;
  return m ? "dark" : "light";
}

function setVersion() {
  const v = "v" + (chrome.runtime.getManifest ? chrome.runtime.getManifest().version : "");
  document.getElementById("aboutVer").textContent = v;
}

function pickLang(stored) {
  const codes = uiLangCodes();
  if (stored && codes.includes(stored)) return stored;
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  return codes.includes(nav) ? nav : "en";
}

// --- i18n ---
function tr(key) { return t(state.uiLang, key); }

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = tr(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = tr(el.dataset.i18nPh);
  });
  document.getElementById("themeBtn").title = tr("theme");
  document.getElementById("coffeeBtn").title = tr("coffee");
  document.getElementById("langTrigger").title = tr("language");
  document.documentElement.lang = state.uiLang;
}

// --- Theme (light / dark) ---
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
  document.getElementById("themeBtn").textContent = theme === "dark" ? "☀️" : "🌙";
}

document.getElementById("themeBtn").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme(state.theme);
  saveSettings();
});

// --- About panel + links ---
function openUrl(url) { if (url) chrome.tabs.create({ url }); }

// About replaces the main view (rather than overlaying it), so the document
// shrinks to the panel's height and the popup window shows no scrollbar.
document.getElementById("aboutBtn").addEventListener("click", () => {
  document.getElementById("mainView").hidden = true;
  document.getElementById("aboutPanel").hidden = false;
});
document.getElementById("aboutClose").addEventListener("click", () => {
  document.getElementById("aboutPanel").hidden = true;
  document.getElementById("mainView").hidden = false;
});
document.getElementById("aboutGithub").addEventListener("click", () => openUrl(REPO_URL));
document.getElementById("aboutPrivacy").addEventListener("click", () => openUrl(REPO_URL + "/blob/main/PRIVACY.md"));
document.getElementById("coffeeBtn").addEventListener("click", () => openUrl(COFFEE_URL));
document.getElementById("aboutCoffee").addEventListener("click", () => openUrl(COFFEE_URL));

// Custom language dropdown (a native <select> can't render SVG flags). The
// trigger shows just the current flag; the menu lists flag + native name.
function langFlag(code) { return `<span class="flag">${flagSvg(code)}</span>`; }

function updateLangTrigger() {
  document.getElementById("langTrigger").innerHTML =
    langFlag(state.uiLang) + `<span class="caret">▼</span>`;
}

function buildLangOptions() {
  const menu = document.getElementById("langMenu");
  menu.innerHTML = "";
  LANGS.forEach((l) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-opt" + (l.code === state.uiLang ? " sel" : "");
    btn.setAttribute("role", "option");
    btn.innerHTML = langFlag(l.code) + `<span>${esc(l.label)}</span>`;
    btn.addEventListener("click", () => { setLang(l.code); closeLangMenu(); });
    li.appendChild(btn);
    menu.appendChild(li);
  });
  updateLangTrigger();
}

function openLangMenu()  { document.getElementById("langMenu").hidden = false; document.getElementById("langTrigger").setAttribute("aria-expanded", "true"); }
function closeLangMenu() { document.getElementById("langMenu").hidden = true;  document.getElementById("langTrigger").setAttribute("aria-expanded", "false"); }

document.getElementById("langTrigger").addEventListener("click", (e) => {
  e.stopPropagation();
  if (document.getElementById("langMenu").hidden) openLangMenu(); else closeLangMenu();
});
document.addEventListener("click", (e) => { if (!e.target.closest("#langDd")) closeLangMenu(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLangMenu(); });

function setLang(code) {
  if (code === state.uiLang) return;
  state.uiLang = code;
  const changed = relocalizeCategories(state.uiLang); // keep added topics in one language
  saveSettings();
  applyI18n();
  setMasterToggle(state.enabled);     // refresh localized label
  buildLangOptions();                 // refresh selected highlight + trigger flag
  renderCategories();
  renderPresets();
  renderExcluded();
  refreshRevealButton();
  if (changed) broadcastReload();
}

// --- Master toggle ---
function setMasterToggle(enabled) {
  document.getElementById("masterToggle").checked = enabled;
  const label = document.getElementById("masterLabel");
  label.textContent = enabled ? tr("blockingActive") : tr("blockingPaused");
  label.classList.toggle("off", !enabled);
}

document.getElementById("masterToggle").addEventListener("change", (e) => {
  state.enabled = e.target.checked;
  setMasterToggle(state.enabled);
  saveSettings();
  broadcastReload();
});

// --- Reset counter ---
document.getElementById("resetBtn").addEventListener("click", () => {
  state.blockedTotal = 0;
  chrome.storage.local.set({ blockedTotal: 0 });
  document.getElementById("count").textContent = "0";
});

// --- Add custom category ---
document.getElementById("addCatBtn").addEventListener("click", () => {
  const input = document.getElementById("newCatName");
  const name = input.value.trim();
  if (!name) return;
  const id = "cat_" + Date.now();
  const color = COLORS[state.categories.length % COLORS.length];
  state.categories.push({ id, name, enabled: true, color, words: [] });
  input.value = "";
  saveSettings();
  renderCategories();
  setTimeout(() => {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) card.classList.add("open");
  }, 50);
});
document.getElementById("newCatName").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("addCatBtn").click();
});

// --- Suggested topic presets ---
// Preset categories use a language-independent id ("preset_<topic>"); the
// display name + words follow the current UI language and are re-localized when
// the language changes.
function presetBaseId(catId) {
  if (typeof catId !== "string" || catId.indexOf("preset_") !== 0) return null;
  return catId.slice(7).replace(PRESET_LANG_SUFFIX, "");
}

function renderPresets() {
  const list = document.getElementById("presetList");
  list.innerHTML = "";
  const have = new Set(state.categories.map((c) => presetBaseId(c.id)).filter(Boolean));
  const available = getPresets(state.uiLang).filter((p) => !have.has(p.id));

  if (available.length === 0) {
    list.innerHTML = `<div class="preset-empty">${esc(tr("added"))} ✓</div>`;
    return;
  }
  available.forEach((p) => {
    const chip = document.createElement("button");
    chip.className = "preset-chip";
    // p.icon is a trusted inline-SVG constant from presets.js (not user data).
    chip.innerHTML = `<span class="picon" style="color:${p.color}">${p.icon}</span>` +
      `<span class="pname">${esc(p.name)}</span><span class="pplus">+</span>`;
    chip.addEventListener("click", () => addPreset(p));
    list.appendChild(chip);
  });
}

function addPreset(p) {
  state.categories.push({
    id: "preset_" + p.id,
    name: p.name,
    enabled: true,
    color: p.color,
    words: p.words.slice(),
  });
  saveSettings();
  renderCategories();
  renderPresets();
  broadcastReload();
}

// Re-localize preset categories to a language (name + words). Custom categories
// are left untouched. Returns true if anything changed.
function relocalizeCategories(lang) {
  const byId = {};
  getPresets(lang).forEach((p) => { byId[p.id] = p; });
  let changed = false;
  state.categories = state.categories.map((c) => {
    const base = presetBaseId(c.id);
    if (base && byId[base]) {
      const p = byId[base];
      changed = true;
      return { id: "preset_" + base, name: p.name, color: p.color, enabled: c.enabled !== false, words: p.words.slice() };
    }
    return c;
  });
  return changed;
}

// --- Excluded sites ---
document.getElementById("exclCurrentBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].url) return;
    try { addExcluded(new URL(tabs[0].url).hostname); } catch (e) {}
  });
});
document.getElementById("addExclBtn").addEventListener("click", () => {
  const input = document.getElementById("newExclDomain");
  addExcluded(input.value);
  input.value = "";
});
document.getElementById("newExclDomain").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("addExclBtn").click();
});

function addExcluded(rawDomain) {
  const d = normalizeDomain(rawDomain);
  if (!d || !d.includes(".")) return;
  if (state.excludedSites.includes(d)) return;
  state.excludedSites.push(d);
  saveSettings();
  renderExcluded();
  broadcastReload();
}

function normalizeDomain(input) {
  let d = String(input || "").trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "").replace(/^www\./, "");
  d = d.split("/")[0].split("?")[0].split("#")[0];
  return d;
}

// --- Render categories ---
function renderCategories() {
  const list = document.getElementById("catList");
  list.innerHTML = "";
  document.getElementById("emptyCats").hidden = state.categories.length > 0;

  state.categories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "cat-card";
    card.dataset.id = cat.id;

    card.innerHTML = `
      <div class="cat-header">
        <div class="cat-dot" style="background:${cat.color}"></div>
        <div class="cat-name">${esc(cat.name)}</div>
        <span class="cat-count">${cat.words.length} ${esc(tr("words"))}</span>
        <label class="switch" title="${esc(cat.name)}">
          <input type="checkbox" class="cat-toggle" ${cat.enabled ? "checked" : ""}/>
          <span class="slider"></span>
        </label>
        <span class="cat-chevron">▼</span>
      </div>
      <div class="cat-body">
        <textarea class="words-area" placeholder="${esc(tr("wordsPlaceholder"))}">${esc(cat.words.join(", "))}</textarea>
        <p class="words-hint">${esc(tr("wordsHint"))}</p>
        <div class="cat-actions">
          <button class="btn-save">${esc(tr("save"))} <span class="saved-flash">✓</span></button>
          <button class="btn-delete">🗑 ${esc(tr("deleteCat"))}</button>
        </div>
      </div>
    `;

    card.querySelector(".cat-header").addEventListener("click", (e) => {
      if (e.target.closest(".switch")) return;
      card.classList.toggle("open");
    });

    card.querySelector(".cat-toggle").addEventListener("change", (e) => {
      cat.enabled = e.target.checked;
      saveSettings();
      broadcastReload();
    });

    card.querySelector(".btn-save").addEventListener("click", () => {
      cat.words = parseWords(card.querySelector(".words-area").value);
      card.querySelector(".cat-count").textContent = `${cat.words.length} ${tr("words")}`;
      saveSettings();
      broadcastReload();
      const flash = card.querySelector(".saved-flash");
      flash.classList.add("show");
      setTimeout(() => flash.classList.remove("show"), 1500);
    });

    card.querySelector(".btn-delete").addEventListener("click", () => {
      if (!confirm(fmt(tr("deleteConfirm"), { name: cat.name }))) return;
      state.categories = state.categories.filter((c) => c.id !== cat.id);
      saveSettings();
      broadcastReload();
      renderCategories();
      renderPresets();
    });

    list.appendChild(card);
  });
}

// --- Render excluded sites ---
function renderExcluded() {
  const list = document.getElementById("exclList");
  list.innerHTML = "";

  if (state.excludedSites.length === 0) {
    list.innerHTML = `<p class="excl-empty">${esc(tr("exclEmpty"))}</p>`;
    return;
  }

  state.excludedSites.forEach((domain, idx) => {
    const row = document.createElement("div");
    row.className = "excl-row";
    row.innerHTML = `
      <span class="excl-domain">🚫 ${esc(domain)}</span>
      <button class="excl-remove" title="✕">✕</button>
    `;
    row.querySelector(".excl-remove").addEventListener("click", () => {
      state.excludedSites.splice(idx, 1);
      saveSettings();
      renderExcluded();
      broadcastReload();
    });
    list.appendChild(row);
  });
}

// --- Reload every open tab, not just the active one ---
function broadcastReload() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tb) => {
      if (tb.id != null) chrome.tabs.sendMessage(tb.id, { type: "RELOAD" }).catch(() => {});
    });
  });
}

function withActiveTab(cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id != null) cb(tabs[0].id);
  });
}

// --- Reveal hidden items on the current page ---
function setRevealButton(count, revealed) {
  const btn = document.getElementById("revealBtn");
  if (!count) {
    btn.disabled = true;
    btn.classList.remove("active");
    btn.textContent = tr("revealNothing");
    return;
  }
  btn.disabled = false;
  btn.classList.toggle("active", revealed);
  btn.textContent = revealed ? `${tr("hideAgain")} (${count})` : `👁 ${tr("reveal")} (${count})`;
}

function refreshRevealButton() {
  withActiveTab((tabId) => {
    chrome.tabs.sendMessage(tabId, { type: "GET_HIDDEN_STATE" }, (resp) => {
      if (chrome.runtime.lastError || !resp) { setRevealButton(0, false); return; }
      setRevealButton(resp.count, resp.revealed);
    });
  });
}

document.getElementById("revealBtn").addEventListener("click", () => {
  withActiveTab((tabId) => {
    chrome.tabs.sendMessage(tabId, { type: "TOGGLE_REVEAL" }, (resp) => {
      if (chrome.runtime.lastError || !resp) return;
      setRevealButton(resp.count, resp.revealed);
    });
  });
});

// --- Backup: export / import settings ---
function showBackup(text, cls) {
  const el = document.getElementById("backupMsg");
  el.textContent = text;
  el.className = "backup-msg " + (cls || "");
  setTimeout(() => { el.textContent = ""; el.className = "backup-msg"; }, 4000);
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const data = {
    app: "ClearFeed", version: 2,
    enabled: state.enabled, uiLang: state.uiLang,
    categories: state.categories, excludedSites: state.excludedSites
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "clearfeed-settings.json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showBackup(tr("exported"), "ok");
});

document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = sanitizeSettings(JSON.parse(reader.result));
      state.enabled = parsed.enabled;
      state.categories = parsed.categories;
      state.excludedSites = parsed.excludedSites;
      if (parsed.uiLang) state.uiLang = parsed.uiLang;
      if (parsed.theme) state.theme = parsed.theme;
      saveSettings();
      applyTheme(state.theme);
      buildLangOptions();
      applyI18n();
      setMasterToggle(state.enabled);
      renderCategories();
      renderPresets();
      renderExcluded();
      broadcastReload();
      showBackup(fmt(tr("importedN"), { n: state.categories.length }), "ok");
    } catch (err) {
      showBackup(tr("importFail"), "err");
    }
  };
  reader.onerror = () => showBackup(tr("importFail"), "err");
  reader.readAsText(file);
  e.target.value = "";
});

// Validate + normalize an imported settings object. Throws on invalid input.
// Colors are restricted to hex so they can't break out of the inline style.
function sanitizeSettings(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    throw new Error("Not a valid settings file.");
  }
  if (!Array.isArray(obj.categories)) {
    throw new Error("Settings file has no categories.");
  }
  const categories = obj.categories.map((c, i) => {
    if (!c || typeof c !== "object") throw new Error("Invalid category in file.");
    const color = (typeof c.color === "string" && /^#[0-9a-fA-F]{3,8}$/.test(c.color))
      ? c.color : "#888888";
    return {
      id: (typeof c.id === "string" && c.id) ? c.id : "cat_" + i,
      name: String(c.name == null ? "Unnamed" : c.name).slice(0, 40),
      enabled: c.enabled !== false,
      color,
      words: Array.isArray(c.words)
        ? c.words.map((w) => String(w).toLowerCase().trim()).filter((w) => w.length > 1)
        : []
    };
  });
  const excludedSites = Array.isArray(obj.excludedSites)
    ? obj.excludedSites.map((d) => String(d).toLowerCase().trim()).filter(Boolean)
    : [];
  const uiLang = (typeof obj.uiLang === "string" && uiLangCodes().includes(obj.uiLang))
    ? obj.uiLang : undefined;
  const theme = (obj.theme === "light" || obj.theme === "dark") ? obj.theme : undefined;
  return { enabled: obj.enabled !== false, categories, excludedSites, uiLang, theme };
}

// --- Helpers ---
function parseWords(raw) {
  return raw.split(/[\n,]+/).map((w) => w.trim().toLowerCase()).filter((w) => w.length > 1);
}

function saveSettings() {
  chrome.storage.local.set({
    enabled: state.enabled,
    uiLang: state.uiLang,
    theme: state.theme,
    categories: state.categories,
    excludedSites: state.excludedSites
  });
}

function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])
  );
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "COUNT_UPDATE") {
    document.getElementById("count").textContent = msg.count;
  }
});
