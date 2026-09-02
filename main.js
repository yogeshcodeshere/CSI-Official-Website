var width = ["426", "1024"];

var sm = new ScrollMagic.Controller({
  refreshInterval: 0,
});

var marquee = document.querySelector(".footer-marquee");

if (marquee) {
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

//for previous sponsors

var sm1 = new ScrollMagic.Controller({
  refreshInterval: 0,
});

var marquee1 = document.querySelector(".footer-marquee1");

if (marquee1) {
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
  offset: 120,
  delay: 0,
  duration: 900,
  easing: 'ease',
  once: false,
  mirror: false,
  anchorPlacement: 'top-bottom',
});

$('.count').each(function () {
  $(this).prop('Counter', 0).animate({
    Counter: $(this).text()
  }, {
    duration: 1500,
    easing: 'linear',
    step: function (now) {
      $(this).text(Math.ceil(now));
    }
  });
});

/* ============================================================
   EVENTS SECTION & LIGHTBOX CONTROLLER
============================================================ */

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

// Thumbnail switch function for Innovation 2026 Hero Card
function setHeroMainImage(src, btn) {
  const heroMain = document.getElementById("heroMainImg");
  if (heroMain) {
    heroMain.style.opacity = "0.4";
    setTimeout(() => {
      heroMain.src = src;
      heroMain.style.opacity = "1";
    }, 150);
  }
  document.querySelectorAll(".hero-thumb-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

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

// Event Filter Tabs Logic
function filterEvents(category, btn) {
  document.querySelectorAll(".filter-chip-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const cards = document.querySelectorAll(".log-event-card");
  cards.forEach(card => {
    const cardCat = (card.getAttribute("data-category") || "").toLowerCase();
    if (category === "all" || cardCat.includes(category.toLowerCase())) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Keyboard navigation and backdrop click for lightbox
document.addEventListener("keydown", function (e) {
  const modal = document.getElementById("eventLightboxModal");
  if (!modal || !modal.classList.contains("active")) return;

  if (e.key === "Escape") closeEventLightbox();
  if (e.key === "ArrowRight") nextLightboxImage();
  if (e.key === "ArrowLeft") prevLightboxImage();
});

// Touch swipe support for mobile lightbox
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("eventLightboxModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeEventLightbox();
    });

    const bodyArea = modal.querySelector(".lightbox-body");
    if (bodyArea) {
      bodyArea.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      bodyArea.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 45) nextLightboxImage();
        if (touchEndX > touchStartX + 45) prevLightboxImage();
      }, { passive: true });
    }
  }
});
