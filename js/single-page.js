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

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("motion-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
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

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("model-viewer[autoplay]").forEach((viewer) => {
      viewer.removeAttribute("autoplay");
    });
  }

  document.querySelectorAll("model-viewer").forEach((viewer) => {
    const fallback = viewer.querySelector(".hero-model-fallback");
    viewer.addEventListener("load", () => {
      viewer.classList.add("is-loaded");
    }, { once: true });
    viewer.addEventListener("error", () => {
      viewer.classList.add("has-error");
      if (fallback) {
        fallback.textContent = "No se pudo cargar el modelo 3D";
      }
    }, { once: true });
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
