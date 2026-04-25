import { searchFonts, getFontByName } from "./catalog.js";
import { loadFont } from "./fonts.js";
import { renderAxes, getAxisValues, resetAxes } from "./axes.js";
import { updateSnippet } from "./snippet.js";
import {
  initSpecimen,
  applyFont,
  showLoading,
  showError,
  showSpecimen,
  getFontSize,
  getLineHeight,
} from "./specimen.js";
import { initTheme } from "./theme.js";
import { initCopy } from "./copy.js";

const searchInput = document.getElementById("font-search");
const searchResultsEl = document.getElementById("search-results");
const searchErrorEl = document.getElementById("search-error");
const searchClearBtn = document.querySelector(".search-clear");
const presetChips = document.querySelectorAll(".preset-chip");
const resetBtn = document.getElementById("reset-axes");

let activeFontEntry = null;
let activeResultIndex = -1;
let loadingRequest = 0;

// ─── Bootstrap ──────────────────────────────────────────────────────────────

initTheme();
initSpecimen(onSizeChange);
initCopy(() => document.getElementById("snippet-code")?.textContent ?? "");
resetBtn.addEventListener("click", () => {
  resetAxes();
  refreshDisplay();
});

presetChips.forEach((chip) => {
  chip.addEventListener("click", () => selectFont(chip.dataset.font));
});

selectFont("Fraunces");

// ─── Search ──────────────────────────────────────────────────────────────────

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  searchClearBtn.hidden = !q;
  searchErrorEl.hidden = true;

  if (!q) {
    closeResults();
    return;
  }

  const results = searchFonts(q);
  renderResults(results, q);
});

searchInput.addEventListener("keydown", (e) => {
  const items = searchResultsEl.querySelectorAll("[role='option']");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeResultIndex = Math.min(activeResultIndex + 1, items.length - 1);
    setActiveResult(items, activeResultIndex);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeResultIndex = Math.max(activeResultIndex - 1, 0);
    setActiveResult(items, activeResultIndex);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (activeResultIndex >= 0 && items[activeResultIndex]) {
      items[activeResultIndex].click();
    } else {
      const exact = getFontByName(searchInput.value.trim());
      if (exact) {
        selectFont(exact.family);
        closeResults();
      } else {
        showSearchError(`"${searchInput.value.trim()}" not found in the catalog.`);
      }
    }
  } else if (e.key === "Escape") {
    closeResults();
    searchInput.blur();
  }
});

searchInput.addEventListener("focus", () => {
  if (searchInput.value.trim()) {
    const results = searchFonts(searchInput.value.trim());
    if (results.length) renderResults(results, searchInput.value.trim());
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) closeResults();
});

searchClearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchClearBtn.hidden = true;
  searchErrorEl.hidden = true;
  closeResults();
  searchInput.focus();
});

// ─── Font Loading ─────────────────────────────────────────────────────────────

async function selectFont(name) {
  const entry = getFontByName(name);
  if (!entry) {
    showSearchError(`"${name}" isn't in the catalog. Try searching for it.`);
    return;
  }

  const requestId = ++loadingRequest;

  setActivePreset(name);
  closeResults();
  searchInput.value = "";
  searchClearBtn.hidden = true;
  searchErrorEl.hidden = true;
  activeResultIndex = -1;

  showLoading();

  const loaded = await loadFont(entry);

  if (requestId !== loadingRequest) return;

  if (!loaded) {
    showError(`Could not load "${entry.family}". Check your connection and try again.`);
    return;
  }

  activeFontEntry = entry;
  renderAxes(entry.axes, refreshDisplay);
  refreshDisplay();
  showSpecimen();
}

// ─── Display Refresh ──────────────────────────────────────────────────────────

function refreshDisplay() {
  if (!activeFontEntry) return;
  const values = getAxisValues();
  applyFont(activeFontEntry.family, values);
  updateSnippet(activeFontEntry, values, getFontSize(), getLineHeight());
}

function onSizeChange() {
  if (!activeFontEntry) return;
  updateSnippet(activeFontEntry, getAxisValues(), getFontSize(), getLineHeight());
}

// ─── Search UI Helpers ────────────────────────────────────────────────────────

function renderResults(results, query) {
  if (!results.length) {
    closeResults();
    showSearchError(`No fonts found matching "${query}".`);
    return;
  }

  searchErrorEl.hidden = true;
  activeResultIndex = -1;

  searchResultsEl.innerHTML = "";
  results.forEach((font) => {
    const li = document.createElement("li");
    li.className = "search-result-item";
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", "false");
    li.dataset.font = font.family;
    li.innerHTML = `
      <span class="search-result-name">${escapeHtml(font.family)}</span>
      <span class="search-result-category">${escapeHtml(font.category)}</span>
    `;
    li.addEventListener("click", () => {
      selectFont(font.family);
    });
    li.addEventListener("mouseenter", () => {
      const items = searchResultsEl.querySelectorAll("[role='option']");
      activeResultIndex = [...items].indexOf(li);
      setActiveResult(items, activeResultIndex);
    });
    searchResultsEl.appendChild(li);
  });

  searchResultsEl.hidden = false;
  searchInput.setAttribute("aria-expanded", "true");
}

function closeResults() {
  searchResultsEl.hidden = true;
  searchResultsEl.innerHTML = "";
  searchInput.setAttribute("aria-expanded", "false");
  activeResultIndex = -1;
}

function setActiveResult(items, index) {
  items.forEach((item, i) => {
    const active = i === index;
    item.setAttribute("aria-selected", String(active));
    if (active) item.scrollIntoView({ block: "nearest" });
  });
}

function showSearchError(message) {
  searchErrorEl.textContent = message;
  searchErrorEl.hidden = false;
}

function setActivePreset(name) {
  presetChips.forEach((chip) => {
    const active = chip.dataset.font === name;
    chip.setAttribute("aria-pressed", String(active));
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
