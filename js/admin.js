/**
 * N.A.J FASHION HOUSE - ADMIN COMMAND STUDIO CONTROLLER
 * Full store management: Products, Categories, Orders, Security & Credentials
 */

document.addEventListener("DOMContentLoaded", function() {
  initAdminAuth();
});

var currentAdminTab = "overview";
var editingProductId = null;
var pickedSizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"];

/* ========================================================
   1. AUTHENTICATION & SESSION
======================================================== */
function initAdminAuth() {
  var loginWrapper = document.getElementById("admin-login-wrapper");
  var shell = document.getElementById("admin-shell");

  if (window.CatalogStore.isLoggedIn()) {
    if (loginWrapper) loginWrapper.style.display = "none";
    if (shell) shell.style.display = "flex";
    initDashboard();
  } else {
    if (loginWrapper) loginWrapper.style.display = "flex";
    if (shell) shell.style.display = "none";
  }
}

window.handleAdminLogin = function(e) {
  if (e) e.preventDefault();
  var email = document.getElementById("login-email").value.trim();
  var pass = document.getElementById("login-password").value.trim();
  var errorEl = document.getElementById("login-error-msg");

  var res = window.CatalogStore.login(email, pass);
  if (res.success) {
    if (errorEl) errorEl.style.display = "none";
    initAdminAuth();
  } else {
    if (errorEl) {
      errorEl.textContent = res.message;
      errorEl.style.display = "block";
    }
  }
};

window.handleAdminLogout = function() {
  if (confirm("আপনি কি নিশ্চিতভাবে এডমিন প্যানেল থেকে লগআউট করতে চান?")) {
    window.CatalogStore.logout();
    initAdminAuth();
  }
};

/* ========================================================
   2. DASHBOARD & TABS
======================================================== */
function initDashboard() {
  updateAdminTopPill();
  renderOverviewMetrics();
  renderProductsTable();
  renderCategoriesList();
  renderOrdersTable();
  renderSizeGuideTable();
  populateCategorySelects();
}

function updateAdminTopPill() {
  var auth = window.CatalogStore.getAuth();
  var pill = document.getElementById("admin-email-display");
  if (pill) pill.textContent = auth.email;
}

window.switchAdminTab = function(tabName) {
  currentAdminTab = tabName;

  var tabs = document.querySelectorAll(".admin-tab-btn");
  tabs.forEach(function(t) {
    if (t.getAttribute("data-tab") === tabName) {
      t.classList.add("is-active");
    } else {
      t.classList.remove("is-active");
    }
  });

  var contents = document.querySelectorAll(".admin-tab-content");
  contents.forEach(function(c) {
    if (c.id === "tab-" + tabName) {
      c.classList.add("is-active");
    } else {
      c.classList.remove("is-active");
    }
  });

  if (tabName === "overview") renderOverviewMetrics();
  if (tabName === "products") renderProductsTable();
  if (tabName === "categories") renderCategoriesList();
  if (tabName === "orders") renderOrdersTable();
  if (tabName === "sizeguide") renderSizeGuideTable();
};

/* ========================================================
   3. OVERVIEW METRICS
======================================================== */
function renderOverviewMetrics() {
  var products = window.CatalogStore.getProducts();
  var categories = window.CatalogStore.getCategories();
  var orders = window.CatalogStore.getOrders();
  var sizeGuide = window.CatalogStore.getSizeGuide ? window.CatalogStore.getSizeGuide() : [];

  var totalSales = orders.reduce(function(sum, o) {
    return sum + (o.grandTotal || 0);
  }, 0);

  var mSales = document.getElementById("metric-total-sales");
  var mOrders = document.getElementById("metric-total-orders");
  var mProducts = document.getElementById("metric-total-products");
  var mCategories = document.getElementById("metric-total-categories");

  if (mSales) mSales.textContent = "৳" + totalSales.toLocaleString();
  if (mOrders) mOrders.textContent = orders.length;
  if (mProducts) mProducts.textContent = products.length;
  if (mCategories) mCategories.textContent = categories.filter(function(c) { return c.id !== "all"; }).length;

  // Update badge counts in tabs
  var badgeP = document.getElementById("badge-count-products");
  var badgeO = document.getElementById("badge-count-orders");
  var badgeC = document.getElementById("badge-count-categories");
  var badgeSG = document.getElementById("badge-count-sizeguide");

  if (badgeP) badgeP.textContent = products.length;
  if (badgeO) badgeO.textContent = orders.length;
  if (badgeC) badgeC.textContent = categories.length - 1;
  if (badgeSG) badgeSG.textContent = sizeGuide.length;
}

/* ========================================================
   4. PRODUCTS MANAGEMENT (CRUD)
======================================================== */
function renderProductsTable() {
  var tbody = document.getElementById("products-table-body");
  if (!tbody) return;

  var products = window.CatalogStore.getProducts();
  var searchInput = document.getElementById("product-search-input");
  var catFilter = document.getElementById("product-cat-filter");

  var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  var cat = catFilter ? catFilter.value : "all";

  var filtered = products.filter(function(p) {
    var matchQuery = !query || p.title.toLowerCase().indexOf(query) > -1 || (p.bnTitle && p.bnTitle.toLowerCase().indexOf(query) > -1);
    var matchCat = cat === "all" || p.category === cat;
    return matchQuery && matchCat;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">কোনো পণ্য পাওয়া যায়নি!</td></tr>';
    return;
  }

  var html = "";
  filtered.forEach(function(p, idx) {
    var img = p.images && p.images[0] ? p.images[0] : "/assets/logo.jpg";
    var resolvedImg = window.DriveHelper ? window.DriveHelper.resolveImageUrl(img) : img;
    var sizesList = p.sizes ? p.sizes.join(", ") : "M, L, XL";

    html += 
      '<tr>' +
        '<td>' + (idx + 1) + '</td>' +
        '<td>' +
          '<div class="table-title-cell">' +
            '<img src="' + resolvedImg + '" alt="' + p.title + '" class="table-thumb" onerror="this.src=\'/assets/logo.jpg\'" />' +
            '<div>' +
              '<div>' + p.title + '</div>' +
              '<small style="color: var(--text-muted); font-size: 0.74rem;">' + (p.sku || "NAJ-SKU") + '</small>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td><span style="color: var(--admin-gold); font-weight: 600;">' + (p.categoryLabel || p.category) + '</span></td>' +
        '<td>' +
          '<strong>৳' + p.price.toLocaleString() + '</strong> ' +
          (p.comparePrice ? '<small style="text-decoration: line-through; color: var(--text-muted);">৳' + p.comparePrice + '</small>' : '') +
        '</td>' +
        '<td><span style="font-size: 0.8rem; color: #a4a4b4;">' + sizesList + '</span></td>' +
        '<td>' +
          '<span class="table-badge ' + (p.inStock ? "instock" : "outstock") + '" style="cursor: pointer;" onclick="toggleProductStock(\'' + p.id + '\')">' +
            (p.inStock ? "✓ In Stock" : "✕ Out of Stock") +
          '</span>' +
        '</td>' +
        '<td>' +
          '<div class="table-action-btns">' +
            '<button class="btn-icon-action" title="এডিট করুন (Edit)" onclick="openEditProductModal(\'' + p.id + '\')">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>' +
            '</button>' +
            '<button class="btn-icon-action delete" title="মুছে ফেলুন (Delete)" onclick="deleteProduct(\'' + p.id + '\')">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
            '</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
  });

  tbody.innerHTML = html;
}

window.toggleProductStock = function(productId) {
  var p = window.CatalogStore.getProducts().find(function(item) { return item.id === productId; });
  if (!p) return;
  window.CatalogStore.updateProduct(productId, { inStock: !p.inStock });
  renderProductsTable();
};

window.deleteProduct = function(productId) {
  if (confirm("আপনি কি নিশ্চিতভাবে এই পণ্যটি মুছে ফেলতে চান?")) {
    window.CatalogStore.deleteProduct(productId);
    renderProductsTable();
    renderOverviewMetrics();
    showAdminToast("পণ্য সফলভাবে মুছে ফেলা হয়েছে!");
  }
};

window.openAddProductModal = function() {
  editingProductId = null;
  populateCategorySelects(); // Always ensure latest categories are in the select dropdown
  var titleEl = document.getElementById("modal-product-title");
  if (titleEl) titleEl.textContent = "নতুন পোশাক / পণ্য যোগ করুন";

  document.getElementById("prod-title").value = "";
  document.getElementById("prod-bn-title").value = "";
  document.getElementById("prod-price").value = "";
  document.getElementById("prod-compare-price").value = "";
  document.getElementById("prod-badge").value = "NEW DROP";
  document.getElementById("prod-stock-count").value = "25";
  document.getElementById("prod-fabric").value = "230 GSM 100% Combed Compact Cotton";
  document.getElementById("prod-desc").value = "প্রিমিয়াম ফেব্রিক ও পারফেক্ট ফিটিংস। স্টাইল ইয়োরসেল্ফ।";
  document.getElementById("prod-img1").value = "";
  document.getElementById("prod-img2").value = "";
  document.getElementById("prod-instock").checked = true;

  pickedSizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"];
  renderSizePickers();
  updateModalImagePreview();

  var modal = document.getElementById("product-form-modal");
  if (modal) modal.classList.add("is-active");
};

window.openEditProductModal = function(productId) {
  var p = window.CatalogStore.getProducts().find(function(item) { return item.id === productId; });
  if (!p) return;

  editingProductId = productId;
  populateCategorySelects(); // Always ensure latest categories are in the select dropdown
  var titleEl = document.getElementById("modal-product-title");
  if (titleEl) titleEl.textContent = "পণ্য এডিট করুন (Edit Product)";

  document.getElementById("prod-title").value = p.title || "";
  document.getElementById("prod-bn-title").value = p.bnTitle || "";
  document.getElementById("prod-category").value = p.category || "t-shirts";
  document.getElementById("prod-price").value = p.price || "";
  document.getElementById("prod-compare-price").value = p.comparePrice || "";
  document.getElementById("prod-badge").value = p.badge || "";
  document.getElementById("prod-stock-count").value = p.stockCount || 20;
  document.getElementById("prod-fabric").value = p.fabric || "";
  document.getElementById("prod-desc").value = p.description || "";
  document.getElementById("prod-img1").value = (p.images && p.images[0]) ? p.images[0] : "";
  document.getElementById("prod-img2").value = (p.images && p.images[1]) ? p.images[1] : "";
  document.getElementById("prod-instock").checked = p.inStock !== false;

  pickedSizes = p.sizes && p.sizes.length > 0 ? p.sizes.slice() : ["M", "L", "XL", "XXL"];
  renderSizePickers();
  updateModalImagePreview();

  var modal = document.getElementById("product-form-modal");
  if (modal) modal.classList.add("is-active");
};

var previewDebounceTimer = null;

window.updateModalImagePreview = function() {
  var img1El = document.getElementById("prod-img1");
  var img2El = document.getElementById("prod-img2");
  if (!img1El) return;

  var raw1 = img1El.value.trim();
  var raw2 = img2El ? img2El.value.trim() : "";

  var img1 = raw1 || "/assets/logo.jpg";
  var img2 = raw2 || img1;

  var r1 = window.DriveHelper ? window.DriveHelper.resolveImageUrl(img1) : img1;
  var r2 = window.DriveHelper ? window.DriveHelper.resolveImageUrl(img2) : img2;

  var p1 = document.getElementById("preview-img-primary");
  var p2 = document.getElementById("preview-img-secondary");

  if (p1) {
    p1.src = r1;
    p1.onerror = function() { this.src = "/assets/logo.jpg"; };
  }
  if (p2) {
    p2.src = r2;
    p2.onerror = function() { this.src = "/assets/logo.jpg"; };
  }

  // Live validation feedback
  clearTimeout(previewDebounceTimer);
  previewDebounceTimer = setTimeout(function() {
    validateInputStatus(raw1, "img1-status-msg");
    if (raw2) {
      validateInputStatus(raw2, "img2-status-msg");
    } else {
      var s2 = document.getElementById("img2-status-msg");
      if (s2) s2.innerHTML = '<span style="color: var(--text-muted); font-size: 0.72rem;">২য় ছবি খালি থাকলে ১ম ছবিটিই প্রদর্শিত থাকবে।</span>';
    }
  }, 350);
};

function validateInputStatus(inputVal, containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  if (!inputVal) {
    el.innerHTML = "";
    return;
  }

  if (!window.DriveHelper) return;

  if (window.DriveHelper.isFolderLink(inputVal)) {
    el.innerHTML = '<span style="color: #f87171;">⚠️ এটি একটি ড্রাইভ ফোল্ডারের লিংক! ফোল্ডারের ভেতরে থাকা ছবির লিংক দিন।</span>';
    return;
  }

  el.innerHTML = '<span style="color: var(--admin-gold);">⏳ ইমেজ লিঙ্ক যাচাই করা হচ্ছে...</span>';

  window.DriveHelper.validateLinkStatus(inputVal, function(res) {
    if (res.valid) {
      var isDrive = res.resolvedUrl && res.resolvedUrl.indexOf("lh3.googleusercontent.com") > -1;
      el.innerHTML = '<span style="color: #4ade80;">✓ ' + (isDrive ? 'Google Drive ছবি ভেরিফাইড ও রেডি' : 'ছবি রেডি') + '</span>';
    } else {
      el.innerHTML = '<span style="color: #f87171;">⚠️ ' + (res.message || 'ছবি লোড করা যায়নি') + '</span>';
    }
  });
}

window.closeProductModal = function() {
  var modal = document.getElementById("product-form-modal");
  if (modal) modal.classList.remove("is-active");
};

function renderSizePickers() {
  var container = document.getElementById("size-picker-tags-box");
  if (!container) return;

  var standardSizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"];
  var html = "";

  // Combine standard and any custom picked sizes
  var allToRender = Array.from(new Set(standardSizes.concat(pickedSizes)));
  allToRender.forEach(function(s) {
    var isPicked = pickedSizes.indexOf(s) > -1;
    html += '<span class="size-picker-tag ' + (isPicked ? "is-picked" : "") + '" onclick="togglePickSize(\'' + s + '\')">' + s + '</span>';
  });

  container.innerHTML = html;
}

window.togglePickSize = function(size) {
  var idx = pickedSizes.indexOf(size);
  if (idx > -1) {
    pickedSizes.splice(idx, 1);
  } else {
    pickedSizes.push(size);
  }
  renderSizePickers();
};

window.addCustomSize = function() {
  var input = document.getElementById("custom-size-input");
  if (!input) return;
  var val = input.value.trim().toUpperCase();
  if (val && pickedSizes.indexOf(val) === -1) {
    pickedSizes.push(val);
    renderSizePickers();
    input.value = "";
  }
};

window.saveProductForm = function(e) {
  if (e) e.preventDefault();

  var title = document.getElementById("prod-title").value.trim();
  var bnTitle = document.getElementById("prod-bn-title").value.trim();
  var category = document.getElementById("prod-category").value;
  var price = parseInt(document.getElementById("prod-price").value, 10);
  var comparePrice = parseInt(document.getElementById("prod-compare-price").value, 10) || Math.round(price * 1.3);
  var badge = document.getElementById("prod-badge").value;
  var stockCount = parseInt(document.getElementById("prod-stock-count").value, 10) || 20;
  var fabric = document.getElementById("prod-fabric").value.trim();
  var desc = document.getElementById("prod-desc").value.trim();
  var img1 = document.getElementById("prod-img1").value.trim();
  var img2 = document.getElementById("prod-img2").value.trim();
  var inStock = document.getElementById("prod-instock").checked;

  if (!title) {
    alert("পণ্যের নাম লিখুন!");
    return;
  }
  if (!price || price <= 0) {
    alert("সঠিক বিক্রয় মূল্য দিন!");
    return;
  }

  // Find category label
  var catObj = window.CatalogStore.getCategories().find(function(c) { return c.id === category; });
  var catLabel = catObj ? catObj.label : category.toUpperCase();

  var images = [];
  if (img1) images.push(img1);
  if (img2) images.push(img2);
  if (images.length === 0) {
    images.push("/assets/logo.jpg");
  }

  var productData = {
    title: title,
    bnTitle: bnTitle || title,
    category: category,
    categoryLabel: catLabel,
    price: price,
    comparePrice: comparePrice,
    badge: badge,
    stockCount: stockCount,
    fabric: fabric,
    description: desc,
    images: images,
    sizes: pickedSizes.length > 0 ? pickedSizes : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: inStock
  };

  if (editingProductId) {
    window.CatalogStore.updateProduct(editingProductId, productData);
    showAdminToast("পণ্য সফলভাবে আপডেট করা হয়েছে!");
  } else {
    productData.rating = 5.0;
    productData.reviewCount = 1;
    productData.colors = [{ name: "Standard", hex: "#111111" }];
    window.CatalogStore.addProduct(productData);
    showAdminToast("নতুন পণ্য সফলভাবে যুক্ত করা হয়েছে!");
  }

  closeProductModal();
  renderProductsTable();
  renderOverviewMetrics();
};

/* ========================================================
   5. CATEGORIES MANAGEMENT
======================================================== */
function populateCategorySelects() {
  var sel = document.getElementById("prod-category");
  var filterSel = document.getElementById("product-cat-filter");
  var categories = window.CatalogStore.getCategories();

  if (sel) {
    var html = "";
    categories.forEach(function(c) {
      if (c.id === "all") return;
      html += '<option value="' + c.id + '">' + c.label + ' (' + (c.bnLabel || "") + ')</option>';
    });
    sel.innerHTML = html;
  }

  if (filterSel) {
    var fHtml = '<option value="all">সব ক্যাটেগরি (All Categories)</option>';
    categories.forEach(function(c) {
      if (c.id === "all") return;
      fHtml += '<option value="' + c.id + '">' + c.label + '</option>';
    });
    filterSel.innerHTML = fHtml;
  }
}

function renderCategoriesList() {
  var container = document.getElementById("categories-list-container");
  if (!container) return;

  var categories = window.CatalogStore.getCategories();
  var products = window.CatalogStore.getProducts();

  var html = "";
  categories.forEach(function(c) {
    if (c.id === "all") return;
    var count = products.filter(function(p) { return p.category === c.id; }).length;
    var catImg = c.image || "/assets/logo.jpg";
    var resolvedImg = window.DriveHelper ? window.DriveHelper.resolveImageUrl(catImg) : catImg;

    html += 
      '<div class="metric-card" style="justify-content: space-between;">' +
        '<div style="display: flex; align-items: center; gap: 14px;">' +
          '<img src="' + resolvedImg + '" alt="' + c.label + '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" onerror="this.src=\'/assets/logo.jpg\'" />' +
          '<div>' +
            '<div style="font-weight: 800; font-size: 1.05rem; color: #fff;">' + c.label + '</div>' +
            '<small style="color: var(--text-muted);">' + (c.bnLabel || "") + ' • ' + count + ' টি আইটেম</small>' +
          '</div>' +
        '</div>' +
        '<button class="btn-icon-action delete" title="মুছে ফেলুন" onclick="deleteCategory(\'' + c.id + '\')">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
        '</button>' +
      '</div>';
  });

  container.innerHTML = html;
}

window.addNewCategory = function(e) {
  if (e) e.preventDefault();
  var label = document.getElementById("new-cat-label").value.trim();
  var bnLabel = document.getElementById("new-cat-bn").value.trim();
  var image = document.getElementById("new-cat-img").value.trim();

  if (!label) {
    alert("ক্যাটেগরির ইংরেজি নাম দিন!");
    return;
  }

  var id = label.toLowerCase().replace(/[^a-z0-9]/g, "-");
  window.CatalogStore.addCategory({
    id: id,
    label: label.toUpperCase(),
    bnLabel: bnLabel || label,
    image: image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
  });

  document.getElementById("new-cat-label").value = "";
  document.getElementById("new-cat-bn").value = "";
  document.getElementById("new-cat-img").value = "";

  populateCategorySelects();
  renderCategoriesList();
  renderOverviewMetrics();
  showAdminToast("নতুন ক্যাটেগরি যুক্ত হয়েছে!");
};

window.deleteCategory = function(catId) {
  if (confirm("আপনি কি নিশ্চিতভাবে এই ক্যাটেগরি মুছে ফেলতে চান?")) {
    window.CatalogStore.deleteCategory(catId);
    populateCategorySelects();
    renderCategoriesList();
    renderOverviewMetrics();
    showAdminToast("ক্যাটেগরি মুছে ফেলা হয়েছে!");
  }
};

/* ========================================================
   6. CUSTOMER ORDERS MANAGEMENT
======================================================== */
function renderOrdersTable() {
  var tbody = document.getElementById("orders-table-body");
  if (!tbody) return;

  var orders = window.CatalogStore.getOrders();
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">এখনও কোনো কাস্টমার অর্ডার পাওয়া যায়নি।</td></tr>';
    return;
  }

  var html = "";
  orders.forEach(function(o, idx) {
    var itemsSummary = (o.items || []).map(function(it) {
      return it.title + " (" + it.size + ") x" + it.qty;
    }).join(", ");

    var waMsg = "আসসালামু আলাইকুম " + o.customer.name + ", N.A.J Fashion House থেকে আপনার অর্ডার #" + o.orderId + " কনফার্মেশনের জন্য যোগাযোগ করা হলো।";
    var waUrl = "https://wa.me/88" + o.customer.phone + "?text=" + encodeURIComponent(waMsg);

    html += 
      '<tr>' +
        '<td>' + (idx + 1) + '</td>' +
        '<td><strong style="color: var(--admin-gold);">' + o.orderId + '</strong><br /><small style="color: var(--text-muted);">' + o.date + '</small></td>' +
        '<td>' +
          '<strong>' + o.customer.name + '</strong><br />' +
          '<span style="font-family: monospace; color: var(--admin-gold);">' + o.customer.phone + '</span><br />' +
          '<small style="color: #aaa;">' + o.customer.address + '</small>' +
        '</td>' +
        '<td><span style="font-size: 0.82rem; color: #d0d0df;">' + itemsSummary + '</span></td>' +
        '<td><strong>৳' + o.grandTotal.toLocaleString() + '</strong><br /><small style="color: #10b981;">' + (o.paymentMethod || "COD") + '</small></td>' +
        '<td>' +
          '<select class="admin-form-select" style="padding: 4px 8px; font-size: 0.76rem;" onchange="updateOrderStatus(\'' + o.orderId + '\', this.value)">' +
            '<option value="অর্ডার কনফার্মড (Processing)" ' + (o.status && o.status.includes("Processing") ? "selected" : "") + '>কনফার্মড</option>' +
            '<option value="প্যাকেজিং সম্পন্ন (Ready)" ' + (o.status && o.status.includes("Ready") ? "selected" : "") + '>প্যাকেজিং সম্পন্ন</option>' +
            '<option value="কুরিয়ারে হস্তান্তর (Shipped)" ' + (o.status && o.status.includes("Shipped") ? "selected" : "") + '>কুরিয়ারে হস্তান্তর</option>' +
            '<option value="ডেলিভার্ড (Delivered)" ' + (o.status && o.status.includes("Delivered") ? "selected" : "") + '>ডেলিভার্ড</option>' +
            '<option value="ক্যান্সেল্ড (Cancelled)" ' + (o.status && o.status.includes("Cancelled") ? "selected" : "") + '>ক্যান্সেল্ড</option>' +
          '</select>' +
        '</td>' +
        '<td>' +
          '<div class="table-action-btns">' +
            '<a href="' + waUrl + '" target="_blank" class="btn-icon-action" style="color: #25d366;" title="কাস্টমারকে হোয়াটসঅ্যাপে মেসেজ করুন">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
            '</a>' +
            '<button class="btn-icon-action delete" title="মুছে ফেলুন" onclick="deleteOrder(\'' + o.orderId + '\')">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
            '</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
  });

  tbody.innerHTML = html;
}

window.updateOrderStatus = function(orderId, status) {
  window.CatalogStore.updateOrderStatus(orderId, status);
  showAdminToast("অর্ডার স্ট্যাটাস আপডেট হয়েছে!");
};

window.deleteOrder = function(orderId) {
  if (confirm("আপনি কি এই অর্ডারটি মুছে ফেলতে চান?")) {
    window.CatalogStore.deleteOrder(orderId);
    renderOrdersTable();
    renderOverviewMetrics();
    showAdminToast("অর্ডার মুছে ফেলা হয়েছে!");
  }
};

/* ========================================================
   7. SECURITY & CREDENTIALS UPDATE (EXACT REQUIREMENT)
   "vitore akta option thakbe, current email current pass deye
    email and pass 2 tai change kora jabe icca korle akto jabe abar 2 tai change korte parbe"
======================================================== */
window.handleUpdateCredentials = function(e) {
  if (e) e.preventDefault();

  var currentEmail = document.getElementById("cred-current-email").value;
  var currentPassword = document.getElementById("cred-current-pass").value;
  var newEmail = document.getElementById("cred-new-email").value;
  var newPassword = document.getElementById("cred-new-pass").value;
  var confirmNewPassword = document.getElementById("cred-confirm-pass").value;
  var alertEl = document.getElementById("cred-alert-box");

  if (!currentEmail || !currentPassword) {
    showAlert(alertEl, "বর্তমান ইমেইল এবং বর্তমান পাসওয়ার্ড দুটিই পূরণ করতে হবে!", "error");
    return;
  }

  // Check password confirmation if new password is given
  if (newPassword && newPassword !== confirmNewPassword) {
    showAlert(alertEl, "নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড দুটি মেলেনি!", "error");
    return;
  }

  // Call CatalogStore credential update
  var res = window.CatalogStore.updateCredentials(currentEmail, currentPassword, newEmail, newPassword);

  if (res.success) {
    showAlert(alertEl, "✅ " + res.message, "success");
    updateAdminTopPill();

    // Clear input fields for security
    document.getElementById("cred-current-email").value = "";
    document.getElementById("cred-current-pass").value = "";
    document.getElementById("cred-new-email").value = "";
    document.getElementById("cred-new-pass").value = "";
    document.getElementById("cred-confirm-pass").value = "";

    showAdminToast("ক্রেডেনশিয়াল সফলভাবে আপডেট হয়েছে!");
  } else {
    showAlert(alertEl, "❌ " + res.message, "error");
  }
};

function showAlert(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  if (type === "success") {
    el.style.background = "rgba(16, 185, 129, 0.15)";
    el.style.borderColor = "var(--admin-emerald)";
    el.style.color = "#a7f3d0";
  } else {
    el.style.background = "rgba(225, 29, 72, 0.15)";
    el.style.borderColor = "var(--admin-crimson)";
    el.style.color = "#fecdd3";
  }
}

/* ========================================================
   8. BACKUP & EXPORT
======================================================== */
window.exportStoreBackup = function() {
  var data = window.CatalogStore.exportStoreData();
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "naj-fashion-store-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showAdminToast("ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে!");
};

window.resetStoreToDefaults = function() {
  if (confirm("সতর্কতা: এটি সম্পূর্ণ স্টোরের কাস্টমাইজড ডেটা মুছে প্রাথমিক অবস্থায় ফিরিয়ে নেবে। আপনি কি নিশ্চিত?")) {
    localStorage.removeItem(window.CatalogStore.keys.PRODUCTS);
    localStorage.removeItem(window.CatalogStore.keys.CATEGORIES);
    localStorage.removeItem(window.CatalogStore.keys.SIZE_GUIDE);
    window.CatalogStore.getProducts();
    window.CatalogStore.getCategories();
    window.CatalogStore.getSizeGuide();
    initDashboard();
    showAdminToast("স্টোর প্রাথমিক অবস্থায় সফলভাবে রিসেট হয়েছে!");
  }
};

function showAdminToast(msg) {
  var toast = document.getElementById("admin-toast");
  if (!toast) return;
  toast.innerHTML = 
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--admin-emerald);"><path d="M20 6 9 17l-5-5"/></svg>' +
    '<span>' + msg + '</span>';
  toast.classList.add("is-active");
  setTimeout(function() {
    toast.classList.remove("is-active");
  }, 3200);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ========================================================
   9. SIZE GUIDE MANAGEMENT
======================================================== */
window.renderSizeGuideTable = function() {
  var tbody = document.getElementById("sizeguide-admin-table-body");
  if (!tbody) return;

  var list = window.CatalogStore.getSizeGuide();

  // Update badge
  var badgeSG = document.getElementById("badge-count-sizeguide");
  if (badgeSG) badgeSG.textContent = list.length;

  if (!list || list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">কোনো সাইজ পাওয়া যায়নি। "নতুন সাইজ যোগ করুন" বাটনে ক্লিক করুন।</td></tr>';
    return;
  }

  var html = "";
  list.forEach(function(item, idx) {
    html += '<tr data-row-idx="' + idx + '">' +
      '<td>' +
        '<input type="text" class="size-table-input size-name-input row-size-label" value="' + escapeHtml(item.size || "") + '" placeholder="যেমন: S, XL, 3XL" />' +
      '</td>' +
      '<td>' +
        '<input type="text" class="size-table-input row-size-chest" value="' + escapeHtml(item.chest || "") + '" placeholder="যেমন: 42\"" />' +
      '</td>' +
      '<td>' +
        '<input type="text" class="size-table-input row-size-length" value="' + escapeHtml(item.length || "") + '" placeholder="যেমন: 29\"" />' +
      '</td>' +
      '<td>' +
        '<input type="text" class="size-table-input row-size-shoulder" value="' + escapeHtml(item.shoulder || "") + '" placeholder="যেমন: 19.5\"" />' +
      '</td>' +
      '<td>' +
        '<input type="text" class="size-table-input row-size-sleeve" value="' + escapeHtml(item.sleeve || "") + '" placeholder="যেমন: 9.5\"" />' +
      '</td>' +
      '<td style="text-align: center;">' +
        '<button type="button" class="btn-icon-action delete" title="মুছে ফেলুন" onclick="deleteSizeRow(' + idx + ')">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
        '</button>' +
      '</td>' +
    '</tr>';
  });

  tbody.innerHTML = html;
};

window.addNewSizeRow = function() {
  var tbody = document.getElementById("sizeguide-admin-table-body");
  if (!tbody) return;

  var currentRows = getCurrentSizeRowsFromDOM();
  currentRows.push({
    size: "NEW",
    chest: '44"',
    length: '30"',
    shoulder: '20"',
    sleeve: '10"'
  });

  window.CatalogStore.saveSizeGuide(currentRows);
  renderSizeGuideTable();
  showAdminToast("নতুন সাইজ রো যোগ করা হয়েছে! নাম ও মাপ এডিট করে সেভ করুন।");
};

window.deleteSizeRow = function(idx) {
  var list = getCurrentSizeRowsFromDOM();
  if (idx < 0 || idx >= list.length) return;

  var sizeName = list[idx].size || "এই সাইজ";
  if (confirm(sizeName + " সাইজটি চার্ট থেকে মুছে ফেলতে চান?")) {
    list.splice(idx, 1);
    window.CatalogStore.saveSizeGuide(list);
    renderSizeGuideTable();
    showAdminToast(sizeName + " সাইজ চার্ট থেকে মুছে ফেলা হয়েছে!");
  }
};

window.saveAllSizeGuideRows = function() {
  var list = getCurrentSizeRowsFromDOM();
  if (list.length === 0) {
    alert("সাইজ চার্ট অন্তত একটি সাইজ থাকতে হবে!");
    return;
  }

  // Ensure every row has a size label
  for (var i = 0; i < list.length; i++) {
    if (!list[i].size || list[i].size.trim() === "") {
      alert("অনুগ্রহ করে প্রতিটি সারিতে সাইজের নাম (যেমন: S, M, L) দিন!");
      return;
    }
  }

  window.CatalogStore.saveSizeGuide(list);
  renderSizeGuideTable();
  showAdminToast("✓ সাইজ চার্টের সমস্ত মাপ সফলভাবে সেভ ও আপডেট হয়েছে!");
};

function getCurrentSizeRowsFromDOM() {
  var tbody = document.getElementById("sizeguide-admin-table-body");
  if (!tbody) return window.CatalogStore.getSizeGuide();

  var trs = tbody.querySelectorAll("tr[data-row-idx]");
  if (trs.length === 0) return window.CatalogStore.getSizeGuide();

  var result = [];
  trs.forEach(function(tr) {
    var sizeInput = tr.querySelector(".row-size-label");
    var chestInput = tr.querySelector(".row-size-chest");
    var lengthInput = tr.querySelector(".row-size-length");
    var shoulderInput = tr.querySelector(".row-size-shoulder");
    var sleeveInput = tr.querySelector(".row-size-sleeve");

    if (sizeInput) {
      result.push({
        size: sizeInput.value.trim().toUpperCase(),
        chest: chestInput ? chestInput.value.trim() : "",
        length: lengthInput ? lengthInput.value.trim() : "",
        shoulder: shoulderInput ? shoulderInput.value.trim() : "",
        sleeve: sleeveInput ? sleeveInput.value.trim() : ""
      });
    }
  });

  return result;
}

window.resetSizeGuideToDefaults = function() {
  if (confirm("আপনি কি সাইজ চার্টের মাপসমূহ প্রাথমিক স্ট্যান্ডার্ড মাপে (S থেকে 10XL) ফিরিয়ে নিতে চান?")) {
    window.CatalogStore.resetSizeGuide();
    renderSizeGuideTable();
    showAdminToast("সাইজ চার্ট সফলভাবে ডিফল্ট অবস্থায় রিসেট হয়েছে!");
  }
};
