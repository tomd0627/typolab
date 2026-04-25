import { buildFontUrl } from "./catalog.js";

const REGISTERED_AXES = new Set(["ital", "opsz", "slnt", "wdth", "wght"]);

const CATEGORY_FALLBACKS = {
  serif: "serif",
  "sans-serif": "sans-serif",
  monospace: "monospace",
  display: "sans-serif",
  handwriting: "cursive",
};

export function generateSnippet(fontEntry, axisValues, fontSize, lineHeight) {
  const importUrl = buildFontUrl(fontEntry);
  const fallback = CATEGORY_FALLBACKS[fontEntry.category] ?? "sans-serif";

  const lines = [];

  lines.push(`@import url('${importUrl}');`, "");
  lines.push(".text {");
  lines.push(`  font-family: '${fontEntry.family}', ${fallback};`);
  lines.push(`  font-size: ${fontSize}px;`);
  lines.push(`  line-height: ${lineHeight};`);

  const registeredProps = buildRegisteredProps(fontEntry.axes, axisValues);
  registeredProps.forEach((line) => lines.push(`  ${line}`));

  const customAxes = fontEntry.axes.filter((a) => !REGISTERED_AXES.has(a.tag));
  const opszManual = fontEntry.axes.find((a) => a.tag === "opsz");

  const variationPairs = [];

  if (opszManual && "opsz" in axisValues) {
    variationPairs.push(`'opsz' ${axisValues.opsz}`);
  }

  customAxes.forEach((axis) => {
    if (axis.tag in axisValues) {
      variationPairs.push(`'${axis.tag}' ${axisValues[axis.tag]}`);
    }
  });

  if (variationPairs.length > 0) {
    if (opszManual) {
      lines.push("  font-optical-sizing: none;");
    }
    if (variationPairs.length === 1) {
      lines.push(`  font-variation-settings: ${variationPairs[0]};`);
    } else {
      lines.push("  font-variation-settings:");
      variationPairs.forEach((pair, i) => {
        const comma = i < variationPairs.length - 1 ? "," : ";";
        lines.push(`    ${pair}${comma}`);
      });
    }
  }

  lines.push("}");

  return lines.join("\n");
}

function buildRegisteredProps(axes, values) {
  const props = [];

  if (axes.find((a) => a.tag === "wght") && "wght" in values) {
    props.push(`font-weight: ${values.wght};`);
  }

  if (axes.find((a) => a.tag === "wdth") && "wdth" in values && values.wdth !== 100) {
    props.push(`font-stretch: ${values.wdth}%;`);
  }

  if (axes.find((a) => a.tag === "slnt") && "slnt" in values && values.slnt !== 0) {
    props.push(`font-style: oblique ${Math.abs(values.slnt)}deg;`);
  }

  return props;
}

export function updateSnippet(fontEntry, axisValues, fontSize, lineHeight) {
  const el = document.getElementById("snippet-code");
  if (!el) return;
  el.textContent = generateSnippet(fontEntry, axisValues, fontSize, lineHeight);
}
