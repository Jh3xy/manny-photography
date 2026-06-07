


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

initNav()
initWorkGallery()
initLightbox()
initFilm()
initBooking()


// initReveal MUST run last — it queries .reveal once at call time.
// Any JS that dynamically creates .reveal elements must finish first.
initReveal()





