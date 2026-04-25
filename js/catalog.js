export const FONTS = [
  {
    family: "Fraunces",
    category: "serif",
    axes: [
      { tag: "opsz", label: "Optical Size", min: 9, max: 144, default: 12, step: 1 },
      { tag: "wght", label: "Weight", min: 100, max: 900, default: 400, step: 1 },
      { tag: "SOFT", label: "Softness", min: 0, max: 100, default: 0, step: 1 },
      { tag: "WONK", label: "Wonky", min: 0, max: 1, default: 0, step: 1 },
    ],
  },
  {
    family: "Roboto Flex",
    category: "sans-serif",
    axes: [
      { tag: "opsz", label: "Optical Size", min: 8, max: 144, default: 14, step: 1 },
      { tag: "slnt", label: "Slant", min: -10, max: 0, default: 0, step: 0.5 },
      { tag: "wdth", label: "Width", min: 25, max: 151, default: 100, step: 1 },
      { tag: "wght", label: "Weight", min: 100, max: 1000, default: 400, step: 1 },
      { tag: "GRAD", label: "Grade", min: -200, max: 150, default: 0, step: 1 },
    ],
  },
  {
    family: "Recursive",
    category: "sans-serif",
    axes: [
      { tag: "slnt", label: "Slant", min: -15, max: 0, default: 0, step: 1 },
      { tag: "wght", label: "Weight", min: 300, max: 1000, default: 400, step: 1 },
      { tag: "CASL", label: "Casual", min: 0, max: 1, default: 0, step: 0.01 },
      { tag: "CRSV", label: "Cursive", min: 0, max: 1, default: 0.5, step: 0.01 },
      { tag: "MONO", label: "Monospace", min: 0, max: 1, default: 0, step: 0.01 },
    ],
  },
  {
    family: "Bricolage Grotesque",
    category: "sans-serif",
    axes: [
      { tag: "wdth", label: "Width", min: 75, max: 100, default: 100, step: 1 },
      { tag: "wght", label: "Weight", min: 200, max: 800, default: 400, step: 1 },
    ],
  },
  {
    family: "Playfair Display",
    category: "serif",
    axes: [{ tag: "wght", label: "Weight", min: 400, max: 900, default: 400, step: 1 }],
  },
  {
    family: "EB Garamond",
    category: "serif",
    axes: [{ tag: "wght", label: "Weight", min: 400, max: 800, default: 400, step: 1 }],
  },
  {
    family: "Source Code Pro",
    category: "monospace",
    axes: [{ tag: "wght", label: "Weight", min: 200, max: 900, default: 400, step: 1 }],
  },
  {
    family: "Inter",
    category: "sans-serif",
    axes: [
      { tag: "opsz", label: "Optical Size", min: 14, max: 32, default: 14, step: 1 },
      { tag: "wght", label: "Weight", min: 100, max: 900, default: 400, step: 1 },
    ],
  },
  {
    family: "DM Sans",
    category: "sans-serif",
    axes: [
      { tag: "opsz", label: "Optical Size", min: 9, max: 40, default: 14, step: 1 },
      { tag: "wght", label: "Weight", min: 100, max: 700, default: 400, step: 1 },
    ],
  },
  {
    family: "Nunito",
    category: "sans-serif",
    axes: [{ tag: "wght", label: "Weight", min: 200, max: 1000, default: 400, step: 1 }],
  },
  {
    family: "Cabin",
    category: "sans-serif",
    axes: [
      { tag: "wdth", label: "Width", min: 75, max: 100, default: 100, step: 1 },
      { tag: "wght", label: "Weight", min: 400, max: 700, default: 400, step: 1 },
    ],
  },
  {
    family: "Encode Sans",
    category: "sans-serif",
    axes: [
      { tag: "wdth", label: "Width", min: 75, max: 125, default: 100, step: 1 },
      { tag: "wght", label: "Weight", min: 100, max: 900, default: 400, step: 1 },
    ],
  },
  {
    family: "Crimson Pro",
    category: "serif",
    axes: [{ tag: "wght", label: "Weight", min: 200, max: 900, default: 400, step: 1 }],
  },
  {
    family: "Lora",
    category: "serif",
    axes: [{ tag: "wght", label: "Weight", min: 400, max: 700, default: 400, step: 1 }],
  },
  {
    family: "Plus Jakarta Sans",
    category: "sans-serif",
    axes: [{ tag: "wght", label: "Weight", min: 200, max: 800, default: 400, step: 1 }],
  },
  {
    family: "Outfit",
    category: "sans-serif",
    axes: [{ tag: "wght", label: "Weight", min: 100, max: 900, default: 400, step: 1 }],
  },
  {
    family: "Syne",
    category: "sans-serif",
    axes: [{ tag: "wght", label: "Weight", min: 400, max: 800, default: 400, step: 1 }],
  },
  {
    family: "Raleway",
    category: "sans-serif",
    axes: [{ tag: "wght", label: "Weight", min: 100, max: 900, default: 400, step: 1 }],
  },
  {
    family: "Josefin Sans",
    category: "sans-serif",
    axes: [{ tag: "wght", label: "Weight", min: 100, max: 700, default: 400, step: 1 }],
  },
  {
    family: "Barlow",
    category: "sans-serif",
    axes: [{ tag: "wght", label: "Weight", min: 100, max: 900, default: 400, step: 1 }],
  },
];

export function searchFonts(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return FONTS.filter((f) => f.family.toLowerCase().includes(q)).slice(0, 8);
}

export function getFontByName(name) {
  return FONTS.find((f) => f.family.toLowerCase() === name.toLowerCase()) ?? null;
}

export function sortAxes(axes) {
  return [...axes].sort((a, b) => {
    const aLower = a.tag === a.tag.toLowerCase();
    const bLower = b.tag === b.tag.toLowerCase();
    if (aLower && !bLower) return -1;
    if (!aLower && bLower) return 1;
    return a.tag.localeCompare(b.tag);
  });
}

export function buildFontUrl(fontEntry) {
  const sorted = sortAxes(fontEntry.axes);
  const tags = sorted.map((a) => a.tag).join(",");
  const range = sorted.map((a) => `${a.min}..${a.max}`).join(",");
  const family = fontEntry.family.replaceAll(" ", "+");
  return `https://fonts.googleapis.com/css2?family=${family}:${tags}@${range}&display=swap`;
}
