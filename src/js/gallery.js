/**
 * gallery.js
 * Builds the Work section masonry grid and controls the shared lightbox.
 *
 * WORK_PHOTOS: the 12 curated preview photos for the Work section.
 * Swap in whichever photo filenames we want featured.
 * When the /gallery page is built, it will import initLightbox()
 * and run its own grid against the full 62-photo set.
 */

import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

// Helper to resolve image URLs - Vite will process these paths
function getImageUrl(filename) {
  return new URL(`../img/${filename}`, import.meta.url).href;
}

// ── Photo list ────────────────────────────────────────────
// These are the 12 hand-picked preview shots for the Work section.
// Update filenames here to change which photos appear.
// Format: { file: 'filename.jpg', alt: 'description' }
const WORK_PHOTOS = [
  { file: "photo-30.jpg", alt: "Portrait session" },
  { file: "photo-36.jpg", alt: "Portrait session" },
  { file: "photo-37.jpg", alt: "Portrait session" },
  { file: "photo-35.jpg", alt: "Portrait session" },
  { file: "photo-32.jpg", alt: "Portrait session" },
  { file: "photo-25.jpg", alt: "Event coverage" },
  { file: "photo-40.jpg", alt: "Fashion editorial" },
  { file: "photo-28.jpg", alt: "Portrait session" },
  { file: "photo-21.jpg", alt: "Event coverage" },
  { file: "photo-20.jpg", alt: "Portrait session" },
  { file: "photo-38.jpg", alt: "Fashion editorial" },
  { file: "photo-30.jpg", alt: "Portrait session" },
  { file: "photo-19.jpg", alt: "Fashion editorial" },
  { file: "photo-31.jpg", alt: "Event coverage" },
  { file: "photo-18.jpg", alt: "Event coverage" },
  { file: "photo-23.jpg", alt: "Portrait session" },
];

// ── Grid builder ──────────────────────────────────────────
export function initWorkGallery() {
  const grid = document.getElementById("work-grid");
  if (!grid) return;

  // Render grid items
  WORK_PHOTOS.forEach((photo, index) => {
    const item = document.createElement("div");
    item.className = "work-item reveal";
    item.dataset.index = index;
    // Stagger reveal by column position across the 4-column grid
    item.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
    item.innerHTML = `
      <img
        src="${getImageUrl(photo.file)}"
        alt="${photo.alt}"
      />
      <div class="work-item-overlay">
        <div class="work-item-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>
      </div>
    `;
    item.addEventListener("click", () => openLightbox(index, WORK_PHOTOS));
    grid.appendChild(item);
  });

  imagesLoaded(grid, () => initMasonry(grid));
}

function initMasonry(grid) {
  // Guard: don't double-init
  if (grid.dataset.masonryReady) return;
  grid.dataset.masonryReady = "true";

  new Masonry(grid, {
    itemSelector: ".work-item",
    columnWidth: ".work-item", // uses first item as sizer
    gutter: 12,
    percentPosition: true,
    // fitWidth: false — we want the grid to fill its container, not shrink-wrap
  });
}

// ── Lightbox ──────────────────────────────────────────────
// Exported so the future /gallery page can reuse the same controller.
// Pass it any photos array and a starting index.

let _photos = [];
let _currentIndex = 0;

export function initLightbox() {
  const lb = document.getElementById("lightbox");
  const backdrop = document.getElementById("lb-backdrop");
  const closeBtn = document.getElementById("lb-close");
  const prevBtn = document.getElementById("lb-prev");
  const nextBtn = document.getElementById("lb-next");

  if (!lb) return;

  closeBtn.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => navigateLightbox(-1));
  nextBtn.addEventListener("click", () => navigateLightbox(1));

  // Keyboard: Esc closes, arrow keys navigate
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}

export function openLightbox(index, photos) {
  _photos = photos;
  _currentIndex = index;

  const lb = document.getElementById("lightbox");
  if (!lb) return;

  // CSS handles visibility — just toggle .open
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
  setLightboxImage(_currentIndex);
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;

  lb.classList.remove("open");
  document.body.style.overflow = "";
  // CSS visibility:hidden takes over after the opacity transition,
  // so no need to manually set hidden or listen for transitionend
}

function navigateLightbox(direction) {
  _currentIndex = (_currentIndex + direction + _photos.length) % _photos.length;
  setLightboxImage(_currentIndex);
}

function setLightboxImage(index) {
  const img = document.getElementById("lb-image");
  if (!img || !_photos[index]) return;

  // Fade out, swap src, fade in
  img.style.opacity = "0";
  img.style.transition = "opacity 0.2s ease";

  setTimeout(() => {
    img.src = getImageUrl(_photos[index].file);
    img.alt = _photos[index].alt;
    img.style.opacity = "1";
  }, 180);
}
