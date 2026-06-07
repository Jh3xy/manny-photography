

/**
 * film.js
 * Handles:
 * — Click to play/pause each film card
 * — Mute toggle per card
 * — Drag-to-scroll on the track (mouse only — touch is native)
 * — IntersectionObserver: pause videos scrolled out of view
 */

export function initFilm() {
  const track = document.getElementById('film-track');
  if (!track) return;

  const cards = track.querySelectorAll('.film-card');
  const dragHint = document.getElementById('film-drag-hint');

  cards.forEach(card => {
    const video   = card.querySelector('.film-video');
    const overlay = card.querySelector('.film-card-overlay');
    const playBtn = card.querySelector('.film-play-btn');
    const muteBtn = card.querySelector('.film-card-mute');

    if (!video) return;

    // ── Play / pause on overlay click ──
    overlay.addEventListener('click', () => togglePlay(card, video));
    // Also allow re-pausing by clicking card when playing
    card.addEventListener('click', e => {
      if (card.classList.contains('playing') && e.target !== muteBtn && !muteBtn.contains(e.target)) {
        togglePlay(card, video);
      }
    });

    // ── Mute toggle ──
    muteBtn.addEventListener('click', e => {
      e.stopPropagation(); // don't trigger card click
      toggleMute(card, video, muteBtn);
    });
  });

  // ── Pause when scrolled out of view ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        const card  = entry.target;
        const video = card.querySelector('.film-video');
        if (card.classList.contains('playing')) {
          video.pause();
          card.classList.remove('playing');
        }
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(card => observer.observe(card));

  // ── Drag to scroll (mouse) ──
  initDragScroll(track, dragHint);
}

function togglePlay(card, video) {
  const isPlaying = card.classList.contains('playing');

  if (isPlaying) {
    video.pause();
    card.classList.remove('playing');
  } else {
    // Pause all other playing cards first
    document.querySelectorAll('.film-card.playing').forEach(other => {
      other.querySelector('.film-video')?.pause();
      other.classList.remove('playing');
    });

    video.play().catch(() => {
      // Autoplay blocked — user interaction should have unlocked it,
      // but handle gracefully just in case
    });
    card.classList.add('playing');
  }
}

function toggleMute(card, video, muteBtn) {
  video.muted = !video.muted;
  card.classList.toggle('unmuted', !video.muted);

  // Swap the SVG icon between muted and unmuted states
  muteBtn.innerHTML = video.muted
    ? `<svg class="mute-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H2v6h4l5 4V5z"/>
        <line x1="23" y1="9" x2="17" y2="15"/>
        <line x1="17" y1="9" x2="23" y2="15"/>
       </svg>`
    : `<svg class="mute-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H2v6h4l5 4V5z"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
       </svg>`;

  muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
}

function initDragScroll(track, dragHint) {
  let isDragging  = false;
  let startX      = 0;
  let scrollStart = 0;
  let hasDragged  = false; // track whether user has interacted

  track.addEventListener('mousedown', e => {
    isDragging  = true;
    startX      = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
    track.classList.add('dragging');
  });

  track.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.2; // slight multiplier for feel
    track.scrollLeft = scrollStart - walk;
  });

  const stopDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');

    // Hide drag hint after first use
    if (!hasDragged && dragHint) {
      hasDragged = true;
      dragHint.classList.add('hidden');
    }
  };

  track.addEventListener('mouseup', stopDrag);
  track.addEventListener('mouseleave', stopDrag);

  // Also hide hint on touch scroll
  track.addEventListener('touchstart', () => {
    if (!hasDragged && dragHint) {
      hasDragged = true;
      dragHint.classList.add('hidden');
    }
  }, { passive: true });
}

