/* =========================================
   main.js — Scripts
   RAQUEL & CHUS · Boda 2026
   ========================================= */

// --- Cuenta atrás ---
function updateCountdown() {
  const weddingDate = new Date('2026-11-15T12:00:00');
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// --- Background music ---
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const iconPlay = document.getElementById('music-icon-play');
const iconPause = document.getElementById('music-icon-pause');

const TARGET_VOLUME = 0.5;
const FADE_DURATION = 2000; // ms

function fadeInMusic() {
  if (!music || music._started) return;
  music._started = true;
  music.volume = 0;
  music.play().then(() => {
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
    const steps = 40;
    const interval = FADE_DURATION / steps;
    const step = TARGET_VOLUME / steps;
    let current = 0;
    const fade = setInterval(() => {
      current += step;
      if (current >= TARGET_VOLUME) {
        music.volume = TARGET_VOLUME;
        clearInterval(fade);
      } else {
        music.volume = current;
      }
    }, interval);
  }).catch(() => {
    // Autoplay blocked — reset flag so button can retry
    music._started = false;
  });
}

// Start on first scroll or click anywhere
function onFirstInteraction() {
  fadeInMusic();
  window.removeEventListener('scroll', onFirstInteraction);
  window.removeEventListener('click', onFirstInteraction);
}
window.addEventListener('scroll', onFirstInteraction, { once: true });
window.addEventListener('click', onFirstInteraction, { once: true });

// Floating button — manual toggle
if (musicBtn) {
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent double-triggering onFirstInteraction
    if (!music._started) {
      fadeInMusic();
      return;
    }
    if (music.paused) {
      music.play();
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
    } else {
      music.pause();
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    }
  });
}

// --- Magnetic Button Effect ---
const btn = document.querySelector('.btn-confirmar');
const btnText = document.querySelector('.btn-text');
const section = document.querySelector('#confirmacion');

if (btn && btnText && section) {
  let mouseX = 0;
  let mouseY = 0;
  let distX = 0;
  let distY = 0;

  section.addEventListener('mousemove', (e) => {
    // Get button center position
    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Get mouse position relative to button center
    mouseX = e.clientX - btnCenterX;
    mouseY = e.clientY - btnCenterY;

    // Calculate distance from center (max 30px)
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const maxDistance = 30;
    const ratio = Math.min(distance / 100, 1); // Normalize distance

    distX = (mouseX / distance) * maxDistance * ratio || 0;
    distY = (mouseY / distance) * maxDistance * ratio || 0;

    // Animate text following cursor
    gsap.to(btnText, {
      x: distX,
      y: distY,
      duration: 0.3,
      overwrite: 'auto',
      ease: 'power2.out'
    });
  });

  section.addEventListener('mouseleave', () => {
    // Return text to center
    gsap.to(btnText, {
      x: 0,
      y: 0,
      duration: 0.3,
      overwrite: 'auto',
      ease: 'power2.out'
    });
  });
}