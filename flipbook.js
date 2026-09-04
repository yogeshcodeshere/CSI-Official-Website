(function () {
  'use strict';

  var PDF_PATH = 'assets/Megabyte_compressed.pdf';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  var root = document.getElementById('megabyte-flipbook');
  if (!root) return;

  function $(id) { return document.getElementById(id); }

  function showFallback(message) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:24px;text-align:center;gap:16px;background:rgba(10,14,30,0.85);border-radius:16px;box-shadow:0 15px 40px rgba(0,0,0,0.6);border:1px solid rgba(0,240,255,0.2);">' +
        '<img src="images/magzine.jpg" alt="Megabyte Cover" style="width:160px;height:auto;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.6);border:1px solid rgba(0,240,255,0.3);">' +
        '<h4 style="color:#ffffff;font-family:\'Outfit\',sans-serif;font-weight:700;font-size:1.2rem;margin:0;">MEGABYTE 2026</h4>' +
        '<p style="color:#94a3b8;font-family:\'Outfit\',sans-serif;font-size:0.85rem;max-width:320px;margin:0;line-height:1.5;">' + (message || 'Read the flagship technical magazine directly or open online.') + '</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px;">' +
          '<a href="' + PDF_PATH + '" target="_blank" style="background:#00f0ff;color:#04042c;padding:8px 16px;border-radius:6px;font-family:\'Space Grotesk\',monospace;font-weight:700;font-size:0.8rem;text-decoration:none;transition:transform 0.2s;">OPEN PDF</a>' +
          '<a href="https://online.fliphtml5.com/vxsxt/ilcm/" target="_blank" style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:8px 16px;border-radius:6px;font-family:\'Space Grotesk\',monospace;font-weight:700;font-size:0.8rem;text-decoration:none;">FLIPBOOK ONLINE</a>' +
        '</div>' +
      '</div>';
  }

  // If protocol is file://, browser security restricts XHR/fetch to local files
  if (window.location.protocol === 'file:') {
    showFallback('Browser security restricts embedded PDF rendering over file:// URLs. Please view via local server (e.g. localhost:5500 or VS Code Live Server) or read below:');
    return;
  }

  /* ===== Loading Screen ===== */
  root.innerHTML =
    '<div class="fb-load" id="fbLoad">' +
      '<div class="fb-load-spin"></div>' +
      '<p class="fb-load-label" id="fbLabel">Loading MEGABYTE...</p>' +
      '<div class="fb-load-track"><div class="fb-load-bar" id="fbBar"></div></div>' +
    '</div>';

  var attempts = 0;

  async function init() {
    var pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    var StFlip = window.St && window.St.PageFlip;

    if (!pdfjsLib || !StFlip) {
      attempts++;
      if (attempts < 20) {
        setTimeout(init, 150);
        return;
      }
      showFallback('Libraries could not load. Please check your internet connection.');
      return;
    }

    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    } catch (e) {
      console.warn('Could not set worker, falling back', e);
    }

    /* ---- Step 1: Download the PDF ---- */
    var task = pdfjsLib.getDocument(PDF_PATH);
    task.onProgress = function (p) {
      if (p.total > 0) {
        var pct = Math.round((p.loaded / p.total) * 100);
        var bar = $('fbBar');
        var lbl = $('fbLabel');
        if (bar) bar.style.width = pct + '%';
        if (lbl) lbl.textContent = 'Downloading... ' + pct + '%';
      }
    };

    try {
      var pdf = await task.promise;
      var numPages = pdf.numPages;

      /* ---- Step 2: Get page aspect ratio from first page ---- */
      var page1 = await pdf.getPage(1);
      var vp0 = page1.getViewport({ scale: 1 });
      var pageAspect = vp0.width / vp0.height;

      /* ---- Step 3: Render initial pages & Build DOM ---- */
      var renderH = 900;
      var renderScale = renderH / vp0.height;

      // Function to render a single page to a blob URL
      async function renderPage(pageNum) {
        var page = await pdf.getPage(pageNum);
        var vp = page.getViewport({ scale: renderScale });
        var canvas = document.createElement('canvas');
        canvas.width = vp.width;
        canvas.height = vp.height;
        var ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        var blob = await new Promise(function (resolve) {
          canvas.toBlob(resolve, 'image/jpeg', 0.85);
        });
        return URL.createObjectURL(blob);
      }

      var lbl = $('fbLabel');
      if (lbl) lbl.textContent = 'Preparing cover...';
      
      // Render only the first 2 pages so it loads instantly
      var page1Url = await renderPage(1);
      var page2Url = numPages >= 2 ? await renderPage(2) : null;

      /* ---- Step 4: Build flipbook DOM ---- */
      root.innerHTML =
        '<div class="fb-stage" id="fbStage">' +
          '<div class="fb-book" id="fbBook"></div>' +
          '<div class="fb-controls">' +
            '<button class="fb-arrow fb-arrow--l" id="fbPrev" aria-label="Previous Page">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>' +
            '</button>' +
            '<span class="fb-counter" id="fbCount"></span>' +
            '<button class="fb-arrow fb-arrow--r" id="fbNext" aria-label="Next Page">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>' +
            '</button>' +
            '<button class="fb-play-pause-btn" id="fbPlayPause" aria-label="Pause Auto-Flip" title="Toggle Auto-Flip">' +
              '<span class="fb-btn-icon" id="fbPlayPauseIcon">' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1"></rect><rect x="15" y="4" width="4" height="16" rx="1"></rect></svg>' +
              '</span>' +
              '<span class="fb-btn-text" id="fbPlayPauseText">PAUSE</span>' +
            '</button>' +
          '</div>' +
        '</div>';

      var bookEl = $('fbBook');
      var imgElements = []; // Store image references for lazy-loading

      for (var i = 1; i <= numPages; i++) {
        var div = document.createElement('div');
        div.className = 'fb-page-item';
        if (i === 1 || i === numPages) {
          div.setAttribute('data-density', 'hard');
        }
        var img = document.createElement('img');
        
        // Assign URLs for pages 1 and 2, leave the rest empty temporarily
        if (i === 1) img.src = page1Url;
        else if (i === 2) img.src = page2Url;
        
        img.className = 'fb-page-img';
        img.alt = 'Page ' + i;
        img.draggable = false;
        
        div.appendChild(img);
        bookEl.appendChild(div);
        imgElements.push(img);
      }

      /* ---- Step 5: Initialize StPageFlip ---- */
      var baseWidth = Math.round(vp0.width);
      var baseHeight = Math.round(vp0.height);

      var flipbook = new StFlip(bookEl, {
        width: baseWidth,
        height: baseHeight,
        size: 'stretch',
        minWidth: 2000,
        maxWidth: 3000,
        minHeight: 100,
        maxHeight: 3000,
        maxShadowOpacity: 0.5,
        showCover: false,
        mobileScrollSupport: false,
        flippingTime: 700,
        useMouseEvents: true,
        usePortrait: true,
        swipeDistance: 30,
        drawShadow: true,
        startPage: 0
      });

      flipbook.loadFromHTML(document.querySelectorAll('.fb-page-item'));

      /* ---- Step 6: Controls & Events ---- */
      function updateCounter() {
        var c = flipbook.getCurrentPageIndex();
        var countEl = $('fbCount');
        if (countEl) countEl.textContent = (c + 1) + ' / ' + numPages;
      }
      updateCounter();

      flipbook.on('flip', updateCounter);
      flipbook.on('changeState', updateCounter);

      var prevBtn = $('fbPrev');
      var nextBtn = $('fbNext');
      var playPauseBtn = $('fbPlayPause');
      var playPauseIcon = $('fbPlayPauseIcon');
      var playPauseText = $('fbPlayPauseText');

      var isAutoPaused = false;
      var isStageHovered = false;
      var autoFlipTimer = null;
      var FLIP_INTERVAL = 2000; // 2 seconds

      function performAutoFlip() {
        if (isAutoPaused || isStageHovered) return;
        try {
          var cur = flipbook.getCurrentPageIndex();
          if (cur >= numPages - 1) {
            if (typeof flipbook.flip === 'function') {
              flipbook.flip(0);
            } else {
              flipbook.flipNext();
            }
          } else {
            flipbook.flipNext();
          }
        } catch (err) {
          console.warn('Auto-flip error:', err);
        }
      }

      function startAutoFlip() {
        stopAutoFlip();
        if (isAutoPaused) return;
        autoFlipTimer = setInterval(performAutoFlip, FLIP_INTERVAL);
      }

      function stopAutoFlip() {
        if (autoFlipTimer) {
          clearInterval(autoFlipTimer);
          autoFlipTimer = null;
        }
      }

      function updatePlayPauseBtn() {
        if (!playPauseBtn || !playPauseIcon || !playPauseText) return;
        if (isAutoPaused) {
          playPauseBtn.classList.add('paused');
          playPauseIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>';
          playPauseText.textContent = 'AUTO-FLIP';
          playPauseBtn.setAttribute('aria-label', 'Resume Auto-Flip');
        } else {
          playPauseBtn.classList.remove('paused');
          playPauseIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1"></rect><rect x="15" y="4" width="4" height="16" rx="1"></rect></svg>';
          playPauseText.textContent = 'PAUSE';
          playPauseBtn.setAttribute('aria-label', 'Pause Auto-Flip');
        }
      }

      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function () {
          isAutoPaused = !isAutoPaused;
          updatePlayPauseBtn();
          if (isAutoPaused) {
            stopAutoFlip();
          } else {
            startAutoFlip();
          }
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          flipbook.flipPrev();
          if (!isAutoPaused) startAutoFlip();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          flipbook.flipNext();
          if (!isAutoPaused) startAutoFlip();
        });
      }

      var stageEl = $('fbStage') || bookEl;
      if (stageEl) {
        stageEl.addEventListener('mouseenter', function () {
          isStageHovered = true;
        });
        stageEl.addEventListener('mouseleave', function () {
          isStageHovered = false;
        });
      }

      document.addEventListener('keydown', function (e) {
        var rect = root.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          flipbook.flipNext();
          if (!isAutoPaused) startAutoFlip();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          flipbook.flipPrev();
          if (!isAutoPaused) startAutoFlip();
        }
      });

      // Observe visibility so auto-flip only runs when user is looking at magazine
      if ('IntersectionObserver' in window) {
        var magObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (!isAutoPaused) startAutoFlip();
            } else {
              stopAutoFlip();
            }
          });
        }, { threshold: 0.15 });
        var magSection = $('magzine') || root;
        magObserver.observe(magSection);
      } else {
        startAutoFlip();
      }

      /* ---- Step 7: Lazy-render remaining pages in background ---- */
      (async function renderRemainingPages() {
        for (var i = 3; i <= numPages; i++) {
          try {
            var url = await renderPage(i);
            if (imgElements[i - 1]) {
              imgElements[i - 1].src = url;
            }
          } catch (e) {
            console.error('Failed to lazy-load page ' + i, e);
          }
        }
      })();

    } catch (err) {
      console.error('Flipbook Error:', err);
      showFallback('Unable to load magazine preview. You can open the full PDF or view on FlipHTML5:');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
