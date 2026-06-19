/* =========================================
   music.js — Música de fondo
   RAQUEL & CHUS · Boda 2026
   ========================================= */

const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const iconPlay = document.getElementById('music-icon-play');
const iconPause = document.getElementById('music-icon-pause');

const TARGET_VOLUME = 0.5;

function startBgMusic() {
    if (!music || music._started) return;
    music._started = true;
    music.muted = false;
    music.volume = TARGET_VOLUME;

    music.play().then(() => {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    }).catch(() => {
        music._started = false;
        music.muted = true;
    });
}

// Expose a controlled starter for the intro letter flow.
window.startBgMusic = startBgMusic;

// Floating button — manual toggle
if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!music._started) {
            startBgMusic();
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
