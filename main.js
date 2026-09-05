/*==================================================
  PREMIUM SMOOTH INERTIA SCROLL CONTROLLER (LENIS)
==================================================*/
let lenis = null;

function initLenisSmoothScroll() {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential luxury ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.2,
    infinite: false,
  });

  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', function () {
    if (typeof window.updateHeroZoom === 'function') {
      window.updateHeroZoom();
    }
  });

  // Smooth cinematic gliding for all hash anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;

      e.preventDefault();
      if (targetId === '#top') {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.4 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -25, duration: 1.4 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLenisSmoothScroll);
} else {
  initLenisSmoothScroll();
}

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



if (typeof AOS !== 'undefined') {
  AOS.init({
    // Faster, snappy scroll-to-reveal responsive settings
    offset: 45, // fast trigger point
    delay: 0,
    duration: 350, // fast 350ms animation instead of sluggish 900ms
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    once: true, // smoothly reveals once when scrolled into view
    mirror: false,
    anchorPlacement: 'top-bottom',
  });
}

if (typeof $ !== 'undefined') {
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
}

/*==================================================
  EVENTS SECTION & LIGHTBOX GALLERY CONTROLLER
==================================================*/

// Event Gallery Data Mapping (Single Source of Truth: event pics)
const eventGalleries = {
  "innovation-2026": {
    title: "INNOVATION 2026",
    year: 2026,
    category: "FLAGSHIP EVENT",
    subtitle: "National-Level Project Presentation Competition",
    images: [
      "assets/events/innovation-2026/innovation-2026-pic-1.jpg",
      "assets/events/innovation-2026/innovation-2026-pic-2.jpg",
      "assets/events/innovation-2026/innovation-2026-pic-3.jpg",
      "assets/events/innovation-2026/innovation-2026-pic-4.jpg",
      "assets/events/innovation-2026/innovation-2026-pic-5.jpg",
      "assets/events/innovation-2026/innovation-2026-pic-6.jpg",
      "assets/events/innovation-2026/innovation-2026-pic-7.jpg",
      "assets/events/innovation-2026/innovation-2026-pic-8.jpg",
      "assets/events/innovation-2026/innovation-2026-pic-9.jpg",
      "assets/events/innovation-2026/innovation-2026-pic-10.jpg"
    ]
  },
  "enigma-4": {
    title: "ENIGMA 4.0: CHRONIX",
    year: 2026,
    category: "FLAGSHIP EVENT",
    subtitle: "National-Level Web Development Hackathon",
    images: [
      "assets/events/enigma-4/enigma-4-pic-1.jpg",
      "assets/events/enigma-4/enigma-4-pic-2.jpg",
      "assets/events/enigma-4/enigma-4-pic-3.jpg",
      "assets/events/enigma-4/enigma-4-pic-4.jpg"
    ]
  },
  "synapse-1": {
    title: "SYNAPSE 1.0",
    year: 2026,
    category: "FEATURED EVENT",
    subtitle: "AI System & Product Strategy Job-Simulation Experience",
    images: [
      "assets/events/synapse-1/synapse-1-pic-1.jpg",
      "assets/events/synapse-1/synapse-1-pic-2.jpg",
      "assets/events/synapse-1/synapse-1-pic-3.jpg",
      "assets/events/synapse-1/synapse-1-pic-4.jpg",
      "assets/events/synapse-1/synapse-1-pic-5.jpg"
    ]
  },
  "innovation-2023": {
    title: "INNOVATION 2023",
    year: 2023,
    category: "COMPETITION",
    subtitle: "National Level Project Competition (2023 Edition)",
    images: [
      "assets/events/innovation-2023/innovation-2023-pic-1.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-2.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-3.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-4.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-5.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-6.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-7.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-8.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-9.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-10.jpg",
      "assets/events/innovation-2023/innovation-2023-pic-11.jpg"
    ]
  },
  "csi-outreach": {
    title: "CSI OUTREACH PROGRAM",
    year: 2024,
    category: "SEMINAR",
    subtitle: "Digital Safety & Cybersecurity Awareness at SIES School Matunga",
    images: [
      "assets/events/csi-outreach/csi-outreach-pic-1.jpg",
      "assets/events/csi-outreach/csi-outreach-pic-2.jpg",
      "assets/events/csi-outreach/csi-outreach-pic-3.jpg"
    ]
  },
  "cybersecurity-workshop": {
    title: "Cybersecurity Workshop",
    year: 2024,
    category: "WORKSHOP",
    subtitle: "Network Defense, Threat Analysis & Systems Security",
    images: [
      "assets/events/cybersecurity-workshop/cybersecurity-workshop-pic-1.jpg"
    ]
  },
  "dsa-workshop": {
    title: "DSA (Data Structures & Algorithms)",
    year: 2024,
    category: "WORKSHOP",
    subtitle: "Problem Solving, Data Structures & Algorithmic Complexity",
    images: [
      "assets/events/dsa-workshop/dsa-workshop-pic-1.jpg"
    ]
  },
  "iot-workshop": {
    title: "IoT (Internet of Things)",
    year: 2024,
    category: "WORKSHOP",
    subtitle: "Sensor Interfacing & Embedded Systems Programming",
    images: [
      "assets/events/iot-workshop/iot-workshop-pic-1.jpg"
    ]
  },
  "bootstrap-workshop": {
    title: "Bootstrap Framework",
    year: 2024,
    category: "WORKSHOP",
    subtitle: "Responsive UI Grids & Modern Component Styling",
    images: [
      "assets/events/bootstrap-workshop/bootstrap-workshop-pic-1.png"
    ]
  },
  "django-workshop": {
    title: "Django Web Framework",
    year: 2024,
    category: "WORKSHOP",
    subtitle: "Full-Stack Web Development & ORM Database Modeling",
    images: [
      "assets/events/django-workshop/django-workshop-pic-1.png"
    ]
  },
  "angular-workshop": {
    title: "Angular 5 Framework",
    year: 2024,
    category: "WORKSHOP",
    subtitle: "Single Page Apps, TypeScript & Modular Frontend Architectures",
    images: [
      "assets/events/angular-workshop/angular-workshop-pic-1.png"
    ]
  },
  "basic-programming-workshop": {
    title: "Basic Programming & Logic",
    year: 2024,
    category: "WORKSHOP",
    subtitle: "Control Structures, Problem Formulation & Clean Code",
    images: [
      "assets/events/basic-programming-workshop/basic-programming-workshop-pic-1.png"
    ]
  },
  "cloud-aws-workshop": {
    title: "Cloud Computing & AWS Fundamentals",
    year: 2024,
    category: "WORKSHOP",
    subtitle: "Cloud Infrastructure, EC2, S3 & Serverless Models",
    images: [
      "assets/events/cloud-aws-workshop/cloud-aws-workshop-pic-1.png"
    ]
  },
  "placement-guidance": {
    title: "Placement Guidance",
    year: 2024,
    category: "SEMINAR",
    subtitle: "Technical Interviews, Coding Rounds & Hiring Roadmaps",
    images: [
      "assets/events/placement-guidance/placement-guidance-pic-1.png"
    ]
  }
};

// Aliases for backwards compatibility
eventGalleries.innovation2026 = eventGalleries["innovation-2026"];
eventGalleries.enigma4 = eventGalleries["enigma-4"];
eventGalleries.synapse1 = eventGalleries["synapse-1"];
eventGalleries.innovation2023 = eventGalleries["innovation-2023"];
eventGalleries.innovation2025 = eventGalleries["innovation-2023"];
eventGalleries["innovation-2025"] = eventGalleries["innovation-2023"];
eventGalleries.outreach = eventGalleries["csi-outreach"];

let currentGalleryKey = null;
let currentImageIndex = 0;

// Open Lightbox Gallery Modal
function openEventGallery(eventKey, startIndex = 0) {
  const gallery = eventGalleries[eventKey];
  if (!gallery || !gallery.images || gallery.images.length === 0) return;

  currentGalleryKey = eventKey;
  currentImageIndex = startIndex;

  const modal = document.getElementById("eventLightboxModal");
  const titleEl = document.getElementById("lightboxTitle");
  const subtitleEl = document.getElementById("lightboxSubtitle");
  const counterEl = document.getElementById("lightboxCounter");
  const thumbsContainer = document.getElementById("lightboxThumbs");

  if (titleEl) titleEl.textContent = gallery.title;
  if (subtitleEl) subtitleEl.textContent = gallery.subtitle;

  // Populate thumbnails
  if (thumbsContainer) {
    thumbsContainer.innerHTML = "";
    gallery.images.forEach((imgSrc, idx) => {
      const thumb = document.createElement("button");
      thumb.className = `lightbox-thumb ${idx === currentImageIndex ? 'active' : ''}`;
      thumb.setAttribute("aria-label", `View photo ${idx + 1}`);
      thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${idx + 1}" loading="lazy">`;
      thumb.onclick = () => showLightboxImage(idx);
      thumbsContainer.appendChild(thumb);
    });
  }

  showLightboxImage(currentImageIndex);

  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

// Show specific image inside lightbox
function showLightboxImage(index) {
  const gallery = eventGalleries[currentGalleryKey];
  if (!gallery) return;

  if (index < 0) index = gallery.images.length - 1;
  if (index >= gallery.images.length) index = 0;
  currentImageIndex = index;

  const mainImg = document.getElementById("lightboxMainImg");
  const counterEl = document.getElementById("lightboxCounter");

  if (mainImg) {
    mainImg.style.opacity = "0.3";
    setTimeout(() => {
      mainImg.src = gallery.images[currentImageIndex];
      mainImg.style.opacity = "1";
    }, 120);
  }

  if (counterEl) {
    counterEl.textContent = `Photo ${currentImageIndex + 1} of ${gallery.images.length}`;
  }

  // Update active thumbnail
  const thumbs = document.querySelectorAll(".lightbox-thumb");
  thumbs.forEach((t, i) => {
    t.classList.toggle("active", i === currentImageIndex);
  });
}

function nextLightboxImage() {
  showLightboxImage(currentImageIndex + 1);
}

function prevLightboxImage() {
  showLightboxImage(currentImageIndex - 1);
}

function closeEventLightbox() {
  const modal = document.getElementById("eventLightboxModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Event Filter Tabs & 4-Card Layout (3 Normal Cards + 1 Show More Card)
let eventsExpanded = false;
let currentEventCategory = 'events';

function updateTabIndicator(btn) {
  const indicator = document.getElementById('filterTabIndicator');
  if (!indicator) return;
  const targetBtn = btn || document.querySelector('.filter-chip-btn.active') || document.getElementById('filterBtnEvents');
  if (!targetBtn) return;
  indicator.style.left = targetBtn.offsetLeft + 'px';
  indicator.style.width = targetBtn.offsetWidth + 'px';
}

function toggleMoreEvents() {
  eventsExpanded = !eventsExpanded;
  const activeBtn = document.querySelector('.filter-chip-btn.active');
  filterEvents(currentEventCategory, activeBtn, true);

  if (!eventsExpanded) {
    const eventSec = document.getElementById('event');
    if (eventSec) {
      eventSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function filterEvents(category, btn, isToggle) {
  // If user clicked a tab, reset expanded state so it starts in compact 4-card view
  if (btn && !isToggle) {
    eventsExpanded = false;
  }

  if (category) {
    currentEventCategory = category;
  } else {
    category = currentEventCategory;
  }

  document.querySelectorAll(".filter-chip-btn").forEach(b => b.classList.remove("active"));
  let activeBtn = btn;
  if (btn) {
    btn.classList.add("active");
  } else {
    activeBtn = document.querySelector(`.filter-chip-btn[onclick*="'${category}'"]`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  // Smooth sliding underline indicator (physically impossible to double-flash)
  updateTabIndicator(activeBtn);

  const cards = document.querySelectorAll(".log-event-card");
  const showMoreBtn = document.getElementById("events-show-more-btn");
  const showMoreWrapper = document.getElementById("eventsLoadMoreWrapper");
  const matchingCards = [];

  cards.forEach(card => {
    const cardCat = (card.getAttribute("data-category") || "").toLowerCase();
    let isMatch = false;

    if (category === "workshops" || category === "workshop") {
      isMatch = cardCat.includes("workshop");
    } else if (category === "events" || category === "event") {
      isMatch = cardCat.includes("event") || cardCat.includes("flagship") || cardCat.includes("hackathon") || cardCat.includes("seminar");
    } else if (category === "all") {
      isMatch = true;
    } else {
      isMatch = cardCat.includes(category.toLowerCase());
    }

    if (isMatch) {
      matchingCards.push(card);
    } else {
      card.style.display = "none";
      card.style.opacity = "0";
      card.style.visibility = "hidden";
    }
  });

  const LIMIT = 3; // 3 cards fill 1 clean full row in 3-col desktop grid
  matchingCards.forEach((card, index) => {
    if (eventsExpanded || index < LIMIT) {
      card.style.display = "flex";
      card.style.opacity = "1";
      card.style.visibility = "visible";
      card.style.transform = "none";
      card.classList.add("aos-animate");
    } else {
      card.style.display = "none";
      card.style.opacity = "0";
      card.style.visibility = "hidden";
    }
  });

  if (showMoreWrapper && showMoreBtn) {
    if (matchingCards.length <= LIMIT) {
      showMoreWrapper.style.display = "none";
    } else {
      showMoreWrapper.style.display = "flex";

      const remainingCount = matchingCards.length - LIMIT;
      const countLabel = showMoreBtn.querySelector(".show-more-count-label");
      const btnIcon = showMoreBtn.querySelector(".show-more-btn-icon");

      if (eventsExpanded) {
        showMoreBtn.classList.add("is-expanded");
        if (countLabel) countLabel.textContent = "COLLAPSE ARCHIVE";
        if (btnIcon) btnIcon.className = "ri-arrow-up-s-line show-more-btn-icon";
      } else {
        showMoreBtn.classList.remove("is-expanded");
        const catName = (category === "workshops" ? "WORKSHOPS" : "EVENTS");
        if (countLabel) countLabel.textContent = `SHOW ${remainingCount} MORE ${catName}`;
        if (btnIcon) btnIcon.className = "ri-arrow-down-s-line show-more-btn-icon";
      }
    }
  }
}

// Initialize Lightbox Modal Event Listeners
function initLightboxListeners() {
  const modal = document.getElementById("eventLightboxModal");
  if (!modal) return;

  // Backdrop click to close
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeEventLightbox();
  });

  // Touch swipe support for mobile lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  const bodyArea = modal.querySelector(".lightbox-body");
  if (bodyArea) {
    bodyArea.addEventListener("touchstart", function (e) {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    bodyArea.addEventListener("touchend", function (e) {
      if (e.changedTouches && e.changedTouches[0]) {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 45) nextLightboxImage();
        if (touchEndX > touchStartX + 45) prevLightboxImage();
      }
    }, { passive: true });
  }

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeEventLightbox();
    if (e.key === "ArrowRight") nextLightboxImage();
    if (e.key === "ArrowLeft") prevLightboxImage();
  });
}



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
    if (window.innerWidth <= 991) {
      // Mobile: Clear any desktop viewport styles so mobile CSS rules have 100% control
      screenViewport.style.left = '';
      screenViewport.style.top = '';
      screenViewport.style.width = '';
      screenViewport.style.height = '';
      screenViewport.style.borderRadius = '';
      screenInner.style.transform = '';
      screenInner.style.transformOrigin = '';
      stageBox.style.transform = '';
      stageBox.style.transformOrigin = '';
      stickyStage.style.transform = '';
      stickyStage.style.visibility = 'visible';
      screenInner.classList.remove('unzoomed-locked');
      if (mainNav) {
        mainNav.classList.add('nav-visible');
      }
      return;
    }

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
      const heroLogo = document.getElementById('hero-csi-logo');
      const heroSubtext = document.getElementById('hero-csi-subtext');
      if (heroLogo) heroLogo.style.opacity = '1';
      if (heroSubtext) heroSubtext.style.opacity = '1';
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

    // Camera zoom scale with smoothstep easing for a luxurious, cinematic feel
    const smoothT = progress * progress * (3 - 2 * progress);
    const currentScaleX = 1 + (currentScreen.targetScaleX - 1) * smoothT;
    const currentScaleY = 1 + (currentScreen.targetScaleY - 1) * smoothT;

    // Translation to move monitor center to viewport center
    const transX = ((window.innerWidth / 2) - currentScreen.centerX) * smoothT;
    const transY = ((window.innerHeight / 2) - currentScreen.centerY) * smoothT;

    screenViewport.style.borderRadius = `${Math.max(0, 3 * (1 - smoothT))}px`;

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

    // Keep CSI top logo and SIES GST subtitle visible even when monitor is zoomed in
    const heroLogo = document.getElementById('hero-csi-logo');
    const heroSubtext = document.getElementById('hero-csi-subtext');
    if (heroLogo && !heroLogo.classList.contains('off')) heroLogo.style.opacity = '1';
    if (heroSubtext) heroSubtext.style.opacity = '1';

    // Nav handoff with hysteresis: prevents flickering around threshold
    if (progress >= 0.94) {
      screenInner.classList.remove('unzoomed-locked');
      if (mainNav) {
        mainNav.classList.add('nav-visible');
      }
    } else if (progress < 0.88) {
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

  window.updateHeroZoom = onScroll;
  if (window.lenis) {
    window.lenis.on('scroll', onScroll);
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
  const topLogo = document.querySelector('.hero-csi-top-logo');
  const logoWrap = document.querySelector('.hero-csi-logo-wrap');
  const logoTargets = [topLogo, logoWrap].filter(Boolean);

  ledLetters.forEach(function (letter) {
    letter.addEventListener('click', function (e) {
      e.stopPropagation();
      const isI = letter.id === 'led-i' || letter.getAttribute('data-letter') === 'I';

      if (this.classList.contains('active')) {
        this.classList.remove('active');
        this.classList.add('flickering-off');
        if (isI) {
          logoTargets.forEach(el => {
            el.classList.remove('active');
            el.classList.add('flickering-off');
          });
        }
        const self = this;
        setTimeout(function () {
          self.classList.remove('flickering-off');
          self.classList.add('off');
          if (isI) {
            logoTargets.forEach(el => {
              el.classList.remove('flickering-off');
              el.classList.add('off');
            });
          }
        }, 220);
      } else {
        this.classList.remove('off');
        this.classList.remove('flickering-off');
        this.classList.add('active');
        if (isI) {
          logoTargets.forEach(el => {
            el.classList.remove('off');
            el.classList.remove('flickering-off');
            el.classList.add('active');
          });
        }
      }
    });
  });

  // Clicking top logo toggles letter 'I' & logo together
  const clickableLogo = topLogo || logoWrap;
  if (clickableLogo) {
    clickableLogo.addEventListener('click', function (e) {
      e.stopPropagation();
      const ledI = document.getElementById('led-i');
      if (ledI) ledI.click();
    });
  }
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
      if (window.lenis) {
        window.lenis.scrollTo(Math.max(0, maxScroll), { duration: 1.4 });
      } else {
        window.scrollTo({
          top: Math.max(0, maxScroll),
          behavior: 'smooth'
        });
      }
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

    const isPhone = width <= 768;
    const currentSpacing = isPhone ? 30 : spacing;
    const dotRadius = isPhone ? 0.6 : 1.15;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const cols = Math.ceil(width / currentSpacing) + 1;
    const rows = Math.ceil(height / currentSpacing) + 1;

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

        const ox = i * currentSpacing + rand1 * (currentSpacing * 0.35);
        const oy = j * currentSpacing + rand2 * (currentSpacing * 0.35);

        // Do not generate dots in top-right navbar/hamburger area on mobile/tablet
        if (width <= 991 && ox >= width - 140 && oy <= 95) continue;

        dots.push({
          originX: ox,
          originY: oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          radius: dotRadius
        });
      }
    }
  }

  function onPointerMove(e) {
    // Silence dot interaction near mobile hamburger button in top-right corner
    if (window.innerWidth <= 991 && e.clientY <= 95 && e.clientX >= window.innerWidth - 140) {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      return;
    }

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

        // Faint subtle dots: 10-20% brighter and harmonized with slate-indigo #495796
        const isPhone = width <= 768;
        if (glowFactor > 0.03) {
          ctx.fillStyle = `rgba(135, 150, 210, ${0.28 + glowFactor * 0.26})`;
          const r = dot.radius + glowFactor * (isPhone ? 0.18 : 0.35);
          ctx.fillRect(dot.x - r, dot.y - r, r * 2, r * 2);
        } else {
          ctx.fillStyle = isPhone ? 'rgba(100, 115, 175, 0.38)' : 'rgba(100, 115, 175, 0.48)';
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
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
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

  const spotlightKeys = ['innovations', 'enigma', 'hackathons', 'workshops'];
  let spotlightIndex = 0;
  let spotlightTimer = null;
  let isSpotlightHovered = false;

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

  function advanceSpotlight() {
    if (isSpotlightHovered) return;
    spotlightIndex = (spotlightIndex + 1) % spotlightKeys.length;
    setSpotlight(spotlightKeys[spotlightIndex]);
  }

  function startSpotlightTimer() {
    stopSpotlightTimer();
    spotlightTimer = setInterval(advanceSpotlight, 2000);
  }

  function stopSpotlightTimer() {
    if (spotlightTimer) {
      clearInterval(spotlightTimer);
      spotlightTimer = null;
    }
  }

  const spotlightBlock = document.getElementById('what-we-do') || document.querySelector('.about-spotlight-block');
  if (spotlightBlock) {
    spotlightBlock.addEventListener('mouseenter', function () {
      isSpotlightHovered = true;
    });
    spotlightBlock.addEventListener('mouseleave', function () {
      isSpotlightHovered = false;
    });
  }

  dockCards.forEach(function (item) {
    const key = item.getAttribute('data-spotlight');
    function onSelectCard() {
      const idx = spotlightKeys.indexOf(key);
      if (idx !== -1) spotlightIndex = idx;
      setSpotlight(key);
      startSpotlightTimer();
    }
    item.addEventListener('mouseenter', onSelectCard);
    item.addEventListener('focus', onSelectCard);
    item.addEventListener('click', onSelectCard);
  });

  if ('IntersectionObserver' in window && spotlightBlock) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startSpotlightTimer();
        } else {
          stopSpotlightTimer();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(spotlightBlock);
  } else {
    startSpotlightTimer();
  }
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
    initLightboxListeners();
    filterEvents('events', document.querySelector('.filter-chip-btn.active'));
    setTimeout(() => updateTabIndicator(), 60);
  });
} else {
  initLedToggleLetters();
  initTerminalEnterTrigger();
  initNavLogoPan();
  initWhatWeDoSpotlight();
  initAllDotsCanvases();
  initLightboxListeners();
  filterEvents('events', document.querySelector('.filter-chip-btn.active'));
}

// ==================================================
// CSI DIGITAL DISPLAY AUTO FLICKER
// ==================================================

const csiLetters = document.querySelectorAll('.led-letter');

function flickerCSI() {
  if (!csiLetters.length) return;

  // Pick 1–2 random letters, like a slightly imperfect LED display
  const count = Math.random() < 0.75 ? 1 : 2;
  const selected = [];

  while (selected.length < count) {
    const letter = csiLetters[Math.floor(Math.random() * csiLetters.length)];

    if (!selected.includes(letter)) {
      selected.push(letter);
    }
  }

  selected.forEach((letter, index) => {
    // Small stagger between letters
    setTimeout(() => {
      letter.classList.remove('flickering-off');

      // Force animation restart
      void letter.offsetWidth;

      letter.classList.add('flickering-off');

      // If this is letter 'I', match the flickering effect with the top CSI logo!
      const isI = letter.id === 'led-i' || letter.getAttribute('data-letter') === 'I';
      if (isI) {
        const topLogo = document.querySelector('.hero-csi-top-logo');
        const logoWrap = document.querySelector('.hero-csi-logo-wrap');
        const logoElements = [topLogo, logoWrap].filter(Boolean);
        logoElements.forEach(el => {
          el.classList.remove('flickering-off');
          void el.offsetWidth;
          el.classList.add('flickering-off');
        });
      }

      // Clean up after animation
      setTimeout(() => {
        letter.classList.remove('flickering-off');
        if (isI) {
          const topLogo = document.querySelector('.hero-csi-top-logo');
          const logoWrap = document.querySelector('.hero-csi-logo-wrap');
          const logoElements = [topLogo, logoWrap].filter(Boolean);
          logoElements.forEach(el => el.classList.remove('flickering-off'));
        }
      }, 250);

    }, index * 70);
  });
}

// First flicker after 2–3 seconds
function scheduleCSIFlicker() {
  const delay = 2000 + Math.random() * 1000;

  setTimeout(() => {
    flickerCSI();
    scheduleCSIFlicker();
  }, delay);
}

scheduleCSIFlicker();

/* ================================================================
   MOBILE CYBER NAVBAR: Bulletproof Hamburger & Auto-collapse
   ================================================================ */
(function initMobileNav() {
  const mainNavCollapse = document.getElementById('navbarNavMain');
  const mainNavToggler = document.getElementById('mainNavToggler') || document.querySelector('.cyber-hamburger-btn');
  const mainNav = document.getElementById('main-window-nav');

  if (!mainNavCollapse || !mainNavToggler) return;

  let lastToggleTime = 0;
  function toggleMobileNav(e) {
    const now = Date.now();
    if (now - lastToggleTime < 400) {
      if (e) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }
      return;
    }
    lastToggleTime = now;

    if (e) {
      if (e.cancelable && e.type !== 'pointerdown') e.preventDefault();
      e.stopPropagation();
    }
    const isCurrentlyOpen = mainNavCollapse.classList.contains('show');
    const willOpen = !isCurrentlyOpen;

    if (willOpen) {
      mainNavCollapse.classList.add('show');
      mainNavToggler.classList.remove('collapsed');
      mainNavToggler.setAttribute('aria-expanded', 'true');
      if (mainNav) mainNav.classList.add('has-menu-open');
    } else {
      mainNavCollapse.classList.remove('show');
      mainNavToggler.classList.add('collapsed');
      mainNavToggler.setAttribute('aria-expanded', 'false');
      if (mainNav) mainNav.classList.remove('has-menu-open');
    }
  }

  function closeMobileNav() {
    if (Date.now() - lastToggleTime < 400) return;
    if (mainNavCollapse.classList.contains('show')) {
      mainNavCollapse.classList.remove('show');
      mainNavToggler.classList.add('collapsed');
      mainNavToggler.setAttribute('aria-expanded', 'false');
      if (mainNav) mainNav.classList.remove('has-menu-open');
    }
  }

  // Bind pointerdown and click with deduplication to prevent double-toggle on tap/release
  let handledByPointer = false;
  mainNavToggler.addEventListener('pointerdown', function (e) {
    if (e.button === 0 || e.pointerType === 'touch') {
      handledByPointer = true;
      toggleMobileNav(e);
      setTimeout(function () { handledByPointer = false; }, 500);
    }
  });
  mainNavToggler.addEventListener('click', function (e) {
    if (handledByPointer) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      return;
    }
    toggleMobileNav(e);
  });

  // Intercept any tap on the entire right side of the navbar header (all the way to the right screen edge)
  mainNav.addEventListener('pointerdown', function (e) {
    if (window.innerWidth <= 991) {
      if (e.target.closest('#mainNavToggler, .cyber-hamburger-btn')) return;
      const rect = mainNav.getBoundingClientRect();
      if (e.clientY <= (rect.top + 60) && e.clientX >= (window.innerWidth - 110)) {
        toggleMobileNav(e);
      }
    }
  });

  // Close when clicking any nav link
  mainNavCollapse.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 991) {
        closeMobileNav();
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 991 && mainNavCollapse.classList.contains('show')) {
      if (Date.now() - lastToggleTime < 400) return;
      if (e.target.closest('#mainNavToggler, .cyber-hamburger-btn')) return;
      if (mainNav && !mainNav.contains(e.target)) {
        closeMobileNav();
      }
    }
  });

  // Close on Escape key for accessibility
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNavCollapse.classList.contains('show')) {
      closeMobileNav();
    }
  });
})();




