const btn = document.getElementById("copy-btn");
const label = btn.querySelector(".copy-label");

let resetTimer = null;

export function initCopy(getText) {
  btn.addEventListener("click", async () => {
    const text = getText();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showCopied();
    } catch {
      fallbackCopy(text);
      showCopied();
    }
  });
}

function showCopied() {
  if (resetTimer) clearTimeout(resetTimer);
  btn.classList.add("is-copied");
  label.textContent = "Copied!";
  btn.setAttribute("aria-label", "Copied to clipboard");

  resetTimer = setTimeout(() => {
    btn.classList.remove("is-copied");
    label.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy CSS snippet to clipboard");
  }, 2000);
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}
