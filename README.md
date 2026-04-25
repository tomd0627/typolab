# TypoLab

An interactive variable font explorer. Load any font from a curated catalog of Google Fonts, manipulate its variable axes in real time, and export production-ready CSS.

**Live demo:** https://typolab.netlify.app _(placeholder — update after deploy)_

---

## What it does

- **Search** 20 curated variable fonts by name with keyboard-navigable results
- **Preset chips** for quick access to the most axis-rich fonts (Fraunces, Roboto Flex, Recursive, and others)
- **Axis sliders** — every variable axis exposed as a labeled range input with live preview; defaults and ranges come from the font's actual spec
- **Size and leading controls** on the specimen panel
- **Editable specimen text** — click to type your own copy
- **CSS snippet** — auto-generated, production-ready output including `@import`, `font-weight`, `font-stretch`, `font-style`, `font-optical-sizing`, and `font-variation-settings` as appropriate for each font's axes
- **Dark / light theme** with `prefers-color-scheme` detection and `localStorage` persistence
- Fully keyboard-accessible; skip link, focus management, ARIA live regions

---

## Tech stack

Vanilla HTML, CSS, and JavaScript — no framework, no bundler, no runtime dependencies.

That was a deliberate choice. The project is a typography tool; the CSS is the product. A build step and component abstraction would add noise without value. ES modules handle the only real modularity concern (separating font loading, axis rendering, snippet generation, etc.). The result is a file you can open directly in a browser or deploy by dropping a folder on a CDN.

| Concern | Approach |
|---|---|
| Styling | Custom properties throughout; `@layer` cascade; logical properties |
| Font loading | Google Fonts `<link>` injection + `document.fonts.load()` with 6 s timeout |
| State | Module-level variables; no store |
| Theme | `data-theme` attribute on `<html>`; inline script prevents flash |
| Deployment | Netlify static; `_redirects` + `netlify.toml` for headers |

---

## Local development

No install required to run the app. Serve the project root over HTTP (browsers block ES module imports from `file://`):

```
npx serve .
```

Then open `http://localhost:3000`.

---

## Pre-commit hooks

The repo uses Husky + lint-staged to run Prettier, ESLint, and Stylelint on every commit. To set them up after cloning:

```
npm install
```

That's it — `npm install` triggers the `prepare` script which initialises Husky automatically.

What runs on commit:

| File type | Pipeline |
|---|---|
| `*.js` | Prettier → ESLint --fix |
| `*.css` | Prettier → Stylelint --fix |
| `*.html` | Prettier |

ESLint is configured with flat config (`eslint.config.js`): no unused variables, no `console.log`, strict equality enforced.

Stylelint enforces alphabetical property order, CSS logical properties, no duplicate selectors, and no unnecessary vendor prefixes (`stylelint.config.js`).

---

## Project structure

```
typolab/
├── index.html              # Single page; all markup
├── css/
│   ├── style.css           # @layer declarations and @imports
│   ├── tokens.css          # Design tokens (colors, spacing, type scale, radii)
│   ├── reset.css           # Minimal modern reset
│   ├── layout.css          # Header, search, presets strip, workspace grid
│   └── components.css      # Sliders, snippet block, buttons, focus styles
├── js/
│   ├── main.js             # Bootstrap, search wiring, font-load orchestration
│   ├── catalog.js          # Font catalog (20 fonts), search, URL builder
│   ├── fonts.js            # Google Fonts <link> injection and load detection
│   ├── axes.js             # Axis slider rendering and value collection
│   ├── snippet.js          # CSS snippet generation
│   ├── specimen.js         # Specimen text, size/leading controls
│   ├── theme.js            # Dark/light toggle
│   └── copy.js             # Clipboard copy with fallback
├── assets/
│   └── favicon.svg
├── netlify.toml
└── _redirects
```
