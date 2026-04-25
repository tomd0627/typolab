const container = document.getElementById("axes-container");
const emptyState = document.getElementById("axes-empty");

let currentAxes = [];
let onChangeCb = null;

export function renderAxes(axes, onChange) {
  currentAxes = axes;
  onChangeCb = onChange;

  const sliders = container.querySelectorAll(".axis-item");
  sliders.forEach((el) => el.remove());

  if (axes.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  axes.forEach((axis) => {
    const item = buildAxisItem(axis);
    container.appendChild(item);
  });
}

export function getAxisValues() {
  const values = {};
  currentAxes.forEach((axis) => {
    const input = document.getElementById(`axis-${axis.tag}`);
    if (input) values[axis.tag] = Number(input.value);
  });
  return values;
}

export function resetAxes() {
  currentAxes.forEach((axis) => {
    const input = document.getElementById(`axis-${axis.tag}`);
    const display = document.getElementById(`axis-${axis.tag}-value`);
    if (!input) return;
    input.value = axis.default;
    if (display) display.textContent = formatValue(axis.default, axis.step);
    updateTrack(input);
  });
  if (onChangeCb) onChangeCb();
}

function buildAxisItem(axis) {
  const item = document.createElement("div");
  item.className = "axis-item";

  const header = document.createElement("div");
  header.className = "axis-header";

  const name = document.createElement("span");
  name.className = "axis-name";
  name.textContent = axis.label;

  const tag = document.createElement("code");
  tag.className = "axis-tag";
  tag.textContent = axis.tag;

  const value = document.createElement("span");
  value.className = "axis-value";
  value.id = `axis-${axis.tag}-value`;
  value.textContent = formatValue(axis.default, axis.step);

  header.append(name, tag, value);

  const input = document.createElement("input");
  input.type = "range";
  input.className = "axis-slider";
  input.id = `axis-${axis.tag}`;
  input.min = axis.min;
  input.max = axis.max;
  input.step = axis.step;
  input.value = axis.default;
  input.setAttribute("aria-label", `${axis.label} axis (${axis.tag})`);

  updateTrack(input);

  input.addEventListener("input", () => {
    const v = Number(input.value);
    value.textContent = formatValue(v, axis.step);
    updateTrack(input);
    if (onChangeCb) onChangeCb();
  });

  const range = document.createElement("div");
  range.className = "axis-range";
  range.innerHTML = `<span>${axis.min}</span><span>${axis.max}</span>`;

  item.append(header, input, range);
  return item;
}

function formatValue(v, step) {
  if (step < 1) {
    const decimals = step.toString().split(".")[1]?.length ?? 2;
    return v.toFixed(decimals);
  }
  return String(v);
}

function updateTrack(input) {
  const min = Number(input.min);
  const max = Number(input.max);
  const val = Number(input.value);
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty("--progress", `${pct}%`);
}
