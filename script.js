const btns = document.querySelectorAll(".bt");
const storeProducts = document.querySelectorAll(".store-product");
const teamDesc = document.querySelector(".team-desc");

function applyFilter(filter) {
  storeProducts.forEach((product) => {
    if (product.classList.contains(filter)) {
      product.style.display = "block";
      // Images start out lazy so hidden teams are never downloaded. Chrome will
      // not fetch a lazy image that began inside a display:none card, so switch
      // it to eager once the card is actually shown.
      product.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        img.loading = "eager";
      });
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
