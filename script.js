// ============================================================
// BRANKET SOLUTIONS — shared behavior
// ============================================================

const WHATSAPP_NUMBER = "917709288772"; // +91 77092 88772, no spaces/plus for wa.me links
const EMAIL_ADDRESS = "branketsolutions@gmail.com";

// Enquiries submitted through the contact form are logged to a Google Sheet
// via a Google Apps Script Web App endpoint (see /backend/GOOGLE-SHEETS-SETUP.md
// in this project for the one-time setup).
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyi3WX8ELmfCNJxDiK1LBRlNgv3ALX3HyM2xIhbYekaTO-BMDOvKGpQDSZS2SwC3NlS/exec";

function waLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ---- Dark mode: applied before paint to avoid a flash of the wrong theme ----
(function initTheme(){
  const saved = localStorage.getItem("branket-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();

document.addEventListener("DOMContentLoaded", () => {
  // Preloader — hides once the page has actually finished loading
  const preloader = document.querySelector(".preloader");
  if (preloader){
    const hide = () => preloader.classList.add("hide");
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide);
    // Safety net so it never blocks the page if something stalls
    setTimeout(hide, 1800);
  }

  // Scroll progress bar
  const progress = document.querySelector(".scroll-progress");
  if (progress){
    const updateProgress = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      progress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : "0%";
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
  }

  // Dark mode toggle
  const themeToggle = document.querySelector(".theme-btn");
  if (themeToggle){
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("branket-theme", next);
    });
  }

  // Subtle hero parallax on mouse move (desktop only, respects reduced motion)
  const heroVisual = document.querySelector(".hero-visual");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroVisual && window.matchMedia("(pointer:fine)").matches && !prefersReduced){
    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.querySelectorAll(".hero-card").forEach((card, i) => {
        const depth = (i + 1) * 6;
        card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
    heroVisual.addEventListener("mouseleave", () => {
      heroVisual.querySelectorAll(".hero-card").forEach(card => { card.style.transform = ""; });
    });
  }

  // Auto-stagger reveal children within grids for a nicer cascade
  document.querySelectorAll(".grid-3, .grid-4").forEach(grid => {
    grid.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i, 5) * 0.08}s`;
    });
  });

  // Subtle tilt on cards (desktop only)
  if (window.matchMedia("(pointer:fine)").matches && !prefersReduced){
    document.querySelectorAll(".card, .industry-card, .blog-card").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  // Scroll-to-top button
  const scrollTopBtn = document.querySelector(".scroll-top");
  if (scrollTopBtn){
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("show", window.scrollY > 480);
    }, { passive: true });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Parallax drift for hero blobs / particles as the page scrolls (desktop, motion allowed)
  if (!prefersReduced){
    const parallaxEls = document.querySelectorAll(".hero .blob, .page-hero .blob");
    if (parallaxEls.length){
      window.addEventListener("scroll", () => {
        const y = window.scrollY;
        parallaxEls.forEach((el, i) => {
          const speed = 0.12 + i * 0.05;
          el.style.transform = `translateY(${y * speed}px)`;
        });
      }, { passive: true });
    }
  }

  // Wire every [data-wa] element to a contextual WhatsApp message
  document.querySelectorAll("[data-wa]").forEach(el => {
    const msg = el.getAttribute("data-wa") || "Hi Branket Solutions, I'd like to talk about a project.";
    el.setAttribute("href", waLink(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Navbar scroll state
  const nav = document.querySelector(".nav");
  if (nav){
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile menu toggle
  const toggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (toggle && mobileMenu){
    toggle.addEventListener("click", () => mobileMenu.classList.toggle("open"));
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => mobileMenu.classList.remove("open"));
    });
  }

  // Duplicate marquee content for seamless loop
  document.querySelectorAll(".marquee-track").forEach(track => {
    track.innerHTML += track.innerHTML;
  });

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(el => io.observe(el));
  }

  // Contact / Quote form handling — logs to Google Sheets via Apps Script,
  // with email/WhatsApp always offered as a direct alternative.
  const form = document.querySelector("#lead-form");
  if (form){
    const status = form.querySelector(".form-status");
    const submitBtn = form.querySelector('button[type="submit"]');

    const buildSummary = (data) => {
      const lines = [];
      for (const [key, value] of data.entries()){
        if (value) lines.push(`${key}: ${value}`);
      }
      return lines.join("\n");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const required = form.querySelectorAll("[required]");
      let missing = false;
      required.forEach(field => {
        if (!field.value.trim()){
          missing = true;
          field.style.borderColor = "var(--orange)";
        } else {
          field.style.borderColor = "";
        }
      });
      if (missing){
        status.textContent = "Please fill in the required fields before submitting.";
        status.className = "form-status err";
        return;
      }

      const summary = buildSummary(data);
      const name = data.get("name") || "Website visitor";

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      // Fire-and-forget to the Google Sheet log. Apps Script Web Apps don't
      // return readable CORS responses from a static page, so this is sent
      // in no-cors mode: the request still reaches the sheet and gets logged,
      // we just can't read a success/failure status back in the browser.
      try {
  const payload = {};
  for (const [key, value] of data.entries()) payload[key] = value;
  payload.source = "Website Contact Form";
  payload.page = window.location.pathname;

  fetch(SHEETS_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  }).catch(() => {});
} catch (err) { /* logging is best-effort; the enquiry still reaches us below */ }

      const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(`New inquiry — ${name}`)}&body=${encodeURIComponent(summary)}`;
      const waUrl = waLink(`Hi Branket Solutions, here are my project details:\n${summary}`);

      status.innerHTML = `Thanks, ${name.split(" ")[0] || "there"} — your enquiry has been received. ` +
        `We usually reply within a day. Prefer a faster response? ` +
        `<a href="${mailtoUrl}" style="color:var(--orange); text-decoration:underline;">Email us directly</a> or ` +
        `<a href="${waUrl}" target="_blank" rel="noopener" style="color:var(--orange); text-decoration:underline;">message us on WhatsApp</a>.`;
      status.className = "form-status ok";
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Project Details";
    });
  }
});
