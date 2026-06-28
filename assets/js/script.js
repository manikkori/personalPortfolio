/* ═══════════════════════════════════════════
   MANIK PORTFOLIO — script.js
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────
   CUSTOM CURSOR
───────────────────────────── */
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");
let mouseX = 0,
  mouseY = 0;
let ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

(function tickRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top = ringY + "px";
  requestAnimationFrame(tickRing);
})();

/* hover expansion */
document
  .querySelectorAll(
    "a, button, .skill-card, .project-card, .metric-card, .edu-card, .tag",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });

/* hide cursor when it leaves window */
document.addEventListener("mouseleave", () => {
  cursor.style.opacity = "0";
  cursorRing.style.opacity = "0";
});
document.addEventListener("mouseenter", () => {
  cursor.style.opacity = "1";
  cursorRing.style.opacity = "1";
});

/* ─────────────────────────────
   NAVBAR SCROLL BEHAVIOUR
───────────────────────────── */
const navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  },
  { passive: true },
);

/* ─────────────────────────────
   MOBILE MENU
───────────────────────────── */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const mobileClose = document.getElementById("mobileClose");

function openMobile() {
  mobileNav.classList.add("open");
  hamburger.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeMobile() {
  mobileNav.classList.remove("open");
  hamburger.classList.remove("open");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  mobileNav.classList.contains("open") ? closeMobile() : openMobile();
});
mobileClose.addEventListener("click", closeMobile);
document
  .querySelectorAll("[data-mobile-link]")
  .forEach((a) => a.addEventListener("click", closeMobile));

/* ─────────────────────────────
   HERO ENTRANCE (GSAP tl)
───────────────────────────── */
window.addEventListener("load", () => {
  const heroImg = document.getElementById("heroCircle");

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to("#h-eyebrow", { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
    .to("#h-title", { opacity: 1, y: 0, duration: 0.8 }, "-=.4")
    .to("#h-sub", { opacity: 1, y: 0, duration: 0.7 }, "-=.5")
    .to("#h-actions", { opacity: 1, y: 0, duration: 0.6 }, "-=.4")
    .to("#h-stats", { opacity: 1, y: 0, duration: 0.6 }, "-=.4")
    .to(heroImg, { opacity: 1, duration: 1.0 }, "-=.8");

  /* floating bob on hero circle */
  gsap.to(heroImg, {
    y: -16,
    repeat: -1,
    yoyo: true,
    duration: 3.5,
    ease: "sine.inOut",
    delay: 1.5,
  });
});

/* ─────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
   using GSAP for smooth stagger
───────────────────────────── */
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        onComplete: () => el.classList.add("is-visible"),
      });
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ─────────────────────────────
   SKILL BAR ANIMATION
───────────────────────────── */
const skillFills = document.querySelectorAll(".skill-fill");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const fills = entry.target.querySelectorAll(".skill-fill");
      fills.forEach((fill, i) => {
        gsap.to(fill, {
          width: fill.dataset.width + "%",
          duration: 1.2,
          delay: i * 0.12,
          ease: "power2.out",
        });
      });
      skillObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.3 },
);

const skillsGrid = document.getElementById("skillsGrid");
if (skillsGrid) skillObserver.observe(skillsGrid);

/* ─────────────────────────────
   HERO STAT COUNTER
───────────────────────────── */
function animateCounter(el, target, duration = 1.4) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = (now - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll(".stat-num[data-count]");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.count));
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.8 },
);
statNums.forEach((el) => statObserver.observe(el));

/* ─────────────────────────────
   GSAP SCROLL PARALLAX
───────────────────────────── */
/* Hero bg glow moves slightly on scroll */
gsap.to(".hero-bg-glow", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
  y: 80,
  opacity: 0,
});

/* Hero content scrolls up faster */
gsap.to(".hero-content", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
  y: -60,
  opacity: 0.4,
});

/* Section titles slide + fade on scroll */
document.querySelectorAll(".section-title").forEach((title) => {
  gsap.fromTo(
    title,
    { x: -30, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
      },
    },
  );
});

/* Skill cards stagger on scroll */
gsap.fromTo(
  ".skill-card",
  { y: 40, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 0.65,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#skillsGrid",
      start: "top 80%",
    },
  },
);

/* Project cards stagger */
gsap.fromTo(
  ".project-card",
  { y: 50, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    stagger: 0.12,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".projects-grid",
      start: "top 80%",
    },
  },
);

/* Edu cards stagger */
gsap.fromTo(
  ".edu-card",
  { y: 35, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 0.65,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".edu-grid",
      start: "top 80%",
    },
  },
);

/* Footer wordmark fade-in on scroll */
gsap.fromTo(
  ".footer-wordmark",
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".footer-wordmark",
      start: "top 95%",
    },
  },
);

/* CTA title split reveal */
gsap.fromTo(
  ".cta-title",
  { scale: 0.92, opacity: 0 },
  {
    scale: 1,
    opacity: 1,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".cta-strip",
      start: "top 75%",
    },
  },
);

/* Metric cards on hover — magnetic tilt */
document.querySelectorAll(".metric-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 8,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 600,
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  });
});

/* ─────────────────────────────
   CONTACT FORM
───────────────────────────── */
async function handleSubmit(event) {
  event.preventDefault(); 
  
  const form = event.target;
  const submitBtn = document.getElementById('submitBtn');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = "Sending...";
  submitBtn.disabled = true;

  const formData = new FormData(form);
  
  formData.append("access_key", "49206a08-c17a-4d98-84aa-0c6f08757b2e"); 
  
  formData.append("from_name", "Portfolio Form Alerts"); 
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      submitBtn.innerHTML = "Message Sent!";
      form.reset(); 
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    } else {
      submitBtn.innerHTML = "Error! Try Again ❌";
      submitBtn.disabled = false;
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    submitBtn.innerHTML = "Error! Try Again ❌";
    submitBtn.disabled = false;
  }
}

/* ─────────────────────────────
   ACTIVE NAV LINK ON SCROLL
───────────────────────────── */
const sections = document.querySelectorAll("section[id], div[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => (a.style.color = ""));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`,
        );
        if (active) active.style.color = "var(--orange)";
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

sections.forEach((s) => activeObserver.observe(s));
