var width = ["426", "1024"];

var marquee = document.querySelector(".footer-marquee");
if (marquee && typeof ScrollMagic !== 'undefined') {
  var sm = new ScrollMagic.Controller({
    refreshInterval: 0,
  });

  var scene = new ScrollMagic.Scene({
    triggerElement: marquee,
    triggerHook: "onEnter",
    offset: 0,
    duration: window.innerHeight + marquee.offsetHeight * 2,
  });

  scene.on("progress", function ({ progress }) {
    var startingOffset = 200;
    if (window.innerWidth >= width[0] && window.innerWidth <= width[1]) {
      startingOffset = 250;
    }
    if (window.innerWidth > width[0]) {
      var amount = -600;
      marquee.style.transform = `translate3d(0, 0, 0) translateX(${amount * progress + startingOffset}px)`;
    }
  });

  scene.addTo(sm);
}

// for previous sponsors
var marquee1 = document.querySelector(".footer-marquee1");
if (marquee1 && typeof ScrollMagic !== 'undefined') {
  var sm1 = new ScrollMagic.Controller({
    refreshInterval: 0,
  });

  var scene1 = new ScrollMagic.Scene({
    triggerElement: marquee1,
    triggerHook: "onEnter",
    offset: 0,
    duration: window.innerHeight + marquee1.offsetHeight * 2,
  });

  scene1.on("progress", function ({ progress }) {
    var startingOffset = -230;
    if (window.innerWidth >= width[0] && window.innerWidth <= width[1]) {
      startingOffset = -100;
    }
    if (window.innerWidth > width[0]) {
      var amount = 600;
      marquee1.style.transform = `translate3d(0, 0, 0) translateX(${amount * progress + startingOffset}px)`;
    }
  });

  scene1.addTo(sm1);
}



AOS.init({
  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 900, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});

$('.count').each(function () {
  var $this = $(this);
  var countTo = parseInt($this.text(), 10) || 0;
  $({ Counter: 0 }).animate({
    Counter: countTo
  }, {
    duration: 1800,
    easing: 'swing',
    step: function () {
      $this.text(Math.ceil(this.Counter) + '+');
    },
    complete: function () {
      $this.text(countTo + '+');
    }
  });
});

/*==================================================
  HERO DESK & MONITOR ZOOM CONTROLLER
==================================================*/

(function initHeroMonitorZoom() {
  const scrollTrack = document.getElementById('hero-scroll-track');
  const stickyStage = document.getElementById('hero-sticky-stage');
  const zoomContainer = document.getElementById('hero-zoom-container');
  const stageBox = document.getElementById('monitor-stage-box');
  const screenViewport = document.getElementById('monitor-screen-viewport');
  const screenInner = document.getElementById('monitor-screen-inner');
  const mainNav = document.getElementById('main-window-nav');

  if (!scrollTrack || !stickyStage || !zoomContainer || !stageBox || !screenViewport || !screenInner) return;

  const IMG_W = 1024;
  const IMG_H = 528;
  const IMG_ASPECT = IMG_W / IMG_H; // ~1.939394

  const SCR_LEFT_RATIO = 239 / 1024;
  const SCR_TOP_RATIO = 110 / 528;
  const SCR_WIDTH_RATIO = 497 / 1024;
  const SCR_HEIGHT_RATIO = 242 / 528;

  let ticking = false;

  let currentScreen = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    targetScaleX: 1,
    targetScaleY: 1
  };

  function updateLayout() {
    const Vw = window.innerWidth;
    const Vh = window.innerHeight;
    const V_aspect = Vw / Vh;

    let renderedW, renderedH, offX, offY;

    if (V_aspect > IMG_ASPECT) {
      renderedW = Vw;
      renderedH = Vw / IMG_ASPECT;
      offX = 0;
      offY = (Vh - renderedH) / 2;
    } else {
      renderedH = Vh;
      renderedW = Vh * IMG_ASPECT;
      offX = (Vw - renderedW) / 2;
      offY = 0;
    }

    const scrLeft = offX + renderedW * SCR_LEFT_RATIO;
    const scrTop = offY + renderedH * SCR_TOP_RATIO;
    const scrWidth = renderedW * SCR_WIDTH_RATIO;
    const scrHeight = renderedH * SCR_HEIGHT_RATIO;
    const scrCenterX = scrLeft + scrWidth / 2;
    const scrCenterY = scrTop + scrHeight / 2;

    currentScreen = {
      left: scrLeft,
      top: scrTop,
      width: scrWidth,
      height: scrHeight,
      centerX: scrCenterX,
      centerY: scrCenterY,
      targetScaleX: Vw / scrWidth,
      targetScaleY: Vh / scrHeight
    };

    // Position the screen viewport exactly inside the monitor cutout
    screenViewport.style.left = `${scrLeft}px`;
    screenViewport.style.top = `${scrTop}px`;
    screenViewport.style.width = `${scrWidth}px`;
    screenViewport.style.height = `${scrHeight}px`;

    if (window.innerWidth <= 991) {
      // Mobile: Direct CSI LED screen without desktop zoom gimmick
      screenInner.style.transform = '';
      screenInner.style.transformOrigin = '';
      stageBox.style.transform = '';
      screenInner.classList.remove('unzoomed-locked');
      if (mainNav) {
        mainNav.classList.add('nav-visible');
      }
      return;
    }

    // Scale the inside website content to match desktop proportions inside monitor
    const innerScaleX = scrWidth / Vw;
    const innerScaleY = scrHeight / Vh;
    screenInner.style.transformOrigin = 'top left';
    screenInner.style.transform = `scale(${innerScaleX}, ${innerScaleY})`;

    // Origin of zoom centered on monitor screen display
    stageBox.style.transformOrigin = `${scrCenterX}px ${scrCenterY}px`;

    updateZoom();
  }

  function updateZoom() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const monitorNav = document.getElementById('terminal-monitor-nav');

    if (window.innerWidth <= 991) {
      // Mobile: direct natural flow without zoom transform
      stickyStage.style.transform = '';
      stickyStage.style.visibility = 'visible';
      stageBox.style.transform = '';
      screenInner.classList.remove('unzoomed-locked');
      if (mainNav) {
        mainNav.classList.add('nav-visible');
        if (scrollY > 30) {
          mainNav.classList.add('scrolled');
        } else {
          mainNav.classList.remove('scrolled');
        }
      }
      const enterTrigger = document.getElementById('terminal-enter-trigger');
      if (enterTrigger) {
        if (scrollY > 20) {
          enterTrigger.classList.add('scroll-hint-hidden');
        } else {
          enterTrigger.classList.remove('scroll-hint-hidden');
        }
      }
      return;
    }

    const trackHeight = scrollTrack.offsetHeight;
    const maxScroll = trackHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    // Progress from 0 to 1.0 during the zoom track
    let progress = scrollY / maxScroll;
    progress = Math.max(0, Math.min(1, progress));

    // Toggle blur on scroll only
    if (scrollY > 40) {
      if (mainNav) mainNav.classList.add('scrolled');
      if (monitorNav) monitorNav.classList.add('scrolled');
    } else {
      if (mainNav) mainNav.classList.remove('scrolled');
      if (monitorNav) monitorNav.classList.remove('scrolled');
    }

    // Handle stage pinning & immediate seamless transition into rest of the site
    if (scrollY >= maxScroll) {
      const overflowY = scrollY - maxScroll;
      stickyStage.style.transform = `translate3d(0, ${-overflowY}px, 0)`;
      if (overflowY > window.innerHeight) {
        stickyStage.style.visibility = 'hidden';
      } else {
        stickyStage.style.visibility = 'visible';
      }
    } else {
      stickyStage.style.transform = 'translate3d(0, 0, 0)';
      stickyStage.style.visibility = 'visible';
    }

    // Camera zoom scale along both axes to stretch to 100vw x 100vh
    const currentScaleX = 1 + (currentScreen.targetScaleX - 1) * progress;
    const currentScaleY = 1 + (currentScreen.targetScaleY - 1) * progress;

    // Translation to move monitor center to viewport center
    const transX = ((window.innerWidth / 2) - currentScreen.centerX) * progress;
    const transY = ((window.innerHeight / 2) - currentScreen.centerY) * progress;

    screenViewport.style.borderRadius = `${Math.max(0, 3 * (1 - progress))}px`;

    stageBox.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(${currentScaleX}, ${currentScaleY})`;

    // Fade out scroll indicator immediately as user enters the monitor (progress > 0.03)
    const enterTrigger = document.getElementById('terminal-enter-trigger');
    if (enterTrigger) {
      if (progress > 0.03) {
        enterTrigger.classList.add('scroll-hint-hidden');
      } else {
        enterTrigger.classList.remove('scroll-hint-hidden');
      }
    }

    // Nav handoff: ONLY when monitor screen is ENTIRELY zoomed in (progress >= 0.98), reveal mainNav sliding down from top
    if (progress >= 0.98) {
      screenInner.classList.remove('unzoomed-locked');
      if (mainNav) {
        mainNav.classList.add('nav-visible');
      }
    } else {
      screenInner.classList.add('unzoomed-locked');
      if (mainNav) {
        mainNav.classList.remove('nav-visible');
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateZoom();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateLayout, { passive: true });

  // Initial calculation
  updateLayout();
  window.addEventListener('load', updateLayout);
})();

/*==================================================
  INTERACTIVE LED LETTERS TOGGLE (C, S, I) WITH ON/OFF FLICKER
==================================================*/
function initLedToggleLetters() {
  const ledLetters = document.querySelectorAll('.led-letter');
  ledLetters.forEach(function (letter) {
    letter.addEventListener('click', function (e) {
      e.stopPropagation();
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        this.classList.add('flickering-off');
        const self = this;
        setTimeout(function () {
          self.classList.remove('flickering-off');
          self.classList.add('off');
        }, 220);
      } else {
        this.classList.remove('off');
        this.classList.remove('flickering-off');
        this.classList.add('active');
      }
    });
  });
}

/*==================================================
  TERMINAL ENTER AUTO-SCROLL TRIGGER BUTTON
==================================================*/
function initTerminalEnterTrigger() {
  const enterBtn = document.getElementById('terminal-enter-trigger');
  const scrollTrack = document.getElementById('hero-scroll-track');
  if (enterBtn) {
    enterBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth <= 991) {
        const aboutSec = document.getElementById('cm');
        if (aboutSec) {
          aboutSec.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      const maxScroll = (scrollTrack ? scrollTrack.offsetHeight : 0) - window.innerHeight;
      window.scrollTo({
        top: Math.max(0, maxScroll),
        behavior: 'smooth'
      });
    });
  }
}

/*==================================================
  INTERACTIVE PARTICLES DOT GRID WITH CURSOR REPULSION PHYSICS
==================================================*/
function setupInteractiveDotCanvas(canvasId, stageElement, isGlobalWindow) {
  const canvas = document.getElementById(canvasId);
  const stage = typeof stageElement === 'string' ? document.querySelector(stageElement) : stageElement;
  if (!canvas || !stage) return null;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let dots = [];
  const spacing = 56;
  const repulsionRadius = 90;
  const maxDisplacement = 14;
  const springK = 0.08;
  const friction = 0.82;

  const mouse = {
    x: -9999,
    y: -9999,
    active: false
  };

  function createDots() {
    dots = [];
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = stage.clientWidth || window.innerWidth;
    height = stage.clientHeight || window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Deterministic pseudo-scatter based on grid coordinates
        const seed1 = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
        const rand1 = (seed1 - Math.floor(seed1)) * 2 - 1;
        const seed2 = Math.sin((i + 17) * 4.898 + (j + 9) * 23.23) * 23421.631;
        const rand2 = (seed2 - Math.floor(seed2)) * 2 - 1;

        // Skip some cells for organic scattered distribution
        const skipSeed = Math.abs((Math.sin(i * 91.34 + j * 37.89) * 10000) % 1);
        if (skipSeed > 0.82) continue;

        const ox = i * spacing + rand1 * (spacing * 0.35);
        const oy = j * spacing + rand2 * (spacing * 0.35);

        dots.push({
          originX: ox,
          originY: oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          radius: 1.15
        });
      }
    }
  }

  function onPointerMove(e) {
    if (isGlobalWindow) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      return;
    }

    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    if (
      e.clientX >= rect.left - 40 &&
      e.clientX <= rect.right + 40 &&
      e.clientY >= rect.top - 40 &&
      e.clientY <= rect.bottom + 40
    ) {
      mouse.x = ((e.clientX - rect.left) / rect.width) * width;
      mouse.y = ((e.clientY - rect.top) / rect.height) * height;
      mouse.active = true;
    } else {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }
  }

  function onPointerLeave() {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onPointerLeave, { passive: true });
  window.addEventListener('resize', createDots, { passive: true });

  createDots();

  function render() {
    if (!document.hidden) {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const R = repulsionRadius;
      const Rsq = R * R;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let targetX = dot.originX;
        let targetY = dot.originY;
        let glowFactor = 0;

        if (mouse.active) {
          const dx = dot.originX - mouse.x;
          const dy = dot.originY - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < Rsq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = 1 - dist / R;
            const push = force * force * maxDisplacement;
            const angle = Math.atan2(dy, dx);
            targetX = dot.originX + Math.cos(angle) * push;
            targetY = dot.originY + Math.sin(angle) * push;
            glowFactor = force;
          }
        }

        // Smooth subtle spring physics
        const ax = (targetX - dot.x) * springK;
        const ay = (targetY - dot.y) * springK;
        dot.vx = (dot.vx + ax) * friction;
        dot.vy = (dot.vy + ay) * friction;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Faint subtle dots: 30-40% of previous opacity, gentle hover response
        if (glowFactor > 0.03) {
          ctx.fillStyle = `rgba(147, 197, 253, ${0.22 + glowFactor * 0.22})`;
          const r = dot.radius + glowFactor * 0.35;
          ctx.fillRect(dot.x - r, dot.y - r, r * 2, r * 2);
        } else {
          ctx.fillStyle = 'rgba(96, 165, 250, 0.4)';
          ctx.fillRect(dot.x - dot.radius, dot.y - dot.radius, dot.radius * 2, dot.radius * 2);
        }
      }

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function initNavLogoPan() {
  const logoLinks = document.querySelectorAll('.nav-logo-link, #nav-brand-logo');
  logoLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}

/*==================================================
  WHAT WE DO - INTERACTIVE HOVER SPOTLIGHT CONTROLLER
==================================================*/
function initWhatWeDoSpotlight() {
  const spotlightData = {
    innovations: {
      img: 'images/i (1).jpg',
      badge: 'NATIONAL LEVEL TECH FEST',
      cat: '// FLAGSHIP NATIONAL EXPO',
      title: 'INNOVATIONS 2K25',
      desc: 'SIES GST’s premier national tech platform uniting 100+ project submissions from top engineering institutes across India to pitch cutting-edge prototypes before industry jury panels.',
      h1: '100+ Abstract Submissions from institutes across India',
      h2: 'Multi-track project domains in AI/ML, IoT, Cloud & Robotics',
      link: '#innovations'
    },
    enigma: {
      img: 'images/e (1).jpg',
      badge: 'CYBER DEFENSE ARENA',
      cat: '// NATIONAL POSTER COMPETITION',
      title: 'ENIGMA 2K25',
      desc: 'National competition exploring digital safety, blockchain security, online privacy, and modern counter-threat engineering evaluated by cybersecurity domain experts.',
      h1: 'Research on digital privacy, data sovereignty & counter-threat engineering',
      h2: 'Live presentations evaluated by industry cybersecurity specialists',
      link: '#enigma'
    },
    megabyte: {
      img: 'images/magzine.jpg',
      badge: 'FLAGSHIP PUBLICATION',
      cat: '// STUDENT RESEARCH & EDITORIAL',
      title: 'MEGABYTE MAGAZINE',
      desc: 'Our annual student-curated journal spotlighting groundbreaking technical articles, AI research reviews, council milestones, and industry interviews.',
      h1: 'Annual student research papers, domain breakthroughs & interviews',
      h2: 'Distributed across campus libraries, engineering faculty & students',
      link: '#magzine'
    },
    hackathons: {
      img: 'images/H (1).jpg',
      badge: 'RAPID PROTOTYPING',
      cat: '// 36-HOUR CODE SPRINT',
      title: 'HACKATHONS & CODE SPRINTS',
      desc: 'High-adrenaline team hackathons and logic battles challenging student developers to engineer viable solutions to real-world industrial and societal problems.',
      h1: '36-Hour continuous sprints with dedicated industry mentor support',
      h2: 'Cash rewards, internship sponsorships & product launch incubation',
      link: '#event'
    },
    workshops: {
      img: 'images/CYBER_workshop.jpg',
      badge: 'HANDS-ON MASTERCLASSES',
      cat: '// TECHNICAL SKILL DEVELOPMENT',
      title: 'DOMAIN MASTERCLASSES',
      desc: 'Expert-led interactive workshops in Machine Learning, Cloud Architecture, Cybersecurity, and Fullstack Engineering with hands-on labs and certifications.',
      h1: 'Hands-on practical code masterclasses in ML, Cloud & DevOps',
      h2: 'CSI recognized verifiable digital certifications for all attendees',
      link: '#event'
    }
  };

  const dockCards = document.querySelectorAll('.dock-card-item, .spotlight-trigger-item');
  const previewImg = document.getElementById('spotlight-img');
  const badgeText = document.getElementById('spotlight-badge-text');
  const categoryTag = document.getElementById('spotlight-cat');
  const titleEl = document.getElementById('spotlight-title');
  const descEl = document.getElementById('spotlight-desc');
  const h1El = document.getElementById('spotlight-h1');
  const h2El = document.getElementById('spotlight-h2');
  const linkBtn = document.getElementById('spotlight-link');

  if (!dockCards.length || !previewImg || !badgeText || !categoryTag || !titleEl || !descEl || !linkBtn) return;

  function setSpotlight(key) {
    const data = spotlightData[key];
    if (!data) return;

    // Update active trigger class
    dockCards.forEach(function (item) {
      if (item.getAttribute('data-spotlight') === key) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Fade out and update preview content
    previewImg.style.opacity = '0.35';
    setTimeout(function () {
      previewImg.src = data.img;
      badgeText.textContent = data.badge;
      categoryTag.textContent = data.cat;
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      if (h1El) h1El.textContent = data.h1;
      if (h2El) h2El.textContent = data.h2;
      linkBtn.href = data.link;
      previewImg.style.opacity = '1';
    }, 120);
  }

  dockCards.forEach(function (item) {
    const key = item.getAttribute('data-spotlight');
    item.addEventListener('mouseenter', function () {
      setSpotlight(key);
    });
    item.addEventListener('focus', function () {
      setSpotlight(key);
    });
    item.addEventListener('click', function () {
      setSpotlight(key);
    });
  });
}

function initAllDotsCanvases() {
  // Monitor internal screen canvas
  setupInteractiveDotCanvas('terminal-dots-canvas', '.terminal-stage', false);
  // Full hero background canvas (behind monitor)
  setupInteractiveDotCanvas('hero-bg-dots-canvas', '#hero-sticky-stage', true);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    initLedToggleLetters();
    initTerminalEnterTrigger();
    initNavLogoPan();
    initWhatWeDoSpotlight();
    initAllDotsCanvases();
  });
} else {
  initLedToggleLetters();
  initTerminalEnterTrigger();
  initNavLogoPan();
  initWhatWeDoSpotlight();
  initAllDotsCanvases();
}



