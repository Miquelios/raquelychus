(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined') {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.lenis = null;
    return;
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const lenisConfig = isMobile
    ? {
        duration: 0.85,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.9,
        touchMultiplier: 1
      }
    : {
        duration: 1,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1
      };

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis(lenisConfig);

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  function isIntroLocked() {
    return document.body.classList.contains('intro-locked');
  }

  if (isIntroLocked()) {
    lenis.stop();

    const observer = new MutationObserver(() => {
      if (!isIntroLocked()) {
        lenis.start();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  window.lenis = lenis;
})();
