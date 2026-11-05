// DEMO ONLY. Change these values before testing.
// This client-side password is visible to anyone who inspects the source code.
// Never use this for sensitive or production administration.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "AF2026!"; // Change this demo password.
const ADMIN_STORE_KEY = "aaradhyaFashionProductsV1";
const ALLOWED_CATEGORIES = ["Men","Women","Kids","Sports Wear","Winter Wear","Accessories","Footwear"];
let adminProducts = [];

function getAdminProducts() {
  try {
    const saved = localStorage.getItem(ADMIN_STORE_KEY);
    adminProducts = saved ? JSON.parse(saved) : [...(window.STARTER_PRODUCTS || [])];
    if (!Array.isArray(adminProducts)) adminProducts = [...(window.STARTER_PRODUCTS || [])];
  } catch (e) { adminProducts = [...(window.STARTER_PRODUCTS || [])]; }
}
function saveAdminProducts() { localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(adminProducts)); }
function safeAdminText(v) { return String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function makeId() { return "AF" + Date.now().toString().slice(-8); }
function showAdmin() {
  document.getElementById("loginView").classList.add("hidden");
  document.getElementById("adminView").classList.remove("hidden");
  renderAdminRows();
}
function renderAdminRows() {
  document.getElementById("adminProductRows").innerHTML = adminProducts.map(p=>`
    <tr><td>${safeAdminText(p.id)}</td><td>${safeAdminText(p.name)}</td><td>${safeAdminText(p.category)}</td><td>₹${Number(p.price).toLocaleString("en-IN")}</td><td>${Number(p.stock)||0}</td>
    <td><button class="small-button" data-edit="${safeAdminText(p.id)}">EDIT</button> <button class="small-button danger" data-delete="${safeAdminText(p.id)}">DELETE</button></td></tr>`).join("") || '<tr><td colspan="6">No products yet.</td></tr>';
}
function clearForm() {
  document.getElementById("productForm").reset();
  document.getElementById("editId").value="";
  document.getElementById("pStock").value="1";
  document.getElementById("formTitle").textContent="Add a product";
  document.getElementById("saveButton").textContent="SAVE PRODUCT";
}
document.addEventListener("DOMContentLoaded",()=>{
  getAdminProducts();
  document.getElementById("loginButton").addEventListener("click",()=>{
    const u=document.getElementById("adminUser").value;
    const p=document.getElementById("adminPass").value;
    if(u===ADMIN_USERNAME && p===ADMIN_PASSWORD){showAdmin();}
    else document.getElementById("loginError").textContent="Incorrect username or password.";
  });
  document.getElementById("adminPass").addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("loginButton").click();});
  document.getElementById("logoutButton").addEventListener("click",()=>location.reload());
  document.getElementById("productForm").addEventListener("submit",e=>{
    e.preventDefault();
    const id=document.getElementById("editId").value || makeId();
    const old=adminProducts.find(p=>p.id===id);
    const product={
      id,name:document.getElementById("pName").value.trim(),
      category:document.getElementById("pCategory").value,
      price:Number(document.getElementById("pPrice").value),
      originalPrice:Number(document.getElementById("pOriginal").value)||0,
      sizes:document.getElementById("pSizes").value.split(",").map(x=>x.trim()).filter(Boolean),
      colors:document.getElementById("pColors").value.split(",").map(x=>x.trim()).filter(Boolean),
      image:document.getElementById("pImage").value.trim(),
      description:document.getElementById("pDescription").value.trim(),
      stock:Number(document.getElementById("pStock").value)||0,
      tag:document.getElementById("pTag").value.trim()
    };
    if(old) adminProducts=adminProducts.map(p=>p.id===id?product:p);
    else adminProducts.unshift(product);
    saveAdminProducts();renderAdminRows();clearForm();
    document.getElementById("saveStatus").textContent="Product saved in this browser.";
  });
  document.getElementById("resetButton").addEventListener("click",clearForm);
  document.getElementById("adminProductRows").addEventListener("click",e=>{
    const edit=e.target.closest("[data-edit]")?.dataset.edit;
    const del=e.target.closest("[data-delete]")?.dataset.delete;
    if(edit){
      const p=adminProducts.find(x=>x.id===edit);if(!p)return;
      document.getElementById("editId").value=p.id;
      document.getElementById("pName").value=p.name;
      document.getElementById("pCategory").value=p.category;
      document.getElementById("pPrice").value=p.price;
      document.getElementById("pOriginal").value=p.originalPrice||"";
      document.getElementById("pSizes").value=(p.sizes||[]).join(", ");
      document.getElementById("pColors").value=(p.colors||[]).join(", ");
      document.getElementById("pImage").value=p.image||"";
      document.getElementById("pStock").value=p.stock||0;
      document.getElementById("pTag").value=p.tag||"";
      document.getElementById("pDescription").value=p.description||"";
      document.getElementById("formTitle").textContent="Edit product";
      document.getElementById("saveButton").textContent="UPDATE PRODUCT";
      window.scrollTo({top:0,behavior:"smooth"});
    }
    if(del && confirm("Delete this product?")){
      adminProducts=adminProducts.filter(p=>p.id!==del);saveAdminProducts();renderAdminRows();
    }
  });
  document.getElementById("exportButton").addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify(adminProducts,null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="aaradhya-products-backup.json";a.click();URL.revokeObjectURL(a.href);
  });
  document.getElementById("importFile").addEventListener("change",async e=>{
    const file=e.target.files[0];if(!file)return;
    try{
      const data=JSON.parse(await file.text());
      if(!Array.isArray(data)||!data.every(p=>p.id&&p.name&&p.category))throw new Error("Invalid product file");
      adminProducts=data;saveAdminProducts();renderAdminRows();
      alert("Backup imported successfully.");
    }catch(err){alert("Could not import file. Please select a valid Aaradhya product backup.");}
    e.target.value="";
  });
});