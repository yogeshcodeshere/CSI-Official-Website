const btns = document.querySelectorAll(".bt");
const storeProducts = document.querySelectorAll(".store-product");

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

for (i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter(e.target.dataset.filter);
    });
  }

// Show only the pre-selected team on load; without this every team renders at once
const initialOption = document.querySelector(".menu li.active") || document.querySelector(".menu li");
if (initialOption) {
  applyFilter(initialOption.dataset.filter);
}

const dropdowns=document.querySelectorAll('.team');
// Loop through all dropdown elements
dropdowns.forEach(dropdown => {
 // Get inner elements from each dropdown
  const select=dropdown.querySelector('.select');
  const caret=dropdown.querySelector('.caret');
  const menu=dropdown.querySelector('.menu');
  const options=dropdown.querySelectorAll('.menu li');
  const selected=dropdown.querySelector('.selected');
  select.addEventListener('click',()=>{
    // Add the clicked select styles to the select element
    select.classList.toggle('select-clicked');
    // Add the rotate styles to the caret element
    caret.classList.toggle('caret-rotate');
    // Add the open styles to the menu element
    menu.classList.toggle('menu-open');
   });

   options.forEach(option=>{
    // Addaclick event to the option element
    option.addEventListener('click',() => {
       // Change selected inner text to clicked option inner text
       selected.innerText=option.innerText;
      // Add the clicked select styles to the select element
       select.classList.remove('select-clicked');
      // Add the rotate styles to the caret element
       caret.classList.remove('caret-rotate');
        menu.classList.remove('menu-open');
        // Remove active class from all option elements
        options.forEach(option => {
          option.classList.remove('active');
        });
        // Add active class to clicked option element
        option.classList.add('active');
      });
    });
  });
