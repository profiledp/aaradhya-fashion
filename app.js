const STORE_KEY = "aaradhyaFashionProductsV1";
const CART_KEY = "aaradhyaFashionCartV1";
const WHATSAPP_NUMBER = "918931911428";
let products = [];
let cart = [];

function cloneDeep(obj) { return JSON.parse(JSON.stringify(obj)); }

function loadStoreProducts() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    products = saved ? JSON.parse(saved) : cloneDeep(window.STARTER_PRODUCTS || []);
    if (!Array.isArray(products)) products = cloneDeep(window.STARTER_PRODUCTS || []);
  } catch (e) { products = cloneDeep(window.STARTER_PRODUCTS || []); }
}

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    cart = saved ? JSON.parse(saved) : [];
  } catch (e) { cart = []; }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartBtn = document.getElementById("stickyCart");
  const cartCount = document.getElementById("cartCount");
  if (cart.length > 0) {
    cartBtn.style.display = "flex";
    cartCount.textContent = cart.length;
  } else {
    cartBtn.style.display = "none";
  }
}

function money(value) { return "₹" + Number(value || 0).toLocaleString("en-IN"); }

function escapeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function safeImage(value) {
  const s = String(value || "").trim();
  if (/^https:\/\//i.test(s)) return escapeText(s);
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return "https://placehold.co/600x800/f1f0ed/10243b?text=AF";
  if (s) return escapeText(s);
  return "https://placehold.co/600x800/f1f0ed/10243b?text=AF";
}

function renderStore() {
  const query = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const category = document.getElementById("categoryFilter")?.value || "All";
  const sort = document.getElementById("sortFilter")?.value || "featured";

  let list = products.filter(p => Number(p.stock) > 0 && (category === "All" || p.category === category));
  list = list.filter(p => [p.name, p.category, ...(p.colors || []), ...(p.sizes || [])].join(" ").toLowerCase().includes(query));

  if (sort === "low") list.sort((a,b) => Number(a.price) - Number(b.price));
  if (sort === "high") list.sort((a,b) => Number(b.price) - Number(a.price));
  if (sort === "new") list.reverse();

  document.getElementById("productCount").textContent = `${list.length} PRODUCTS`;
  const grid = document.getElementById("productGrid");
  document.getElementById("emptyState").classList.toggle("hidden", list.length !== 0);

  grid.innerHTML = list.map(p => {
    let urgency = "";
    if (Number(p.stock) > 0 && Number(p.stock) <= 3) {
      urgency = `<span class="urgency-tag">Only ${p.stock} left!</span>`;
    }

    return `
    <article class="product-card">
      <div class="product-image-wrap" data-open="${escapeText(p.id)}">
        <img src="${safeImage(p.image)}" alt="${escapeText(p.name)}" loading="lazy">
        ${p.tag ? `<span class="product-tag">${escapeText(p.tag)}</span>` : ""}
        ${urgency}
      </div>
      <div class="product-info">
        <span class="product-category">${escapeText(p.category)}</span>
        <h3 data-open="${escapeText(p.id)}">${escapeText(p.name)}</h3>
        <div class="product-price">${money(p.price)} ${Number(p.originalPrice) > Number(p.price) ? `<span class="old-price">${money(p.originalPrice)}</span>` : ""}</div>
        
        <div class="inline-variants">
          <select class="inline-size" id="size-${escapeText(p.id)}" aria-label="Select size">
            ${(p.sizes || ["Free"]).map(s => `<option value="${escapeText(s)}">${escapeText(s)}</option>`).join("")}
          </select>
          <select class="inline-color" id="color-${escapeText(p.id)}" aria-label="Select colour">
            ${(p.colors || ["Default"]).map(c => `<option value="${escapeText(c)}">${escapeText(c)}</option>`).join("")}
          </select>
        </div>

        <div class="product-actions">
          <button class="small-button" data-open="${escapeText(p.id)}">Details</button>
          <button class="small-button primary" data-add="${escapeText(p.id)}">Add to Cart</button>
        </div>
      </div>
    </article>`;
  }).join("");
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  
  const size = document.getElementById(`size-${id}`).value;
  const color = document.getElementById(`color-${id}`).value;
  
  const existing = cart.find(item => item.id === id && item.size === size && item.color === color);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name: p.name, price: p.price, size, color, qty: 1 });
  }
  saveCart();
  
  const btn = document.querySelector(`[data-add="${id}"]`);
  if(btn) {
    btn.textContent = "Added ✓";
    btn.style.background = "#39704c";
    setTimeout(() => {
      btn.textContent = "Add to Cart";
      btn.style.background = "";
    }, 1500);
  }
}

function checkoutCart() {
  if (cart.length === 0) return;
  
  let msg = `Hello Aaradhya Fashion!\nI would like to order the following items:\n\n`;
  let total = 0;
  
  cart.forEach((item, index) => {
    msg += `${index + 1}. ${item.name}\n   Size: ${item.size} | Colour: ${item.color}\n   Qty: ${item.qty} | Price: ₹${item.price}\n\n`;
    total += (item.price * item.qty);
  });
  
  msg += `Total Amount: ₹${total}\n\nPlease confirm my order and share payment details.`;
  
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  
  const dialog = document.getElementById("productDialog");
  document.getElementById("dialogContent").innerHTML = `
    <div class="dialog-layout">
      <img src="${safeImage(p.image)}" alt="${escapeText(p.name)}">
      <div class="dialog-details">
        <span class="product-category">${escapeText(p.category)}</span>
        <h2>${escapeText(p.name)}</h2>
        <div class="product-price" style="font-size:20px;">${money(p.price)} ${Number(p.originalPrice) > Number(p.price) ? `<span class="old-price">${money(p.originalPrice)}</span>` : ""}</div>
        <p style="margin:15px 0;">${escapeText(p.description)}</p>
        
        <label style="font-size:11px;font-weight:bold;">Size</label>
        <select id="sizeChoice">${(p.sizes || ["Free Size"]).map(s => `<option>${escapeText(s)}</option>`).join("")}</select>
        
        <label style="font-size:11px;font-weight:bold;">Colour</label>
        <select id="colorChoice">${(p.colors || ["Default"]).map(c => `<option>${escapeText(c)}</option>`).join("")}</select>
        
        <button class="button button-navy" id="dialogAdd">ADD TO CART</button>
      </div>
    </div>`;
  
  dialog.showModal();
  
  document.getElementById("dialogAdd").addEventListener("click", () => {
    const size = document.getElementById("sizeChoice").value;
    const color = document.getElementById("colorChoice").value;
    
    const existing = cart.find(item => item.id === p.id && item.size === size && item.color === color);
    if (existing) { existing.qty += 1; } else { cart.push({ id: p.id, name: p.name, price: p.price, size, color, qty: 1 }); }
    saveCart();
    dialog.close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadStoreProducts();
  loadCart();
  renderStore();
  updateCartUI();
  
  document.getElementById("year").textContent = new Date().getFullYear();

  document.getElementById("searchInput").addEventListener("input", renderStore);
  document.getElementById("categoryFilter").addEventListener("change", renderStore);
  document.getElementById("sortFilter").addEventListener("change", renderStore);

  document.querySelectorAll("[data-category]").forEach(btn => btn.addEventListener("click", () => {
    document.getElementById("categoryFilter").value = btn.dataset.category;
    renderStore();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  }));

  document.getElementById("productGrid").addEventListener("click", e => {
    const open = e.target.closest("[data-open]");
    const add = e.target.closest("[data-add]");
    if (open) openProduct(open.dataset.open);
    if (add) addToCart(add.dataset.add);
  });

  document.getElementById("dialogClose").addEventListener("click", () => document.getElementById("productDialog").close());
  document.getElementById("productDialog").addEventListener("click", e => {
    if (e.target.id === "productDialog") e.target.close();
  });

  document.getElementById("checkoutCartBtn").addEventListener("click", checkoutCart);

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
});
