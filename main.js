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

// --- Slides navigation (wheel + touch + keyboard + hash) ---
function initSlidesNavigation() {
  const desktopMQ = window.matchMedia('(min-width: 641px)');
  const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mainEl = document.querySelector('main');
  const sections = Array.from(document.querySelectorAll('main > section[id]'));

  if (!mainEl || sections.length < 2) {
    return;
  }

  let enabled = false;
  let currentIndex = 0;
  let isAnimating = false;
  let touchStartY = 0;
  let touchDeltaY = 0;
  let wheelDeltaAccumulator = 0;
  let wheelAccumulatorResetTimer = null;
  let navHideTimer = null;
  let dotsEl = null;

  const NAV_HIDE_DELAY = 1000;
  const NAV_PROXIMITY_PX = 120;
  const WHEEL_INTENT_THRESHOLD = 44;

  const handlers = {};

  function isDesktopViewport() {
    return desktopMQ.matches;
  }

  function getHashIndex() {
    const hash = window.location.hash.replace('#', '');
    const index = sections.findIndex((sectionEl) => sectionEl.id === hash);
    return index >= 0 ? index : 0;
  }

  function updateDots() {
    if (!dotsEl) {
      return;
    }

    const dots = dotsEl.querySelectorAll('.slide-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentIndex);
      dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
    });
  }

  function applyViewportMode() {
    if (!enabled) {
      return;
    }

    const isDesktop = isDesktopViewport();
    document.body.classList.toggle('desktop-slides', isDesktop);
    document.body.classList.toggle('mobile-slides', !isDesktop);

    if (isDesktop) {
      if (!dotsEl) {
        createDots();
      } else {
        updateDots();
      }
    } else {
      destroyDots();
    }
  }

  function setHash(index, replace) {
    const id = sections[index].id;
    if (!id) {
      return;
    }

    if (replace) {
      history.replaceState(null, '', `#${id}`);
    } else {
      history.pushState(null, '', `#${id}`);
    }
  }

  function clearNavHideTimer() {
    if (navHideTimer) {
      clearTimeout(navHideTimer);
      navHideTimer = null;
    }
  }

  function scheduleNavHide() {
    if (!dotsEl) {
      return;
    }

    clearNavHideTimer();
    navHideTimer = setTimeout(() => {
      if (dotsEl) {
        dotsEl.classList.remove('is-visible');
      }
    }, NAV_HIDE_DELAY);
  }

  function showNavDots() {
    if (!dotsEl) {
      return;
    }

    dotsEl.classList.add('is-visible');
    scheduleNavHide();
  }

  function resetWheelAccumulator() {
    wheelDeltaAccumulator = 0;

    if (wheelAccumulatorResetTimer) {
      clearTimeout(wheelAccumulatorResetTimer);
      wheelAccumulatorResetTimer = null;
    }
  }

  function pushWheelDelta(deltaY) {
    wheelDeltaAccumulator += deltaY;

    if (wheelAccumulatorResetTimer) {
      clearTimeout(wheelAccumulatorResetTimer);
    }

    wheelAccumulatorResetTimer = setTimeout(() => {
      resetWheelAccumulator();
    }, 160);
  }

  function canScrollInside(target, deltaY) {
    const activeSection = sections[currentIndex];
    let node = target;

    while (node && node !== activeSection.parentElement) {
      if (node instanceof HTMLElement) {
        const style = window.getComputedStyle(node);
        const isScrollableY =
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          node.scrollHeight > node.clientHeight + 1;

        if (isScrollableY) {
          const canScrollDown = node.scrollTop + node.clientHeight < node.scrollHeight - 1;
          const canScrollUp = node.scrollTop > 0;

          if ((deltaY > 0 && canScrollDown) || (deltaY < 0 && canScrollUp)) {
            return true;
          }
        }
      }

      if (node === activeSection) {
        break;
      }

      node = node.parentElement;
    }

    return false;
  }

  function jumpTo(index, options = {}) {
    const { updateHash = true, immediate = false, replaceHash = false } = options;

    if (!enabled || index < 0 || index >= sections.length || index === currentIndex || isAnimating) {
      return;
    }

    const outgoing = sections[currentIndex];
    const incoming = sections[index];

    isAnimating = true;

    outgoing.classList.add('is-transitioning');
    incoming.classList.add('is-active', 'is-transitioning');

    const reduceMotion = reduceMotionMQ.matches || immediate;
    const finish = () => {
      outgoing.classList.remove('is-active', 'is-transitioning');
      incoming.classList.remove('is-transitioning');
      gsap.set([outgoing, incoming], { clearProps: 'opacity,visibility,pointerEvents,transform' });
      currentIndex = index;
      updateDots();
      resetWheelAccumulator();
      isAnimating = false;
    };

    if (reduceMotion) {
      outgoing.classList.remove('is-active', 'is-transitioning');
      incoming.classList.remove('is-transitioning');
      currentIndex = index;
      updateDots();
      resetWheelAccumulator();
      isAnimating = false;
    } else {
      gsap.killTweensOf([outgoing, incoming]);
      gsap.set(incoming, { opacity: 0, scale: 0.992, yPercent: 1.5 });

      gsap.to(outgoing, {
        opacity: 0,
        scale: 1.006,
        yPercent: -1.5,
        duration: 0.62,
        ease: 'power3.out'
      });

      gsap.to(incoming, {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        duration: 0.72,
        ease: 'power3.out',
        onComplete: finish
      });
    }

    if (updateHash) {
      setHash(index, replaceHash);
    }
  }

  function navigate(direction) {
    if (direction === 0 || isAnimating) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
    if (nextIndex !== currentIndex) {
      jumpTo(nextIndex);
    }
  }

  function createDots() {
    if (!isDesktopViewport()) {
      return;
    }

    dotsEl = document.createElement('nav');
    dotsEl.className = 'slide-dots';
    dotsEl.setAttribute('aria-label', 'Navegacion por secciones');

    dotsEl.addEventListener('mouseenter', () => {
      if (!enabled) {
        return;
      }

      dotsEl.classList.add('is-visible');
      clearNavHideTimer();
    });

    dotsEl.addEventListener('mouseleave', () => {
      if (!enabled) {
        return;
      }

      scheduleNavHide();
    });

    sections.forEach((sectionEl, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slide-dot';
      dot.setAttribute('aria-label', `Ir a ${sectionEl.id}`);
      dot.addEventListener('click', () => jumpTo(index));
      dotsEl.appendChild(dot);
    });

    document.body.appendChild(dotsEl);
    updateDots();
    showNavDots();
  }

  function destroyDots() {
    if (dotsEl) {
      dotsEl.remove();
      dotsEl = null;
    }

    clearNavHideTimer();
  }

  function enableDesktopSlides() {
    if (enabled) {
      return;
    }

    enabled = true;

    currentIndex = getHashIndex();
    sections.forEach((sectionEl, index) => {
      sectionEl.classList.toggle('is-active', index === currentIndex);
      sectionEl.classList.remove('is-transitioning');
      gsap.set(sectionEl, { clearProps: 'opacity,visibility,pointerEvents,transform' });
    });

    applyViewportMode();
    setHash(currentIndex, true);
  }

  function disableSlides() {
    if (!enabled) {
      return;
    }

    enabled = false;
    isAnimating = false;
    resetWheelAccumulator();
    document.body.classList.remove('desktop-slides');
    document.body.classList.remove('mobile-slides');

    sections.forEach((sectionEl) => {
      sectionEl.classList.remove('is-active', 'is-transitioning');
      gsap.set(sectionEl, { clearProps: 'opacity,visibility,pointerEvents,transform' });
    });

    destroyDots();
  }

  handlers.wheel = (event) => {
    if (!enabled || isAnimating) {
      return;
    }

    if (Math.abs(event.deltaY) < 2) {
      return;
    }

    if (canScrollInside(event.target, event.deltaY)) {
      return;
    }

    event.preventDefault();
    if (isDesktopViewport()) {
      showNavDots();
    }
    pushWheelDelta(event.deltaY);

    if (Math.abs(wheelDeltaAccumulator) < WHEEL_INTENT_THRESHOLD) {
      return;
    }

    const direction = wheelDeltaAccumulator > 0 ? 1 : -1;
    resetWheelAccumulator();
    navigate(direction);
  };

  handlers.keydown = (event) => {
    if (!enabled || isAnimating || event.defaultPrevented) {
      return;
    }

    const key = event.key;
    const target = event.target;
    if (target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) {
      return;
    }

    if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
      event.preventDefault();
      if (isDesktopViewport()) {
        showNavDots();
      }
      navigate(1);
    } else if (key === 'ArrowUp' || key === 'PageUp') {
      event.preventDefault();
      if (isDesktopViewport()) {
        showNavDots();
      }
      navigate(-1);
    }
  };

  handlers.touchstart = (event) => {
    if (!enabled || event.touches.length !== 1) {
      return;
    }

    touchStartY = event.touches[0].clientY;
    touchDeltaY = 0;
  };

  handlers.touchmove = (event) => {
    if (!enabled || event.touches.length !== 1) {
      return;
    }

    touchDeltaY = touchStartY - event.touches[0].clientY;
    if (isDesktopViewport()) {
      showNavDots();
    }

    if (!canScrollInside(event.target, touchDeltaY)) {
      event.preventDefault();
    }
  };

  handlers.touchend = () => {
    if (!enabled || isAnimating) {
      return;
    }

    if (Math.abs(touchDeltaY) > 50) {
      navigate(touchDeltaY > 0 ? 1 : -1);
    }

    touchStartY = 0;
    touchDeltaY = 0;
  };

  handlers.mousemove = (event) => {
    if (!enabled || !isDesktopViewport()) {
      return;
    }

    const distanceToRight = window.innerWidth - event.clientX;
    if (distanceToRight <= NAV_PROXIMITY_PX) {
      showNavDots();
    }
  };

  handlers.hashchange = () => {
    if (!enabled || isAnimating) {
      return;
    }

    const targetIndex = getHashIndex();
    if (targetIndex !== currentIndex) {
      jumpTo(targetIndex, { updateHash: false, immediate: reduceMotionMQ.matches });
    }
  };

  handlers.mediaChange = () => {
    if (!enabled) {
      return;
    }

    applyViewportMode();
  };

  window.addEventListener('wheel', handlers.wheel, { passive: false });
  window.addEventListener('keydown', handlers.keydown);
  window.addEventListener('touchstart', handlers.touchstart, { passive: true });
  window.addEventListener('touchmove', handlers.touchmove, { passive: false });
  window.addEventListener('touchend', handlers.touchend, { passive: true });
  window.addEventListener('mousemove', handlers.mousemove, { passive: true });
  window.addEventListener('hashchange', handlers.hashchange);
  desktopMQ.addEventListener('change', handlers.mediaChange);

  enableDesktopSlides();
}

initSlidesNavigation();