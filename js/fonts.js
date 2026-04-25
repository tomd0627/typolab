import { buildFontUrl } from "./catalog.js";

const LINK_ID = "typolab-font-link";
const LOAD_TIMEOUT_MS = 6000;

export async function loadFont(fontEntry) {
  const url = buildFontUrl(fontEntry);
  const link = injectLink(url);

  await stylesheetReady(link);

  return fontPresent(fontEntry.family);
}

function injectLink(url) {
  const existing = document.getElementById(LINK_ID);
  if (existing && existing.href === url) return existing;
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.id = LINK_ID;
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
  return link;
}

function stylesheetReady(link) {
  if (link.sheet) return Promise.resolve();
  return new Promise((resolve) => {
    link.addEventListener("load", resolve, { once: true });
    link.addEventListener("error", resolve, { once: true });
  });
}

async function fontPresent(family) {
  const descriptor = `400 1em "${family}"`;
  try {
    const result = await Promise.race([
      document.fonts.load(descriptor),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), LOAD_TIMEOUT_MS)),
    ]);
    return Array.isArray(result) && result.length > 0;
  } catch {
    return false;
  }
}
