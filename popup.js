// =============================================
//  ClearFeed — popup.js  (v1.4)
// =============================================

// Sport is seeded from words.js (DEFAULT_SPORT_WORDS) on first run,
// then becomes a normal editable category stored in chrome.storage.
const DEFAULT_CATEGORIES = [
  {
    id: "sport",
    name: "Sport",
    enabled: true,
    color: "#e74c3c",
    words: (typeof DEFAULT_SPORT_WORDS !== "undefined") ? DEFAULT_SPORT_WORDS.slice() : []
  }
];

const COLORS = ["#e74c3c","#e67e22","#f39c12","#27ae60","#2980b9","#8e44ad","#16a085","#c0392b"];

let state = { enabled: true, blockedTotal: 0, categories: [], excludedSites: [] };

// --- Init ---
chrome.storage.local.get(["enabled","blockedTotal","categories","excludedSites"], (data) => {
  state.enabled       = data.enabled !== false;
  state.blockedTotal  = data.blockedTotal || 0;
  state.categories    = data.categories  || DEFAULT_CATEGORIES;
  state.excludedSites = data.excludedSites || [];

  document.getElementById("count").textContent = state.blockedTotal;
  setMasterToggle(state.enabled);

  renderCategories();
  renderExcluded();
});

// --- Master toggle ---
function setMasterToggle(enabled) {
  document.getElementById("masterToggle").checked = enabled;
  const label = document.getElementById("masterLabel");
  label.textContent = enabled ? "Blocking active" : "Blocking paused";
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

// --- Add category ---
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

// --- Excluded sites ---
document.getElementById("exclCurrentBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].url) return;
    try {
      const host = new URL(tabs[0].url).hostname;
      addExcluded(host);
    } catch (e) {}
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
  if (!d || !d.includes(".")) return;        // simple validation
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

  state.categories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "cat-card";
    card.dataset.id = cat.id;

    card.innerHTML = `
      <div class="cat-header">
        <div class="cat-dot" style="background:${cat.color}"></div>
        <div class="cat-name">${esc(cat.name)}</div>
        <span class="cat-count">${cat.words.length} words</span>
        <label class="switch" title="Enable / disable category">
          <input type="checkbox" class="cat-toggle" ${cat.enabled ? "checked" : ""}/>
          <span class="slider"></span>
        </label>
        <span class="cat-chevron">▼</span>
      </div>
      <div class="cat-body">
        <textarea class="words-area" placeholder="Separate words with commas or new lines…&#10;e.g. politics, election, government">${esc(cat.words.join(", "))}</textarea>
        <p class="words-hint">A word stem is enough — "elect" catches election, elections, electoral…</p>
        <div class="cat-actions">
          <button class="btn-save">Save <span class="saved-flash">✓</span></button>
          <button class="btn-delete">🗑 Delete category</button>
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
      const raw = card.querySelector(".words-area").value;
      cat.words = parseWords(raw);
      card.querySelector(".cat-count").textContent = `${cat.words.length} words`;
      saveSettings();
      broadcastReload();
      const flash = card.querySelector(".saved-flash");
      flash.classList.add("show");
      setTimeout(() => flash.classList.remove("show"), 1500);
    });

    card.querySelector(".btn-delete").addEventListener("click", () => {
      if (!confirm(`Delete the "${cat.name}" category?`)) return;
      state.categories = state.categories.filter((c) => c.id !== cat.id);
      saveSettings();
      broadcastReload();
      renderCategories();
    });

    list.appendChild(card);
  });
}

// --- Render excluded sites ---
function renderExcluded() {
  const list = document.getElementById("exclList");
  list.innerHTML = "";

  if (state.excludedSites.length === 0) {
    list.innerHTML = `<p class="excl-empty">None — blocking runs on every site.</p>`;
    return;
  }

  state.excludedSites.forEach((domain, idx) => {
    const row = document.createElement("div");
    row.className = "excl-row";
    row.innerHTML = `
      <span class="excl-domain">🚫 ${esc(domain)}</span>
      <button class="excl-remove" title="Remove">✕</button>
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

// --- Helpers ---
function parseWords(raw) {
  return raw.split(/[\n,]+/).map((w) => w.trim().toLowerCase()).filter((w) => w.length > 1);
}

function saveSettings() {
  chrome.storage.local.set({
    enabled: state.enabled,
    categories: state.categories,
    excludedSites: state.excludedSites
  });
}

function broadcastReload() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "RELOAD" }).catch(() => {});
    }
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
