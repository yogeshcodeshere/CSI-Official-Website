/**
 * flip-cards.js — Transforms existing team_member cards into premium flip cards.
 * Runs on DOMContentLoaded, reads existing markup, rebuilds each card with
 * front/back faces for the hover-flip animation.
 */
(function () {
  'use strict';

  // Team category labels for the back-face meta display
  const categoryLabels = {
    Faculty: 'Faculty',
    Heads: 'Core',
    App: 'Technical',
    Admin: 'Social Media',
    ML: 'Marketing',
    Social: 'Publicity',
    Design: 'Design',
    Creative: 'Creative',
    Logistic: 'Logistics',
    MG: 'Management'
  };

  // SVG icon templates (inline, no external deps)
  const icons = {
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
    flipArrow: `<svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><path d="M21 3l-7 7"/><polyline points="9 21 3 21 3 15"/><path d="M3 21l7-7"/></svg>`
  };

  /**
   * Detects team category from the wrapper div's class list.
   */
  function detectCategory(wrapperEl) {
    const cats = ['Faculty', 'Heads', 'App', 'Admin', 'ML', 'Social', 'Design', 'Creative', 'Logistic', 'MG'];
    for (const cat of cats) {
      if (wrapperEl.classList.contains(cat)) return cat;
    }
    return '';
  }

  /**
   * Extracts social links from the team_member-socials div.
   * Skips any links inside HTML comments (already excluded from DOM).
   */
  function extractSocials(socialsDiv) {
    const result = { instagram: '', linkedin: '', email: '', github: '' };
    if (!socialsDiv) return result;

    const links = socialsDiv.querySelectorAll('a[href]');
    links.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes('instagram.com')) result.instagram = href;
      else if (href.includes('linkedin.com')) result.linkedin = href;
      else if (href.startsWith('mailto:')) result.email = href;
      else if (href.includes('github.com')) result.github = href;
      // Some email links use gmail.com URL
      else if (href.includes('mail.google.com') || href.includes('gmail')) result.email = href;
    });
    return result;
  }

  /**
   * Builds a flip card DOM structure and returns it.
   */
  function buildFlipCard(data) {
    const card = document.createElement('div');
    card.className = 'flip-card';

    const inner = document.createElement('div');
    inner.className = 'flip-card-inner';

    // ---- FRONT ----
    const front = document.createElement('div');
    front.className = 'flip-card-front';

    const photoWrap = document.createElement('div');
    photoWrap.className = 'card-photo-wrap';
    const img = document.createElement('img');
    img.src = data.image;
    img.alt = data.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    photoWrap.appendChild(img);
    front.appendChild(photoWrap);

    const frontInfo = document.createElement('div');
    frontInfo.className = 'card-front-info';
    const h4Front = document.createElement('h4');
    h4Front.textContent = data.name;
    const pRole = document.createElement('p');
    pRole.className = 'card-role';
    pRole.textContent = data.position;
    frontInfo.appendChild(h4Front);
    frontInfo.appendChild(pRole);
    front.appendChild(frontInfo);

    // Flip hint icon
    const hint = document.createElement('div');
    hint.className = 'flip-hint';
    hint.innerHTML = icons.flipArrow;
    front.appendChild(hint);

    inner.appendChild(front);

    // ---- BACK ----
    const back = document.createElement('div');
    back.className = 'flip-card-back';

    const backContent = document.createElement('div');
    backContent.className = 'back-content';

    // Header
    const backHeader = document.createElement('div');
    backHeader.className = 'back-header';
    const h4Back = document.createElement('h4');
    h4Back.textContent = data.name;
    const roleBack = document.createElement('p');
    roleBack.className = 'back-role';
    roleBack.textContent = data.position;
    backHeader.appendChild(h4Back);
    backHeader.appendChild(roleBack);
    backContent.appendChild(backHeader);

    // Meta (category + year)
    const meta = document.createElement('div');
    meta.className = 'back-meta';
    const catLabel = categoryLabels[data.category] || data.category;
    meta.innerHTML = `<span>${catLabel}</span><span class="meta-dot"></span><span>2026–27</span>`;
    backContent.appendChild(meta);

    // Quote (if present)
    if (data.quote) {
      const quoteEl = document.createElement('p');
      quoteEl.className = 'back-quote';
      quoteEl.textContent = data.quote;
      backContent.appendChild(quoteEl);
    }

    // Social links
    const socials = document.createElement('div');
    socials.className = 'back-socials';

    if (data.socials.instagram) {
      const a = document.createElement('a');
      a.href = data.socials.instagram;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = 'Instagram';
      a.innerHTML = icons.instagram;
      socials.appendChild(a);
    }
    if (data.socials.linkedin) {
      const a = document.createElement('a');
      a.href = data.socials.linkedin;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = 'LinkedIn';
      a.innerHTML = icons.linkedin;
      socials.appendChild(a);
    }
    if (data.socials.email) {
      const a = document.createElement('a');
      a.href = data.socials.email;
      a.title = 'Email';
      a.innerHTML = icons.email;
      socials.appendChild(a);
    }
    if (data.socials.github) {
      const a = document.createElement('a');
      a.href = data.socials.github;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = 'GitHub';
      a.innerHTML = icons.github;
      socials.appendChild(a);
    }

    if (socials.children.length > 0) {
      backContent.appendChild(socials);
    }
    back.appendChild(backContent);
    inner.appendChild(back);

    card.appendChild(inner);
    return card;
  }

  /**
   * Main: transform all existing cards.
   */
  function transformCards() {
    const articles = document.querySelectorAll('article.team_member');

    articles.forEach(article => {
      const wrapper = article.closest('.store-product');
      if (!wrapper) return;

      const category = detectCategory(wrapper);

      // Extract data from existing markup
      const imgEl = article.querySelector('.team_member-image img');
      const infoDiv = article.querySelector('.team_member-info');
      const socialsDiv = article.querySelector('.team_member-socials');

      const name = infoDiv ? (infoDiv.querySelector('h4')?.textContent?.trim() || 'Team Member') : 'Team Member';
      const quoteEl = article.querySelector('.team_member-quote, blockquote, .back-quote');
      let quote = article.getAttribute('data-quote') || (quoteEl ? quoteEl.textContent.trim() : '');
      if (!quote && name.toLowerCase().includes('yogesh tanwar')) {
        quote = '“Throughout Heaven and Earth, I alone am the honored one”';
      }

      const data = {
        name: name,
        position: infoDiv ? (infoDiv.querySelector('p')?.textContent?.trim() || '') : '',
        quote: quote,
        image: imgEl ? imgEl.getAttribute('src') : '',
        category: category,
        socials: extractSocials(socialsDiv)
      };

      // Build new flip card
      const flipCard = buildFlipCard(data);

      // Replace old contents completely — eliminates 111 duplicate <img> tags and saves memory
      article.replaceChildren(flipCard);
    });
  }

  function setupMobileTap() {
    document.addEventListener('click', function (e) {
      // If clicking a social link on the back face, let it navigate — don't flip
      if (e.target.closest('.back-socials')) {
        return;
      }

      const card = e.target.closest('.flip-card');
      if (!card) {
        document.querySelectorAll('.flip-card.flipped').forEach(c => {
          c.classList.remove('flipped');
        });
        return;
      }

      // Only use tap-to-flip on touch/small screens (CSS handles the rest)
      // Check if hover flip is disabled (mobile CSS sets transform:none on hover)
      const isMobile = window.matchMedia('(max-width: 576px)').matches
                     || ('ontouchstart' in window);
      if (!isMobile) return;

      // Close any other open cards
      document.querySelectorAll('.flip-card.flipped').forEach(c => {
        if (c !== card) c.classList.remove('flipped');
      });
      card.classList.toggle('flipped');
    });

    // Also unflip on mouseleave to prevent getting stuck
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('mouseleave', function() {
        this.classList.remove('flipped');
      });
    });
  }

  /* ================================================================
     SEQUENTIAL 1-BY-1 AUTO-FLIP CONTROLLER FOR TEAM CARDS
     Flips one card to back, holds for viewing, flips back to OG state,
     then smoothly proceeds to the next card in sequence.
     ================================================================ */
  let autoFlipTimer = null;
  let currentCardIndex = 0;
  let activeFlippedCard = null;

  function getVisibleCards() {
    const cards = [];
    const products = document.querySelectorAll('.store-product');
    products.forEach(p => {
      // Card is visible if display is not explicitly 'none'
      if (p.style.display !== 'none') {
        const card = p.querySelector('.flip-card');
        if (card) cards.push(card);
      }
    });
    return cards;
  }

  function flipNextCard() {
    const cards = getVisibleCards();
    if (!cards.length) return;

    // Reset index if out of range (e.g. after tab filter change)
    if (currentCardIndex >= cards.length) {
      currentCardIndex = 0;
    }

    // Return any previously flipped card back to OG front state
    if (activeFlippedCard && (!activeFlippedCard.matches || !activeFlippedCard.matches(':hover'))) {
      activeFlippedCard.classList.remove('flipped');
    }

    const cardToFlip = cards[currentCardIndex];
    if (!cardToFlip) return;

    // 1. Flip this specific card to back face
    cardToFlip.classList.add('flipped');
    activeFlippedCard = cardToFlip;

    // 2. Keep flipped for 1.8 seconds, then flip back to OG state
    setTimeout(() => {
      if (cardToFlip) {
        cardToFlip.classList.remove('flipped');
      }
    }, 1800);

    // 3. Move pointer to next card
    currentCardIndex = (currentCardIndex + 1) % cards.length;
  }

  function startAutoFlip() {
    stopAutoFlip();
    // 2.4s cycle: 1.8s flipped view + 0.6s return to OG state
    autoFlipTimer = setInterval(flipNextCard, 2400);
  }

  function stopAutoFlip() {
    if (autoFlipTimer) {
      clearInterval(autoFlipTimer);
      autoFlipTimer = null;
    }
  }

  function setupAutoFlip() {
    // Start initial loop
    startAutoFlip();

    // When switching department tabs, reset to first card and restart
    document.querySelectorAll('.bt').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          currentCardIndex = 0;
          activeFlippedCard = null;
          document.querySelectorAll('.flip-card.flipped').forEach(c => c.classList.remove('flipped'));
          startAutoFlip();
        }, 60);
      });
    });

    // Pause when browser tab is hidden to save resources
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoFlip();
      } else {
        startAutoFlip();
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      transformCards();
      setupMobileTap();
      setupAutoFlip();
    });
  } else {
    transformCards();
    setupMobileTap();
    setupAutoFlip();
  }

})();
