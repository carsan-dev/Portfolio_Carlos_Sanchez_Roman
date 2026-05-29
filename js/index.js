document.addEventListener("DOMContentLoaded", () => {
  const bootOverlay = document.getElementById("boot-overlay");
  const closeBootOverlay = () => bootOverlay?.classList.add("is-done");

  window.setTimeout(closeBootOverlay, 1800);
  window.addEventListener("load", () => window.setTimeout(closeBootOverlay, 1800), { once: true });
  ["click", "keydown", "wheel", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, closeBootOverlay, { once: true, passive: true });
  });

  const workspaceStatus = document.getElementById("workspace-status");
  const workspaceStatusText = workspaceStatus?.querySelector(".workspace-status-text");
  window.setTimeout(() => {
    workspaceStatus?.classList.add("is-ready");
    if (workspaceStatusText) {
      workspaceStatusText.textContent = "WORKSPACE INITIALIZED!";
    }
  }, 3000);

  console.log("Workspace Initialized. Welcome, Architect.");
});
