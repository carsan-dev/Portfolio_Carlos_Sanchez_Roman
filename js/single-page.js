document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll(".portfolio-section"));
  const currentRoute = document.getElementById("current-route");
  const routeById = {
    root: "portfolio/root.ts",
    projects: "portfolio/projects.ts",
    gallery: "portfolio/gallery.ts",
    experience: "portfolio/experience.ts",
    education: "portfolio/education.ts",
    "ia-lab": "portfolio/ia-focus.ts",
    contact: "portfolio/contacto.json",
  };

  let activeRoute = currentRoute?.textContent || "";

  const setActive = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      link.classList.toggle("text-primary", isActive);
      link.classList.toggle("bg-primary/5", isActive);
      link.classList.toggle("text-on-surface-variant", !isActive);
    });

    if (currentRoute && routeById[id] && activeRoute !== routeById[id]) {
      currentRoute.textContent = routeById[id];
      activeRoute = routeById[id];
      currentRoute.classList.remove("route-flash");
      void currentRoute.offsetWidth;
      currentRoute.classList.add("route-flash");
    }
  };

  const updateActiveFromScroll = () => {
    const isAtPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    if (isAtPageEnd && sections.length) {
      setActive(sections[sections.length - 1].id);
      return;
    }

    const marker = window.scrollY + 96;
    const current = sections.reduce((active, section) => {
      return section.offsetTop <= marker ? section : active;
    }, sections[0]);

    if (current) {
      setActive(current.id);
    }
  };

  window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
  window.addEventListener("resize", updateActiveFromScroll);
  updateActiveFromScroll();

  const motionTargets = [
    ".root-section > section",
    ".projects-section .glass-panel",
    ".gallery-card",
    ".experience-section .relative.group",
    ".education-section .glass-card",
    ".ia-lab-section .glass-card",
    ".contact-section .glass-panel",
  ];

  const revealItems = Array.from(document.querySelectorAll(motionTargets.join(",")));
  revealItems.forEach((item, index) => {
    item.classList.add("motion-reveal");
    item.style.setProperty("--motion-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  const isInitiallyVisible = (item) => {
    const rect = item.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
  };

  revealItems.filter(isInitiallyVisible).forEach((item) => {
    item.classList.add("motion-visible");
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("motion-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    revealItems
      .filter((item) => !item.classList.contains("motion-visible"))
      .forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("motion-visible"));
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-motion-visible");
        }
      });
    }, { threshold: 0.25 });

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    sections.forEach((section) => section.classList.add("section-motion-visible"));
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let modelViewerScriptPromise;
  const loadModelViewerScript = () => {
    if (customElements.get("model-viewer")) return Promise.resolve();
    if (modelViewerScriptPromise) return modelViewerScriptPromise;

    modelViewerScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js";
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });

    return modelViewerScriptPromise;
  };

  const mountHeroModel = (stage) => {
    if (!stage || stage.dataset.modelMounted === "true") return;

    const status = stage.querySelector("[data-model-status]");
    stage.dataset.modelMounted = "true";
    stage.classList.add("is-loading");
    if (status) {
      status.textContent = "Cargando modelo 3D";
    }

    loadModelViewerScript()
      .then(() => {
        const viewer = document.createElement("model-viewer");
        viewer.setAttribute("src", stage.dataset.modelSrc || "");
        viewer.setAttribute("alt", stage.dataset.modelAlt || "Modelo 3D");
        viewer.setAttribute("camera-controls", "");
        viewer.setAttribute("animation-name", "Scene");
        viewer.setAttribute("camera-orbit", "35deg 68deg 105%");
        viewer.setAttribute("field-of-view", "34deg");
        viewer.setAttribute("interaction-prompt", "none");
        viewer.setAttribute("loading", "lazy");
        viewer.setAttribute("reveal", "auto");
        viewer.setAttribute("shadow-intensity", "0.55");
        viewer.setAttribute("exposure", "0.95");
        viewer.setAttribute("environment-image", "neutral");
        if (!prefersReducedMotion) {
          viewer.setAttribute("autoplay", "");
        }

        const showLoadedModel = () => {
          stage.classList.remove("is-loading");
          stage.classList.add("is-model-active");
          viewer.classList.add("is-loaded");
          if (status) {
            status.textContent = "Modelo 3D activo";
          }
        };

        viewer.addEventListener("model-visibility", (event) => {
          if (event.detail.visible) {
            showLoadedModel();
          }
        });

        viewer.addEventListener("load", () => {
          window.setTimeout(() => {
            if (!viewer.classList.contains("is-loaded")) {
              showLoadedModel();
            }
          }, 350);
        }, { once: true });

        viewer.addEventListener("error", () => {
          stage.classList.remove("is-loading");
          stage.dataset.modelMounted = "false";
          if (status) {
            status.textContent = "No se pudo cargar el modelo 3D";
          }
        }, { once: true });

        stage.appendChild(viewer);
      })
      .catch(() => {
        stage.classList.remove("is-loading");
        stage.dataset.modelMounted = "false";
        if (status) {
          status.textContent = "No se pudo cargar el visor 3D";
        }
      });
  };

  document.querySelectorAll("[data-model-stage]").forEach((stage) => {
    stage.querySelector("[data-load-model]")?.addEventListener("click", () => mountHeroModel(stage));

    if (window.matchMedia("(min-width: 768px)").matches) {
      const scheduleMount = () => mountHeroModel(stage);
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(scheduleMount, { timeout: 2200 });
      } else {
        window.setTimeout(scheduleMount, 1200);
      }
    }
  });

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

  const lightbox = document.getElementById("screenshot-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeLightbox = () => {
    lightbox?.classList.remove("is-open");
    lightbox?.setAttribute("aria-hidden", "true");
    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
      lightboxImage.removeAttribute("alt");
    }
  };

  document.querySelectorAll(".project-shot img, .gallery-card figure img").forEach((image) => {
    image.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!lightbox || !lightboxImage) return;

      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "Captura ampliada";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.closest(".lightbox-close")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
});
