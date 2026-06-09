

# MISSION: Manny's Photography — Design Upgrade
## Implementation Guide · Step-by-Step

---

## HOW TO EXECUTE THIS DOCUMENT

You are implementing a staged design upgrade for a photography portfolio site. The codebase is vanilla HTML/CSS/JS with Vite. No frameworks. No Tailwind.

**Rules:**
1. Read this entire document before starting
2. Execute **one step at a time**
3. After each step, output the exact code change clearly (full block, not a diff), state which file it goes in and what it replaces, then write: **"Step [N] done. Type 'next' to continue to Step [N+1]."**
4. Do not proceed until the user confirms
5. If a step modifies a file already modified in a previous step, work from the updated version — not the original

**Surgical changes only.** Never rewrite a full file unless the step explicitly says to. Output only the blocks being changed.

---

## Project Context

**Site:** Manny's Photography — portfolio/booking site for a photographer + filmmaker in Calabar, Cross River, Nigeria.

**Stack:**
- `index.html` — single-page HTML, all sections
- `src/css/variables.css` — all CSS custom properties
- `src/css/base.css` — reset + `.reveal` animation system
- `src/css/style.css` — all component styles
- `src/js/script.js` — entry point, imports + calls all init functions
- `src/js/gallery.js` — builds masonry grid dynamically via JS, controls lightbox
- `src/js/film.js` — film carousel drag scroll + video play/mute
- `src/js/reveal.js` — IntersectionObserver that adds `.visible` to `.reveal` elements
- `src/js/nav.js` — scroll backdrop + mobile menu
- `src/js/bookings.js` — WhatsApp pre-fill redirect

**Critical constraint:** `initReveal()` in `script.js` MUST always be called last. It queries `.reveal` elements once at call time. Any JS that dynamically creates `.reveal` elements (like `initWorkGallery()`) must complete before it runs. Do not change this order.

**Reveal system:** `.reveal` elements start at `opacity: 0; transform: translateY(28px)`. When they enter the viewport, `IntersectionObserver` adds `.visible` which triggers a CSS transition to `opacity: 1; transform: translateY(0)`. Stagger delay is set via `--reveal-delay` CSS custom property (inline style on the element), and each component's CSS block picks it up via `transition-delay: var(--reveal-delay, 0ms)`.

**Key variable values (from variables.css):**
- `--bg-base: #0a0a0a`
- `--surface-1: #171717`
- `--surface-2: #222222`
- `--border: #2a2a2a`
- `--text-muted: #444444` ← nearly invisible on dark surfaces
- `--accent: #f0f0f0`

---

## Design Decisions Summary

These decisions have already been made. Do not offer alternatives:

- **Followers stat**: Replaced with "Years Shooting" — the follower count undermines rather than builds credibility
- **Gallery images**: Grayscale by default, color reveals on hover — maintains the editorial B&W world established by the hero
- **Service numbers**: Converted from tiny invisible labels to large low-opacity background watermarks — adds depth without changing card structure
- **GSAP**: Being added for the hero entrance animation and stat count-up only. ScrollTrigger is not being added yet. The existing CSS reveal system stays.
- **Film poster**: A branded image (black bg + "Manny's Photography" wordmark) will be used as the `poster` attribute on all video elements — replaces raw video thumbnails that have Instagram captions burned in
- **Hero heading**: Wrapped in line-mask spans for GSAP animation. No text content changed
- **Nav "Book" link**: Gets a subtle bordered CTA treatment to distinguish it from informational nav links

---

## PHASE 1 — HTML Changes
### All changes in `index.html`

---

### Step 1: Fix the About stat — replace "800+ Followers"

**Why:** 800 followers displayed large in Cormorant does not read as credibility — it reads as inexperience. Replace with a real metric that communicates something about Manny's experience level.

**File:** `index.html`

**Find this block in the About section:**
```html

  800+
  Followers

```

**Replace with:**
```html

  3+
  Years Shooting

```

> **Note to user:** Update the "3+" to however many years Manny has actually been shooting. This number is a placeholder — what matters is removing "Followers."

---

### Step 2: Fix hero sub copy

**Why:** "Frame emotions, one beautiful moment at a time ── with Manny" is stock copy. The "── with Manny" appended at the end breaks the rhythm and reads like it was added after the fact. The replacement is shorter, specific to location, and has actual rhythm.

**File:** `index.html`

**Find:**
```html

  Frame emotions, one beautiful moment at a time ── with Manny

```

**Replace with:**
```html

  Real moments, real people — shot from Calabar with intention.

```

---

### Step 3: Wrap hero headline lines for GSAP animation

**Why:** GSAP needs each line of the heading to be a separate element inside an `overflow: hidden` container. This allows the text-mask slide-up animation in Phase 4. The `<br>` is replaced by block-level spans which are more reliable across viewport widths.

**File:** `index.html`

**Find:**
```html

  We Tell Your StoriesThrough Light and Lens

```

**Replace with:**
```html

  We Tell Your Stories
  Through Light and Lens

```

---

### Step 4: Give the "Book" nav link a CTA class

**Why:** Every nav link currently looks identical. "Book" is the conversion point and should signal visually that it's different. Adding a class here is all that's needed — the CSS in Phase 2 handles the styling. (I have added a .btn-solid class to the "Book" link)

**File:** `index.html`

**Find in the `.nav-links` div (desktop nav only — leave mobile nav untouched):**
```html
Book
```

**Replace with:**
```html
Book
```

---

### Step 5: Add poster image to all film video elements

**Why:** The raw video thumbnails show the first frame of the video, which in several cases displays Instagram-captioned overlays ("BTS 📷🔥", "Dropping result soon") — these directly contradict the editorial tone established everywhere else on the site. A branded poster image makes all 7 cards show a consistent, professional still before the user hits play.

**File:** `index.html`

**Prerequisite:** The user has a branded image — black background with "Manny's Photography" wordmark text — that should be placed in `/assets/images/`. This step uses the filename `film-poster.png`. Update to match the actual filename the user provides.

**For each of the 7 `<video>` elements in the Film section, add the `poster` attribute.**

There are 7 film cards. Each has a `<video>` element. The pattern is identical for all 7 — here is the change for one, applied to all:

**Find (example — first card, film-7.mp4):**
```html

```

**Replace with:**
```html

```

Apply the same `poster="/assets/images/film-poster.jpg"` to all 7 video elements (film-7, film-1, film-2, film-3, film-4, film-5, film-6).

---

## PHASE 2 — CSS Changes
### All changes in `src/css/style.css` unless noted

---

### Step 6: Add hero line-wrap CSS + set initial hidden state for hero content

**Why (line-wrap):** `.hero-line-wrap` needs `overflow: hidden` to clip the GSAP upward slide animation. Without it, the text content is visible below its clipped position. The `padding-bottom + negative margin-bottom` trick prevents descender clipping on Cormorant's letters.

**Why (initial hidden state):** The hero content (label, sub, CTA, social cue) is currently visible the moment the page loads, before the hero media has even faded in. Setting these to `opacity: 0` and the hero lines to `translateY(105%)` in CSS means there's no flash of content before GSAP takes over. Once GSAP runs (after media loads), it animates these into view.

**File:** `src/css/style.css`

**Add this entire block immediately after the `.hero-headline` block:**

```css
/* ── Hero line mask (overflow clips GSAP slide-up) ──────── */
.hero-line-wrap {
  display: block;
  overflow: hidden;
  /* Padding + negative margin prevents descender clipping on Cormorant */
  padding-bottom: 0.08em;
  margin-bottom: -0.08em;
}

.hero-line {
  display: block;
  /* GSAP will animate from translateY(105%) to translateY(0) */
  transform: translateY(105%);
  will-change: transform;
}

/* Hero content elements hidden until GSAP fires */
/* GSAP sets these to opacity:1 after hero media loads */
.hero-label,
.hero-sub,
.cta-row,
.scroll-cue-wrap {
  opacity: 0;
}
```

---

### Step 7: Fix hero label letter-spacing

**Why:** `0.8em` letter-spacing on an 11px element is extreme — "PHOTOGRAPHER · FILMMAKER · CALABAR" becomes an illegible spread of characters, especially against the photo background. `0.25em` is still clearly a spaced editorial label but actually readable.

**File:** `src/css/style.css`

**Find:**
```css
.hero-label {
  font-family: var(--ff-secondary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.8em;
  text-transform: uppercase;
  color: var(--text-secondary);
  display: block;
}
```

**Change `letter-spacing: 0.8em` to `letter-spacing: 0.25em`. Full block:**
```css
.hero-label {
  font-family: var(--ff-secondary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-secondary);
  display: block;
}
```

---

### Step 8: Tighten hero headline letter-spacing

**Why:** Cormorant Garamond at large display sizes (56–110px) has slightly loose default tracking. `-0.02em` pulls it in just enough to make it feel considered rather than defaulted. The difference is subtle but visible at this scale.

**File:** `src/css/style.css`

**Find:**
```css
.hero-headline {
  font-family: var(--ff-primary);
  font-size: clamp(56px, 8vw, 110px);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.05;
  margin-top: 12px;
}
```

**Replace with:**
```css
.hero-headline {
  font-family: var(--ff-primary);
  font-size: clamp(56px, 8vw, 110px);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.05;
  margin-top: 12px;
  letter-spacing: -0.02em;
}
```

---

### Step 9: Work gallery — grayscale default, color on hover

**Why:** The hero establishes a B&W editorial world. The color gallery immediately after is jarring — it reads as inconsistency, not variety. Defaulting gallery images to grayscale keeps the visual language consistent on first impression. Revealing color on hover makes the interaction carry meaning: hover = see what this moment actually looked like. The scale and filter transitions run in parallel.

**File:** `src/css/style.css`

**Find:**
```css
.work-item img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.work-item:hover img {
  transform: scale(1.04);
}
```

**Replace with:**
```css
.work-item img {
  display: block;
  width: 100%;
  height: auto;
  filter: grayscale(100%);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.55s ease;
}

.work-item:hover img {
  transform: scale(1.04);
  filter: grayscale(0%);
}
```

---

### Step 10: Add stagger delay support to work-item CSS

**Why:** Currently `.work-item` doesn't use `--reveal-delay` so all gallery items reveal simultaneously. This block enables the staggered cascade that Step 15 (gallery.js) will set via inline style.

**File:** `src/css/style.css`

**Find the `.work-item` block:**
```css
.work-item {
  width: calc(25% - 9px);
  margin-bottom: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  background: var(--surface-1);
  float: left;
}
```

**Replace with:**
```css
.work-item {
  width: calc(25% - 9px);
  margin-bottom: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  background: var(--surface-1);
  float: left;
  transition-delay: var(--reveal-delay, 0ms);
}
```

---

### Step 11: Service number — convert to background watermark

**Why:** The `01 02 03 04` counters at 10px with `color: var(--text-muted)` (#444) are invisible — they contribute visual noise without functioning as either labels or design elements. Repositioning them as 96px, 4% opacity background text turns them into atmosphere — they add editorial depth to the cards without competing with any readable content. `position: relative` on the card is required for the absolute positioning to work.

**File:** `src/css/style.css`

**Find:**
```css
.service-card {
  background: var(--surface-1);
  padding: 40px 32px 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  transition-delay: var(--reveal-delay, 0ms);
}

.service-number {
  font-family: var(--ff-secondary);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  color: var(--text-muted);
  margin-bottom: 20px;
}
```

**Replace with:**
```css
.service-card {
  background: var(--surface-1);
  padding: 40px 32px 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  transition-delay: var(--reveal-delay, 0ms);
  position: relative;
  overflow: hidden;
}

.service-number {
  position: absolute;
  top: 12px;
  right: 18px;
  font-family: var(--ff-primary);
  font-size: 96px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  opacity: 0.04;
  pointer-events: none;
  user-select: none;
  margin-bottom: 0;
}
```

---

### Step 12: Service details list — fix contrast

**Why:** `var(--text-muted)` is `#444444` on `var(--surface-1)` which is `#171717`. The contrast ratio is below 2:1 — these list items are functionally invisible. `rgba(255,255,255,0.45)` makes them readable without competing with the description text above.

**File:** `src/css/style.css`

**Find:**
```css
.service-details li {
  font-family: var(--ff-secondary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding-left: 14px;
  position: relative;
}

.service-details li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1px;
  background: var(--text-muted);
}
```

**Replace with:**
```css
.service-details li {
  font-family: var(--ff-secondary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.42);
  padding-left: 14px;
  position: relative;
}

.service-details li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1px;
  background: rgba(255, 255, 255, 0.25);
}
```

---

### Step 13: Form input fields — fix border visibility

**Why:** `var(--border)` is `#2a2a2a` and `var(--surface-2)` is `#222222`. These are 8 steps apart in darkness — the field borders are nearly invisible. Users can barely tell where the input areas are. Opacity-based whites give clear definition against any dark background, and they scale correctly if background colors ever change.

**File:** `src/css/style.css`

**Find:**
```css
.form-input {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 14px 16px;
  font-family: var(--ff-secondary);
  font-size: 14px;
  color: var(--text-primary);
  width: 100%;
  transition: border-color 0.2s ease;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  border-color: var(--border-focus);
}
```

**Replace with:**
```css
.form-input {
  background: var(--surface-2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 14px 16px;
  font-family: var(--ff-secondary);
  font-size: 14px;
  color: var(--text-primary);
  width: 100%;
  transition: border-color 0.25s ease;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.form-input:focus {
  border-color: rgba(255, 255, 255, 0.35);
}
```

---

### Step 14: Nav "Book" link — CTA treatment

**Why:** Every link in the nav has the same visual weight. "Book" is the conversion CTA — it should signal that it's a different type of action without being a garish button. A subtle border at low opacity reads as "this is a call to action" while staying quiet enough to not clash with the editorial tone. On hover, it fills solid like the other `.btn-solid` elements.

**File:** `src/css/style.css`

**Find the block that ends with `.nav-link:hover::after { width: 100%; }`:**

```css
.nav-link:hover { color: var(--text-primary); }
.nav-link:hover::after { width: 100%; }
```

**After that block, add:**
```css
/* Book nav link — subtle CTA distinction */
.nav-link--cta {
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 5px 14px;
  border-radius: 3px;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.nav-link--cta:hover {
  background: var(--accent);
  color: var(--bg-base) !important;
  border-color: var(--accent);
}

.nav-link--cta::after {
  display: none !important;
}
```

---

### Step 15: Work section — reduce dead space around footer CTA

**Why:** The "VIEW ALL WORK" button sits in too much empty black. The section's default `--section-pad` bottom padding (~80–120px) combined with the `56px` footer margin creates an oversized void. Tightening both values grounds the CTA and reduces the perception of wasted space.

**File:** `src/css/style.css`

**Find:**
```css
.work-footer {
  max-width: var(--container);
  margin: 56px auto 0;
  display: flex;
  justify-content: center;
}
```

**Replace with:**
```css
.work-footer {
  max-width: var(--container);
  margin: 36px auto 0;
  display: flex;
  justify-content: center;
}
```

**Also find the `.work` block:**
```css
.work {
  background: var(--bg-base);
}
```

**Replace with:**
```css
.work {
  background: var(--bg-base);
  padding-bottom: clamp(48px, 7vw, 80px);
}
```

---

## PHASE 3 — JS Enhancement

### Step 16: Add reveal stagger to work gallery items

**Why:** All 16 gallery items currently reveal at the same moment when they enter the viewport (same IntersectionObserver threshold, no delay). Setting a stagger by column position (4 columns × 80ms offset) creates a cascade that reads as intentional. The CSS in Step 10 already wired `transition-delay` to pick up the `--reveal-delay` custom property — this step sets that property on each item.

**File:** `src/js/gallery.js`

**Find:**
```js
  WORK_PHOTOS.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'work-item reveal';
    item.dataset.index = index;
    item.innerHTML = `
```

**Replace with:**
```js
  WORK_PHOTOS.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'work-item reveal';
    item.dataset.index = index;
    // Stagger reveal by column position across the 4-column grid
    item.style.setProperty('--reveal-delay', `${(index % 4) * 80}ms`);
    item.innerHTML = `
```

---

## PHASE 4 — GSAP Animation

### Step 17: Install GSAP

**Why:** GSAP is the industry standard for web animation. Free tier (core + all basic plugins) is what's being used here. No ScrollTrigger, no premium plugins required for these implementations.

**Run this in the project terminal:**
```bash
npm install gsap
```

Confirm the install completes before proceeding.

---

### Step 18: Create `src/js/animations.js`

**Why:** Keeping all GSAP logic in one isolated module makes it easy to audit, extend, or remove without touching the existing module system. Two functions are exported: `initHeroAnimation` (hero entrance) and `initCountUp` (about stats).

**The hero animation:**
- Hero lines slide up from below their `overflow: hidden` parent clip — the text mask effect
- Label, sub-copy, CTA row, and social cue fade + slide in sequentially after the lines
- Timeline fires after the hero media finishes loading (wired in Step 19)
- `gsap.set()` runs immediately to confirm the initial states from the CSS (belt-and-suspenders)

**The count-up:**
- IntersectionObserver watches `.about-stat-num` elements (excluding the location variant which has no number)
- When they enter the viewport, numbers count up from 0 using `requestAnimationFrame`
- Ease-out cubic formula gives it natural deceleration — not a linear ticker

**File:** Create `src/js/animations.js` with the full content below:

```js
/**
 * animations.js
 * GSAP entrance animations for Manny's Photography.
 *
 * initHeroAnimation — called from initHero() in script.js after media loads
 * initCountUp       — called from script.js on page load (IntersectionObserver handles timing)
 */

import gsap from 'gsap';

// ── Hero entrance ─────────────────────────────────────────────────────────
export function initHeroAnimation() {
  // Belt-and-suspenders: confirm initial states match CSS
  // (CSS already sets these, but GSAP needs to know the start values)
  gsap.set('.hero-line', { y: '105%' });
  gsap.set(['.hero-label', '.hero-sub', '.cta-row', '.scroll-cue-wrap'], {
    opacity: 0,
    y: 14,
  });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.15, // breathing room after hero media fades in
  });

  tl
    // Lines slide up from beneath the clip mask
    .to('.hero-line', {
      y: '0%',
      duration: 1.0,
      stagger: 0.12,
    })
    // Label fades + lifts in — starts slightly before lines finish
    .to('.hero-label', {
      opacity: 1,
      y: 0,
      duration: 0.75,
    }, 0.2)
    // Sub copy
    .to('.hero-sub', {
      opacity: 1,
      y: 0,
      duration: 0.65,
    }, '-=0.45')
    // CTA buttons
    .to('.cta-row', {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }, '-=0.4')
    // Social cue — last, quietest
    .to('.scroll-cue-wrap', {
      opacity: 1,
      y: 0,
      duration: 0.5,
    }, '-=0.35');
}

// ── About stats count-up ──────────────────────────────────────────────────
export function initCountUp() {
  // Skip the location stat — it's text, not a number
  const statNums = document.querySelectorAll(
    '.about-stat-num:not(.about-stat-num--location)'
  );
  if (!statNums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const rawText = el.textContent.trim();

      // Match patterns like "50+", "3+"
      const match = rawText.match(/^(\d+)(\+?)(.*)$/);
      if (!match) return;

      const target = parseInt(match[1], 10);
      const suffix = match[2] || ''; // the '+' if present
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
  }, { threshold: 0.6 });

  statNums.forEach(el => observer.observe(el));
}
```

---

### Step 19: Wire animations into script.js

**Why:** `initHeroAnimation()` must fire inside the existing `initHero()` function — specifically inside the `onLoad` callback that fires when enough hero images have loaded and `heroMedia.classList.add("loaded")` is called. This is the same moment the media fades in, so the content animation starts in sync. The 4-second fallback timeout also needs updating to call `initHeroAnimation()` if it fires before images finish.

`initCountUp()` just needs to be called once at startup — it manages its own timing via IntersectionObserver.

`initReveal()` stays last. Do not change its position.

**File:** `src/js/script.js`

**Find the import block at the top:**
```js
import { initFilm } from './film.js'
```

**Replace with:**
```js
import { initFilm } from './film.js'
import { initHeroAnimation, initCountUp } from './animations.js'
```

**Find the `onLoad` function inside `initHero()`:**
```js
  function onLoad() {
    loaded++;
    if (loaded >= threshold) {
      heroMedia.classList.add("loaded");
    }
  }
```

**Replace with:**
```js
  function onLoad() {
    loaded++;
    if (loaded >= threshold) {
      heroMedia.classList.add("loaded");
      initHeroAnimation();
    }
  }
```

**Find the fallback timeout:**
```js
  // Fallback: show after 4s no matter what — bad network shouldn't freeze the hero
  setTimeout(() => heroMedia.classList.add("loaded"), 4000);
```

**Replace with:**
```js
  // Fallback: show after 4s no matter what — bad network shouldn't freeze the hero
  setTimeout(() => {
    if (!heroMedia.classList.contains('loaded')) {
      heroMedia.classList.add('loaded');
      initHeroAnimation();
    }
  }, 4000);
```

**Find in the bottom call sequence (between `initFilm()` and `initReveal()`):**
```js
initBooking()


// initReveal MUST run last
initReveal()
```

**Replace with:**
```js
initBooking()
initCountUp()


// initReveal MUST run last — queries .reveal elements at call time
// Any module that creates .reveal elements dynamically must finish before this
initReveal()
```

---

## COMPLETION CHECKLIST

After Step 19 is confirmed working, verify these visually in the browser:

- [ ] About stats show "3+" (or updated value) / "Years Shooting" instead of followers
- [ ] Hero sub copy reads "Real moments, real people — shot from Calabar with intention."
- [ ] Work gallery images are grayscale by default and reveal color on hover
- [ ] Service cards show the 01/02/03/04 as a faint large watermark in the card background
- [ ] Service list items (portrait types, etc.) are now legible — not near-invisible
- [ ] Form input fields have visible borders (faint white outline, not the near-invisible dark border)
- [ ] Nav "Book" link has a subtle border box treatment, fills on hover
- [ ] Film video cards show the branded poster image before playing
- [ ] On hero load: heading lines slide up, then label/sub/CTA fade in sequentially
- [ ] About stats count up from 0 when section enters viewport
- [ ] Work gallery items reveal with a staggered cascade (not all at once)
- [ ] "VIEW ALL WORK" button has less dead space around it

---

*This document covers Phase 1 through Phase 4. WebGL grain overlay and Services layout restructure are intentionally deferred — the current changes will produce a significantly elevated result before those are needed.*
