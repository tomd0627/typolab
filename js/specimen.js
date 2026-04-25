const specimenEl = document.getElementById("specimen-text");
const fontNameEl = document.getElementById("specimen-font-name");
const sizeSlider = document.getElementById("specimen-size");
const sizeValue = document.getElementById("specimen-size-value");
const leadingSlider = document.getElementById("specimen-leading");
const leadingValue = document.getElementById("specimen-leading-value");
const loadingEl = document.getElementById("specimen-loading");
const errorEl = document.getElementById("specimen-error");
const errorMsgEl = document.getElementById("error-message-text");

export function initSpecimen(onSizeChange) {
  syncTrack(sizeSlider);
  syncTrack(leadingSlider);

  specimenEl.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const focusable = [
      ...document.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), [contenteditable]"
      ),
    ].filter((el) => !el.closest("[hidden]") && el.offsetParent !== null);
    const i = focusable.indexOf(specimenEl);
    const target = focusable[e.shiftKey ? i - 1 : i + 1];
    if (target) target.focus();
  });

  sizeSlider.addEventListener("input", () => {
    sizeValue.textContent = sizeSlider.value;
    specimenEl.style.fontSize = `${sizeSlider.value}px`;
    syncTrack(sizeSlider);
    if (onSizeChange) onSizeChange();
  });

  leadingSlider.addEventListener("input", () => {
    leadingValue.textContent = Number(leadingSlider.value).toFixed(2);
    specimenEl.style.lineHeight = leadingSlider.value;
    syncTrack(leadingSlider);
    if (onSizeChange) onSizeChange();
  });

  specimenEl.style.fontSize = `${sizeSlider.value}px`;
  specimenEl.style.lineHeight = leadingSlider.value;
}

export function applyFont(fontFamily, axisValues) {
  specimenEl.style.fontFamily = `'${fontFamily}', sans-serif`;
  specimenEl.style.fontVariationSettings = buildVariationSettings(axisValues);
  fontNameEl.textContent = fontFamily;
}

export function showLoading() {
  loadingEl.hidden = false;
  errorEl.hidden = true;
  specimenEl.style.opacity = "0.4";
}

export function showError(message) {
  loadingEl.hidden = true;
  errorMsgEl.textContent = message;
  errorEl.hidden = false;
  specimenEl.style.opacity = "1";
}

export function showSpecimen() {
  loadingEl.hidden = true;
  errorEl.hidden = true;
  specimenEl.style.opacity = "1";
}

export function getFontSize() {
  return Number(sizeSlider.value);
}

export function getLineHeight() {
  return Number(leadingSlider.value).toFixed(2);
}

function buildVariationSettings(axisValues) {
  const pairs = Object.entries(axisValues)
    .map(([tag, val]) => `'${tag}' ${val}`)
    .join(", ");
  return pairs || "normal";
}

function syncTrack(input) {
  const min = Number(input.min);
  const max = Number(input.max);
  const val = Number(input.value);
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty("--progress", `${pct}%`);
}
