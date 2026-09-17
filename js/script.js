let cartCount = 0;
const cart = [];
const wishlist = new Set();

const productGrid = document.getElementById("productGrid");
const categoryGrid = document.getElementById("categoryGrid");
const searchInput = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");
const noResults = document.getElementById("noResults");
const toast = document.getElementById("toast");

function money(value){
  return "₹" + value.toLocaleString("en-IN");
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderCategories(){
  categoryGrid.innerHTML = categories.map(c => `
    <a class="category-card" href="#new-arrivals" data-category="${c.name}">
      <img src="${c.image}" alt="${c.name}">
      <div class="category-info">
        <h3>${c.name.toUpperCase()}</h3>
        <p>${c.subtitle}<br>SHOP NOW →</p>
      </div>
    </a>
  `).join("");

  categoryGrid.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      categoryFilter.value = card.dataset.category;
      renderProducts();
    });
  });
}

function renderProducts(){
  const search = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search);
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-image">
        <span class="badge">${p.badge}</span>
        <button class="wishlist ${wishlist.has(p.id) ? "active" : ""}" data-id="${p.id}" aria-label="Wishlist">
          ${wishlist.has(p.id) ? "♥" : "♡"}
        </button>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="rating">★ ${p.rating}</div>
        <div class="product-bottom">
          <strong class="product-price">${money(p.price)}</strong>
          <button class="add-cart" data-id="${p.id}" aria-label="Add to cart">🛒</button>
        </div>
      </div>
    </article>
  `).join("");

  noResults.style.display = filtered.length ? "none" : "block";

  productGrid.querySelectorAll(".wishlist").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if(wishlist.has(id)){
        wishlist.delete(id);
        btn.classList.remove("active");
        btn.textContent = "♡";
        showToast("Removed from wishlist");
      }else{
        wishlist.add(id);
        btn.classList.add("active");
        btn.textContent = "♥";
        showToast("Added to wishlist");
      }
    });
  });

  productGrid.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = products.find(p => p.id === btn.dataset.id);
      cart.push(product);
      cartCount++;
      document.getElementById("cartCount").textContent = cartCount;
      showToast(product.name + " added to cart");
    });
  });
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

document.getElementById("searchBtn").addEventListener("click", () => {
  document.getElementById("new-arrivals").scrollIntoView({behavior:"smooth"});
  setTimeout(() => searchInput.focus(), 500);
});

document.getElementById("wishlistBtn").addEventListener("click", () => {
  if(wishlist.size === 0){
    showToast("Your wishlist is empty");
  }else{
    showToast(`${wishlist.size} item${wishlist.size > 1 ? "s" : ""} in wishlist`);
    document.getElementById("new-arrivals").scrollIntoView({behavior:"smooth"});
  }
});

document.getElementById("cartBtn").addEventListener("click", () => {
  showToast(cartCount ? `${cartCount} item${cartCount > 1 ? "s" : ""} in cart` : "Your cart is empty");
});

document.getElementById("mobileToggle").addEventListener("click", () => {
  document.getElementById("mobileNav").classList.toggle("open");
});

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", () => document.getElementById("mobileNav").classList.remove("open"));
});

document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  showToast("Thank you for joining Aaradhya Fashion!");
  document.getElementById("emailInput").value = "";
});

renderCategories();
renderProducts();
