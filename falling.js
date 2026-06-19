// --- Footer click: falling icons effect (GSAP + sway + retrigger) ---
const fallingAssets = [
  'images/falling/confeti.svg',
  'images/falling/corazon.svg',
  'images/falling/corazones.svg'
  // 'images/falling_v2/cocktail.svg',
  // 'images/falling_v2/double-heart.svg',
  // 'images/falling_v2/grapes.svg',
  // 'images/falling_v2/oil.svg',
  // 'images/falling_v2/olive-branch.svg',
  // 'images/falling_v2/party.svg',
  // 'images/falling_v2/single-heart.svg',
  // 'images/falling_v2/wine.svg',
  // 'images/falling_v2/photos.svg'
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