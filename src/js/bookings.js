


/**
 * booking.js
 * Collects form values and opens WhatsApp with a pre-filled message.
 * No backend, no validation library — just a clean wa.me redirect.
 */

const WHATSAPP_NUMBER = '2348093150052';

export function initBooking() {
  const submitBtn = document.getElementById('booking-submit');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', handleSubmit);
}

function handleSubmit() {
  const name    = document.getElementById('book-name')?.value.trim();
  const type    = document.getElementById('book-type')?.value;
  const message = document.getElementById('book-message')?.value.trim();

  // Basic guard — name and shoot type are the minimum useful info
  if (!name) {
    shakeField('book-name');
    return;
  }
  if (!type) {
    shakeField('book-type');
    return;
  }

  // Build the pre-filled message
  const lines = [
    `Hi Manny! I found you on your website and I'm interested in booking a session.`,
    ``,
    `Name: ${name}`,
    `Shoot type: ${type}`,
  ];

  if (message) {
    lines.push(``, message);
  }

  const fullMessage = lines.join('\n');
  const encoded = encodeURIComponent(fullMessage);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}

// Lightweight shake animation for invalid fields - CSS driven
function shakeField(fieldId) {
  const el = document.getElementById(fieldId);
  if (!el) return;

  el.classList.add('input-error');
  el.focus();

  // Remove after animation completes so it can re-trigger if needed
  el.addEventListener('animationend', () => {
    el.classList.remove('input-error');
  }, { once: true });
}

