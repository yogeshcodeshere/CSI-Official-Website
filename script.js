const btns = document.querySelectorAll(".bt");
const storeProducts = document.querySelectorAll(".store-product");
const teamDesc = document.querySelector(".team-desc");

function applyFilter(filter) {
  storeProducts.forEach((product) => {
    if (product.classList.contains(filter)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

btns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Remove active from all
    btns.forEach(b => b.classList.remove('active'));
    // Add active to clicked
    const target = e.currentTarget;
    target.classList.add('active');
    
    // Auto-scroll the clicked pill to the center on mobile
    target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    
    // Update description text
    const desc = target.getAttribute('data-desc');
    if(desc && teamDesc) {
      teamDesc.textContent = desc;
    }
    
    // Apply filter
    applyFilter(target.dataset.filter);
  });
});

// Show only the pre-selected team on load
const initialOption = document.querySelector(".team-nav li.active") || document.querySelector(".team-nav li");
if (initialOption) {
  applyFilter(initialOption.dataset.filter);
}

/* ================================================================
   CYBER TERMINAL NAVBAR LOGIC
   ================================================================ */
const mainNav = document.getElementById('main-window-nav');
const teamNavToggler = document.getElementById('teamNavToggler');
const teamNavCollapse = document.getElementById('navbarNavMain');

// 1. Dynamic frosted background on scroll
function handleNavScroll() {
  if (!mainNav) return;
  if (window.scrollY > 30) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // Run on initial load

// 2. Mobile hamburger menu toggle
if (teamNavToggler && teamNavCollapse) {
  teamNavToggler.addEventListener('click', (e) => {
    e.stopPropagation();
    const willShow = !teamNavCollapse.classList.contains('show');
    teamNavCollapse.classList.toggle('show', willShow);
    teamNavToggler.classList.toggle('collapsed', !willShow);
    teamNavToggler.setAttribute('aria-expanded', String(willShow));
    if (mainNav) mainNav.classList.toggle('has-menu-open', willShow);
  });

  // Close mobile menu when clicking any nav link
  teamNavCollapse.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      teamNavCollapse.classList.remove('show');
      teamNavToggler.classList.add('collapsed');
      teamNavToggler.setAttribute('aria-expanded', 'false');
      if (mainNav) mainNav.classList.remove('has-menu-open');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && teamNavCollapse.classList.contains('show')) {
      teamNavCollapse.classList.remove('show');
      teamNavToggler.classList.add('collapsed');
      teamNavToggler.setAttribute('aria-expanded', 'false');
      if (mainNav) mainNav.classList.remove('has-menu-open');
    }
  });
}
