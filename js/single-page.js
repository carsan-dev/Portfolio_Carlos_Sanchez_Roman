document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll(".portfolio-section"));
  const currentRoute = document.getElementById("current-route");
  const routeById = {
    root: "portfolio/root.ts",
    projects: "portfolio/projects.ts",
    experience: "portfolio/experience.ts",
    education: "portfolio/education.ts",
    "ia-lab": "portfolio/ia-lab.ts",
  };

  const setActive = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      link.classList.toggle("text-primary", isActive);
      link.classList.toggle("bg-primary/5", isActive);
      link.classList.toggle("text-on-surface-variant", !isActive);
    });

    if (currentRoute && routeById[id]) {
      currentRoute.textContent = routeById[id];
    }
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActive(visible.target.id);
    }
  }, {
    rootMargin: "-20% 0px -55% 0px",
    threshold: [0.12, 0.3, 0.6],
  });

  sections.forEach((section) => observer.observe(section));
  setActive("root");

  document.querySelectorAll("[data-line-numbers-for]").forEach((gutter) => {
    const code = document.getElementById(gutter.dataset.lineNumbersFor);
    if (!code) return;

    const lineCount = code.textContent.replace(/\n$/, "").split("\n").length;
    gutter.replaceChildren(...Array.from({ length: lineCount }, (_, index) => {
      const line = document.createElement("span");
      line.textContent = String(index + 1);
      return line;
    }));
  });
});
