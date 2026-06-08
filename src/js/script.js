


// ── CSS ────
import '../css/variables.css'
import '../css/fonts.css'
import '../css/base.css'
import '../css/utils.css'
import '../css/style.css'

// ── Modules ──────────
import { initNav }    from './nav.js'
import { initReveal } from './reveal.js'
import { initWorkGallery, initLightbox } from './gallery.js'
import { initBooking } from './bookings.js'
import { initFilm } from './film.js'


function initHero() {
  const heroMedia = document.querySelector(".hero-media");
  if (!heroMedia) return;

  const images = heroMedia.querySelectorAll("img");
  let loaded = 0;
  const threshold = Math.ceil(images.length * 0.9);

  function onLoad() {
    loaded++;
    if (loaded >= threshold) {
      heroMedia.classList.add("loaded");
    }
  }

  images.forEach((img) => {
    if (img.complete) {
      requestAnimationFrame(onLoad);
    } else {
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onLoad); // broken image still counts
    }
  });

  // Fallback: show after 4s no matter what — bad network shouldn't freeze the hero
  setTimeout(() => heroMedia.classList.add("loaded"), 4000);
}


initNav()
initHero()
initWorkGallery()
initLightbox()
initFilm()
initBooking()


// initReveal MUST run last — it queries .reveal once at call time.
// Any JS that dynamically creates .reveal elements must finish first.
initReveal()





