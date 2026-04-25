const STORAGE_KEY = "typolab-theme";
const btn = document.getElementById("theme-toggle");

export function initTheme() {
  updateLabel();

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
    updateLabel();
  });
}

function updateLabel() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}
