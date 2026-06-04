

/**
 * reveal.js
 * Observes every .reveal element and adds .visible when it enters
 * the viewport. Fires once per element, then stops observing.
 * CSS handles the actual opacity/transform animation (defined in base.css).
 */
export function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}


