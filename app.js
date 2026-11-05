// Aaradhya Fashion storefront. Data is stored locally in this browser.
const STORE_KEY = "aaradhyaFashionProductsV1";
const WHATSAPP_NUMBER = "918931911428"; // Change to your WhatsApp number with country code.
let products = [];
let activeProduct = null;

function loadStoreProducts() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    products = saved ? JSON.parse(saved) : [...(window.STARTER_PRODUCTS || [])];
    if (!Array.isArray(products)) products = [...(window.STARTER_PRODUCTS || [])];
  } catch (e) {
    products = [...(window.STARTER_PRODUCTS || [])];
  }
}
function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}
function escapeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function safeImage(value) {
  const s = String(value || "");
  return /^(https:\/\/|assets\/)/i.test(s) ? escapeText(s) : "https://placehold.co/600x800/f1f0ed/10243b?text=Aaradhya+Fashion";
}
function renderStore() {
  const query = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const category = document.getElementById("categoryFilter")?.value || "All";
  const sort = document.getElementById("sortFilter")?.value || "featured";
  let list = products.filter(p => Number(p.stock) > 0 && (category === "All" || p.category === category));
  list = list.filter(p => [p.name,p.category,p.description,...(p.colors||[])].join(" ").toLowerCase().includes(query));
  if (sort === "low") list.sort((a,b)=>Number(a.price)-Number(b.price));
  if (sort === "high") list.sort((a,b)=>Number(b.price)-Number(a.price));
  if (sort === "new") list.reverse();
  document.getElementById("productCount").textContent = `${list.length} PRODUCTS`;
  const grid = document.getElementById("productGrid");
  document.getElementById("emptyState").classList.toggle("hidden", list.length !== 0);
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image-wrap" data-open="${escapeText(p.id)}">
        <img src="${safeImage(p.image)}" alt="${escapeText(p.name)}" loading="lazy">
        ${p.tag ? `<span class="product-tag">${escapeText(p.tag)}</span>` : ""}
      </div>
      <div class="product-info">
        <span class="product-category">${escapeText(p.category)}</span>
        <h3>${escapeText(p.name)}</h3>
        <div class="product-price">${money(p.price)} ${Number(p.originalPrice)>Number(p.price)?`<span class="old-price">${money(p.originalPrice)}</span>`:""}</div>
        <div class="product-actions">
          <button class="small-button" data-open="${escapeText(p.id)}">VIEW DETAILS</button>
          <button class="small-button primary" data-order="${escapeText(p.id)}">ORDER ↗</button>
        </div>
      </div>
    </article>`).join("");
}
function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  activeProduct = p;
  const dialog = document.getElementById("productDialog");
  document.getElementById("dialogContent").innerHTML = `
    <div class="dialog-layout">
      <img src="${safeImage(p.image)}" alt="${escapeText(p.name)}">
      <div class="dialog-details">
        <span class="product-category">${escapeText(p.category)}</span>
        <h2>${escapeText(p.name)}</h2>
        <div class="product-price">${money(p.price)} ${Number(p.originalPrice)>Number(p.price)?`<span class="old-price">${money(p.originalPrice)}</span>`:""}</div>
        <p>${escapeText(p.description)}</p>
        <label for="sizeChoice">Choose size</label>
        <select id="sizeChoice">${(p.sizes||["Please confirm"]).map(s=>`<option>${escapeText(s)}</option>`).join("")}</select>
        <label for="colorChoice">Choose colour</label>
        <select id="colorChoice">${(p.colors||["Please confirm"]).map(c=>`<option>${escapeText(c)}</option>`).join("")}</select>
        <p>Availability: ${Number(p.stock)>0?"In stock":"Out of stock"}</p>
        <button class="button button-navy" id="dialogOrder">ORDER ON WHATSAPP ↗</button>
      </div>
    </div>`;
  dialog.showModal();
  document.getElementById("dialogOrder").addEventListener("click", () => orderProduct(p.id, document.getElementById("sizeChoice").value, document.getElementById("colorChoice").value));
}
function orderProduct(id, size="Please confirm", color="Please confirm") {
  const p = products.find(x=>x.id===id);
  if (!p) return;
  const msg = `Hello Aaradhya Fashion! I am interested in this product:\nProduct: ${p.name}\nProduct ID: ${p.id}\nPrice: ${money(p.price)}\nSize: ${size}\nColour: ${color}\nPlease confirm availability.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}
document.addEventListener("DOMContentLoaded", () => {
  loadStoreProducts();
  renderStore();
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("searchInput").addEventListener("input", renderStore);
  document.getElementById("categoryFilter").addEventListener("change", renderStore);
  document.getElementById("sortFilter").addEventListener("change", renderStore);
  document.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{
    document.getElementById("categoryFilter").value=btn.dataset.category;
    renderStore(); document.getElementById("shop").scrollIntoView({behavior:"smooth"});
  }));
  document.getElementById("productGrid").addEventListener("click", e=>{
    const open = e.target.closest("[data-open]");
    const order = e.target.closest("[data-order]");
    if (open) openProduct(open.dataset.open);
    if (order) orderProduct(order.dataset.order);
  });
  document.getElementById("dialogClose").addEventListener("click",()=>document.getElementById("productDialog").close());
  document.getElementById("productDialog").addEventListener("click",e=>{if(e.target.id==="productDialog")e.target.close();});
  document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
});