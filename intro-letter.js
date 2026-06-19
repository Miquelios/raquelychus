/* =========================================
   intro-letter.js — Intro sobre con sello
   RAQUEL & CHUS · Boda 2026
   ========================================= */

(function () {
    const intro = document.getElementById('intro-letter');
    const introTrigger = document.getElementById('intro-letter-trigger');
    const main = document.querySelector('main');

    if (!intro || !introTrigger) return;

    const OPENING_MS = 120;
    const CLEANUP_MS = 900;
    let hasOpened = false;

    function unlockPage() {
        document.body.classList.remove('intro-locked');
        if (main) {
            main.removeAttribute('aria-hidden');
        }
    }

    function openIntro(startMusic) {
        if (hasOpened) return;
        hasOpened = true;

        if (startMusic && typeof window.startBgMusic === 'function') {
            window.startBgMusic();
        }

        window.setTimeout(() => {
            unlockPage();
            intro.classList.add('intro-letter--opened');
        }, OPENING_MS);

        window.setTimeout(() => {
            intro.setAttribute('aria-hidden', 'true');
            introTrigger.disabled = true;
        }, CLEANUP_MS);
    }

    introTrigger.addEventListener('click', () => {
        openIntro(true);
    });
})();
