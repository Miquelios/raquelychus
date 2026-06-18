/* =========================================
   magnetic-button.js — Efecto botón magnético
   RAQUEL & CHUS · Boda 2026
   ========================================= */

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
