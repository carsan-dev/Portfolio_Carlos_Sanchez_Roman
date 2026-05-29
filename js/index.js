document.addEventListener("DOMContentLoaded", () => {
  const bootOverlay = document.getElementById("boot-overlay");
  const closeBootOverlay = () => bootOverlay?.classList.add("is-done");

  window.setTimeout(closeBootOverlay, 1800);
  window.addEventListener("load", () => window.setTimeout(closeBootOverlay, 1800), { once: true });
  ["click", "keydown", "wheel", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, closeBootOverlay, { once: true, passive: true });
  });

  console.log("Workspace Initialized. Welcome, Architect.");
});
