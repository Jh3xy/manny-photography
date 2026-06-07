

// ── CSS ────
import '../css/variables.css'
import '../css/fonts.css'
import '../css/base.css'
import '../css/utils.css'
import '../css/style.css'

// ── Modules ──────────
import { initNav }    from './nav.js'
import { initReveal } from './reveal.js'

import { initWorkGallery, initLightbox } from "./gallery.js";

initWorkGallery();
initLightbox();

initNav()
initReveal()



