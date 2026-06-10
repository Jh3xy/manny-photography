/**
 * anim.js
 * GSAP entrance animations for Manny's Photography.
 *
 * initHeroAnimation — called from initHero() in script.js after media loads
 * initCountUp       — called from script.js on page load (IntersectionObserver handles timing)
 */

import gsap from "gsap";

// ── Hero entrance ─────────────────────────────────────────────────────────
export function initHeroAnimation() {
  // Belt-and-suspenders: confirm initial states match CSS
  // (CSS already sets these, but GSAP needs to know the start values)
  gsap.set(".hero-line", { y: "105%" });
  gsap.set([".hero-label", ".hero-sub", ".cta-row", ".scroll-cue-wrap"], {
    opacity: 0,
    y: 14,
  });

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.15, // breathing room after hero media fades in
  });

  tl
    // Lines slide up from beneath the clip mask
    .to(".hero-line", {
      y: "0%",
      duration: 1.0,
      stagger: 0.12,
    })
    // Label fades + lifts in — starts slightly before lines finish
    .to(
      ".hero-label",
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
      },
      0.2,
    )
    // Sub copy
    .to(
      ".hero-sub",
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
      },
      "-=0.45",
    )
    // CTA buttons
    .to(
      ".cta-row",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
      },
      "-=0.4",
    )
    // Social cue — last, quietest
    .to(
      ".scroll-cue-wrap",
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
      },
      "-=0.35",
    );
}

// ── About stats count-up ──────────────────────────────────────────────────
export function initCountUp() {
  // Skip the location stat — it's text, not a number
  const statNums = document.querySelectorAll(
    ".about-stat-num:not(.about-stat-num--location)",
  );
  if (!statNums.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const rawText = el.textContent.trim();

        // Match patterns like "50+", "3+"
        const match = rawText.match(/^(\d+)(\+?)(.*)$/);
        if (!match) return;

        const target = parseInt(match[1], 10);
        const suffix = match[2] || ""; // the '+' if present
        const duration = 1400; // ms

        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic — decelerates toward the target
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.6 },
  );

  statNums.forEach((el) => observer.observe(el));
}
