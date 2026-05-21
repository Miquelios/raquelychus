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

// --- Footer click: falling icons effect (GSAP + sway + retrigger) ---
const fallingAssets = [
  'images/falling/cocktail.svg',
  'images/falling/double-heart.svg',
  'images/falling/grapes.svg',
  'images/falling/oil.svg',
  'images/falling/olive-branch.svg',
  'images/falling/party.svg',
  'images/falling/single-heart.svg',
  'images/falling/wine.svg'
];

const footerTrigger = document.querySelector('.couple-behind');

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function launchFallingEffectGSAP() {
  const layer = document.createElement('div');
  layer.className = 'falling-layer';
  document.body.appendChild(layer);

  const totalImages = 10;
  let completed = 0;
  const itemWidth = window.matchMedia('(max-width: 640px)').matches ? 140 : 200;

  for (let i = 0; i < totalImages; i += 1) {
    const img = document.createElement('img');

    const startX = Math.random() * Math.max(1, window.innerWidth - itemWidth);
    const duration = 3 + Math.random() * 2.2;
    const delay = Math.random() * 0.8;
    const swayAmount = 25 + Math.random() * 45;
    const swayTime = 0.35 + Math.random() * 0.35;
    const rotateEnd = -220 + Math.random() * 440;

    img.className = 'falling-item';
    img.src = randomFrom(fallingAssets);
    img.alt = '';
    img.style.left = `${startX}px`;
    img.style.opacity = '0';

    layer.appendChild(img);

    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        img.remove();
        completed += 1;
        if (completed === totalImages) {
          layer.remove();
        }
      }
    });

    tl.fromTo(
      img,
      { y: -240, x: 0, rotation: 0, opacity: 1 },
      {
        y: window.innerHeight + 260,
        rotation: rotateEnd,
        opacity: 0,
        duration,
        ease: 'none'
      }
    );

    tl.to(
      img,
      {
        x: `+=${swayAmount}`,
        duration: swayTime,
        repeat: Math.ceil(duration / (swayTime * 2)),
        yoyo: true,
        ease: 'sine.inOut'
      },
      0
    );
  }
}

if (footerTrigger) {
  footerTrigger.addEventListener('click', launchFallingEffectGSAP);
}