/* =========================================
   music.js — Música de fondo
   RAQUEL & CHUS · Boda 2026
   ========================================= */

const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const iconPlay = document.getElementById('music-icon-play');
const iconPause = document.getElementById('music-icon-pause');

const TARGET_VOLUME = 0.5;
const FADE_DURATION = 2000; // ms

if (music) {
    music.muted = true;
    music.volume = 0;
    music.play().catch(() => {
        // Some browsers may still block autoplay; first interaction will retry.
    });
}

function fadeInMusic() {
    if (!music || music._started) return;
    music._started = true;
    music.muted = false;

    const resumePlayback = music.paused ? music.play() : Promise.resolve();

    resumePlayback.then(() => {
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
        music._started = false;
        music.muted = true;
    });
}

// Expose a controlled starter for the intro letter flow.
window.startBgMusic = fadeInMusic;

// Floating button — manual toggle
if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!music._started) {
            fadeInMusic();
            return;
        }
        if (music.paused) {
            music.muted = false;
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
