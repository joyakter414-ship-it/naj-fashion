/**
 * N.A.J FASHION HOUSE - MAIN CONTROLLER
 * Orchestrates hero slider, product grid, filters, search, wishlist & tracking.
 */

document.addEventListener("DOMContentLoaded", function() {
  initHeaderScroll();
  initTopBarMarquee();
  initHeroSlider();
  initCategories();
  initProductGrid();
  initWishlist();
  initSearch();
  initOrderTracking();

  // Listen for real-time updates from Admin Panel
  window.addEventListener("naj_products_updated", function() {
    renderProducts();
  });
  window.addEventListener("naj_categories_updated", function() {
    initCategories();
    renderProductTabs();
    renderProducts();
  });
  
  // Update cart badge initially
  if (window.CartManager) {
    window.CartManager.updateBadges();
  }
});

/* ========================================================
   1. HEADER SCROLL EFFECT (IDENTICAL TO IRON REPUBLIC)
======================================================== */
function initHeaderScroll() {
  var header = document.querySelector(".site-header");
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 28) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ========================================================
   2. TOP BAR ANNOUNCEMENT ROTATOR
======================================================== */
function initTopBarMarquee() {
  var textEl = document.getElementById("top-bar-marquee-text");
  if (!textEl || !window.STORE_CONFIG || !window.STORE_CONFIG.announcements) return;

  var announcements = window.STORE_CONFIG.announcements;
  var currentIdx = 0;

  setInterval(function() {
    currentIdx = (currentIdx + 1) % announcements.length;
    textEl.style.opacity = "0";
    setTimeout(function() {
      textEl.innerHTML = announcements[currentIdx];
      textEl.style.opacity = "1";
    }, 300);
  }, 4200);
}

/* ========================================================
   3. HERO BANNER SLIDER
======================================================== */
var currentSlideIdx = 0;
var slideInterval = null;

function initHeroSlider() {
  var slides = document.querySelectorAll(".hero-slide");
  var dots = document.querySelectorAll(".hero-dot");
  if (!slides || slides.length === 0) return;

  function showSlide(index) {
    slides.forEach(function(s) { s.classList.remove("is-active"); });
    dots.forEach(function(d) { d.classList.remove("is-active"); });

    currentSlideIdx = (index + slides.length) % slides.length;
    slides[currentSlideIdx].classList.add("is-active");
    if (dots[currentSlideIdx]) {
      dots[currentSlideIdx].classList.add("is-active");
    }
  }

  window.nextHeroSlide = function() {
    showSlide(currentSlideIdx + 1);
  };

  window.prevHeroSlide = function() {
    showSlide(currentSlideIdx - 1);
  };

  window.goToHeroSlide = function(idx) {
    showSlide(idx);
    resetTimer();
  };

  function startTimer() {
    slideInterval = setInterval(function() {
      nextHeroSlide();
    }, 5500);
  }

  function resetTimer() {
    if (slideInterval) clearInterval(slideInterval);
    startTimer();
  }

  startTimer();
}

/* ========================================================
   4. CATEGORIES RENDER
======================================================== */
function initCategories() {
  var grid = document.getElementById("categories-grid-container");
  var categories = window.CatalogStore ? window.CatalogStore.getCategories() : window.CATEGORIES_DATA;
  if (!grid || !categories) return;

  var html = "";
  categories.forEach(function(cat) {
    if (cat.id === "all") return;
    var catImg = cat.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop";
    var resolvedImg = window.DriveHelper ? window.DriveHelper.resolveImageUrl(catImg) : catImg;
    html += 
      '<div class="category-card" onclick="filterProductsByCategory(\'' + cat.id + '\')">' +
        '<img src="' + resolvedImg + '" alt="' + cat.label + '" class="category-card-bg" onerror="this.src=\'/public/assets/logo.jpg\'" />' +
        '<div class="category-card-overlay"></div>' +
        '<div class="category-card-info">' +
          '<h3 class="category-card-title">' + cat.label + '</h3>' +
          '<div class="category-card-subtitle">' +
            '<span>' + (cat.bnLabel || cat.label) + '</span>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  grid.innerHTML = html;
}

/* ========================================================
   5. PRODUCT GRID & TABS FILTERING
======================================================== */
var currentCategoryFilter = "all";
var currentSort = "featured";

function initProductGrid() {
  renderProductTabs();
  renderProducts();

  var sortSelect = document.getElementById("product-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function(e) {
      currentSort = e.target.value;
      renderProducts();
    });
  }
}

function renderProductTabs() {
  var container = document.getElementById("product-filter-tabs");
  var categories = window.CatalogStore ? window.CatalogStore.getCategories() : window.CATEGORIES_DATA;
  if (!container || !categories) return;

  var html = "";
  categories.forEach(function(cat) {
    var activeClass = cat.id === currentCategoryFilter ? "is-active" : "";
    html += '<button class="filter-tab-btn ' + activeClass + '" onclick="filterProductsByCategory(\'' + cat.id + '\')">' + cat.label + '</button>';
  });

  container.innerHTML = html;
}

window.filterProductsByCategory = function(categoryId) {
  currentCategoryFilter = categoryId;
  renderProductTabs();
  renderProducts();

  // Scroll smoothly to products section if clicked from categories grid
  var section = document.getElementById("products-section");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

function renderProducts() {
  var grid = document.getElementById("products-grid");
  var countEl = document.getElementById("products-count-badge");
  var allProducts = window.CatalogStore ? window.CatalogStore.getProducts() : window.PRODUCTS_DATA;
  if (!grid || !allProducts) return;

  var list = allProducts.slice();

  // Filter
  if (currentCategoryFilter !== "all") {
    list = list.filter(function(p) {
      return p.category === currentCategoryFilter;
    });
  }

  // Sort
  if (currentSort === "price-low") {
    list.sort(function(a, b) { return a.price - b.price; });
  } else if (currentSort === "price-high") {
    list.sort(function(a, b) { return b.price - a.price; });
  } else if (currentSort === "rating") {
    list.sort(function(a, b) { return b.rating - a.rating; });
  }

  if (countEl) {
    countEl.textContent = list.length + " ITEMS";
  }

  var html = "";
  var wishlistItems = getWishlist();

  list.forEach(function(p) {
    var img1 = p.images && p.images[0] ? p.images[0] : "/public/assets/logo.jpg";
    var img2 = p.images && p.images[1] ? p.images[1] : img1;

    var resolvedImg1 = window.DriveHelper ? window.DriveHelper.resolveImageUrl(img1) : img1;
    var resolvedImg2 = window.DriveHelper ? window.DriveHelper.resolveImageUrl(img2) : img2;

    var isSaved = wishlistItems.indexOf(p.id) > -1;
    var defaultSize = p.sizes && p.sizes.length > 0 ? p.sizes[0] : "M";

    // Size chips
    var sizeChipsHtml = "";
    (p.sizes || []).forEach(function(s, idx) {
      sizeChipsHtml += '<span class="size-chip ' + (idx === 0 ? "is-selected" : "") + '" onclick="event.stopPropagation(); QuickViewManager.openModal(\'' + p.id + '\')">' + s + '</span>';
    });

    html += 
      '<div class="product-card" data-product-id="' + p.id + '">' +
        '<div class="product-media" onclick="QuickViewManager.openModal(\'' + p.id + '\')">' +
          '<img src="' + resolvedImg1 + '" alt="' + p.title + '" class="product-img img-primary" loading="lazy" onerror="this.src=\'/public/assets/logo.jpg\'" />' +
          '<img src="' + resolvedImg2 + '" alt="' + p.title + '" class="product-img img-secondary" loading="lazy" onerror="this.src=\'/public/assets/logo.jpg\'" />' +
          '<div class="card-badges-wrapper">' +
            (p.badge ? '<span class="badge badge-gold">' + p.badge + '</span>' : '') +
            (p.comparePrice > p.price ? '<span class="card-save-badge">SAVE ৳' + (p.comparePrice - p.price) + '</span>' : '') +
          '</div>' +
          '<button class="card-wishlist-btn ' + (isSaved ? "is-active" : "") + '" title="Wishlist" onclick="event.stopPropagation(); toggleWishlist(\'' + p.id + '\', this)">' +
            '<svg viewBox="0 0 24 24" fill="' + (isSaved ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' +
          '</button>' +
          '<div class="card-actions-bar">' +
            '<button class="card-quick-order-btn" onclick="event.stopPropagation(); quickOrder(\'' + p.id + '\')">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
              '<span>অর্ডার করুন (Order Now)</span>' +
            '</button>' +
            '<button class="card-view-btn" title="Quick View" onclick="event.stopPropagation(); QuickViewManager.openModal(\'' + p.id + '\')">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="product-content">' +
          '<span class="product-category-tag">' + p.categoryLabel + '</span>' +
          '<h3 class="product-title" onclick="QuickViewManager.openModal(\'' + p.id + '\')">' + p.title + '</h3>' +
          '<div class="product-rating-row">' +
            '<div class="product-stars">' +
              '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
              '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
              '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
              '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
              '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
            '</div>' +
            '<span class="product-rating-count">(' + p.reviewCount + ')</span>' +
          '</div>' +
          '<div class="product-price-row">' +
            '<span class="current-price">৳' + p.price.toLocaleString() + '</span>' +
            '<span class="compare-price">৳' + p.comparePrice.toLocaleString() + '</span>' +
          '</div>' +
          '<div class="card-sizes-row">' + sizeChipsHtml + '</div>' +
        '</div>' +
      '</div>';
  });

  grid.innerHTML = html;
}

window.quickOrder = function(productId) {
  var allProducts = window.CatalogStore ? window.CatalogStore.getProducts() : window.PRODUCTS_DATA;
  var p = (allProducts || []).find(function(item) { return item.id === productId; });
  if (!p) return;
  var orderItem = {
    itemId: p.id + "_M_quick",
    productId: p.id,
    title: p.title,
    price: p.price,
    comparePrice: p.comparePrice,
    image: p.images && p.images[0] ? p.images[0] : "",
    size: p.sizes && p.sizes.length > 0 ? p.sizes[0] : "M",
    color: p.colors && p.colors.length > 0 ? p.colors[0].name : "Standard",
    qty: 1
  };
  window.CheckoutManager.openCheckoutModal([orderItem]);
};

/* ========================================================
   6. WISHLIST MANAGEMENT
======================================================== */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("naj_wishlist") || "[]");
  } catch (e) {
    return [];
  }
}

function updateWishlistBadge() {
  var list = getWishlist();
  var badges = document.querySelectorAll(".wishlist-badge-count");
  badges.forEach(function(b) {
    b.textContent = list.length;
    b.style.display = list.length > 0 ? "flex" : "none";
  });
}

window.toggleWishlist = function(productId, btnEl) {
  var list = getWishlist();
  var idx = list.indexOf(productId);
  if (idx > -1) {
    list.splice(idx, 1);
    if (btnEl) {
      btnEl.classList.remove("is-active");
      var svg = btnEl.querySelector("svg");
      if (svg) svg.setAttribute("fill", "none");
    }
    window.CartManager.showToast("উইশলিস্ট থেকে সরানো হয়েছে");
  } else {
    list.push(productId);
    if (btnEl) {
      btnEl.classList.add("is-active");
      var svg = btnEl.querySelector("svg");
      if (svg) svg.setAttribute("fill", "currentColor");
    }
    window.CartManager.showToast("উইশলিস্টে যোগ করা হয়েছে!");
  }
  localStorage.setItem("naj_wishlist", JSON.stringify(list));
  updateWishlistBadge();
};

function initWishlist() {
  updateWishlistBadge();
}

/* ========================================================
   7. LIVE SEARCH MODAL
======================================================== */
function initSearch() {
  var input = document.getElementById("search-input");
  var resultsContainer = document.getElementById("search-results-list");
  if (!input || !resultsContainer) return;

  input.addEventListener("input", function(e) {
    var q = e.target.value.toLowerCase().trim();
    if (!q) {
      resultsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">পোশাকের নাম লিখে সার্চ করুন (যেমন: Oversized, Cargo, Hoodie, Panjabi)...</p>';
      return;
    }

    var allProducts = window.CatalogStore ? window.CatalogStore.getProducts() : window.PRODUCTS_DATA;
    var matches = (allProducts || []).filter(function(p) {
      return p.title.toLowerCase().indexOf(q) > -1 ||
             (p.bnTitle && p.bnTitle.toLowerCase().indexOf(q) > -1) ||
             (p.categoryLabel && p.categoryLabel.toLowerCase().indexOf(q) > -1) ||
             (p.category && p.category.toLowerCase().indexOf(q) > -1);
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">কোনো ফলাফল পাওয়া যায়নি!</p>';
      return;
    }

    var html = "";
    matches.forEach(function(p) {
      var img = p.images && p.images[0] ? p.images[0] : "";
      var resolved = window.DriveHelper ? window.DriveHelper.resolveImageUrl(img) : img;
      html += 
        '<div class="search-result-item" onclick="closeSearchModal(); QuickViewManager.openModal(\'' + p.id + '\')">' +
          '<img src="' + resolved + '" alt="' + p.title + '" onerror="this.src=\'/public/assets/logo.jpg\'" />' +
          '<div>' +
            '<div style="font-weight: 700; font-size: 0.95rem; color: #fff;">' + p.title + '</div>' +
            '<div style="font-size: 0.78rem; color: var(--gold-light); font-weight: 700;">৳' + p.price.toLocaleString() + ' • ' + p.categoryLabel + '</div>' +
          '</div>' +
        '</div>';
    });

    resultsContainer.innerHTML = html;
  });
}

window.openSearchModal = function() {
  var modal = document.getElementById("search-modal");
  if (modal) {
    modal.classList.add("is-active");
    var input = document.getElementById("search-input");
    if (input) setTimeout(function() { input.focus(); }, 100);
  }
};

window.closeSearchModal = function() {
  var modal = document.getElementById("search-modal");
  if (modal) modal.classList.remove("is-active");
};

/* ========================================================
   8. ORDER TRACKING MODAL
======================================================== */
function initOrderTracking() {}

window.openTrackModal = function() {
  var modal = document.getElementById("tracking-modal");
  if (modal) modal.classList.add("is-active");
};

window.closeTrackModal = function() {
  var modal = document.getElementById("tracking-modal");
  if (modal) modal.classList.remove("is-active");
};

window.searchOrderStatus = function(e) {
  if (e) e.preventDefault();
  var input = document.getElementById("track-input");
  var output = document.getElementById("track-result-box");
  if (!input || !output) return;

  var query = input.value.trim().toUpperCase();
  if (!query) return;

  var orders = [];
  try {
    orders = JSON.parse(localStorage.getItem("naj_customer_orders") || "[]");
  } catch (err) {}

  var found = orders.find(function(o) {
    return o.orderId.toUpperCase() === query || o.customer.phone === query;
  });

  if (found) {
    output.style.display = "block";
    output.innerHTML = 
      '<div style="padding: 16px; background: var(--bg-card); border: 1px solid var(--gold-border); border-radius: 6px;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
          '<strong style="color: var(--gold-light); font-size: 1.05rem;">অর্ডার #' + found.orderId + '</strong>' +
          '<span class="badge badge-emerald">' + found.status + '</span>' +
        '</div>' +
        '<p style="font-size: 0.82rem; margin-bottom: 4px;">অর্ডারের তারিখ: ' + found.date + '</p>' +
        '<p style="font-size: 0.82rem; margin-bottom: 8px;">ডেলিভারি ঠিকানা: ' + found.customer.address + '</p>' +
        '<div style="font-weight: 700; color: #fff;">মোট মূল্য: ৳' + found.grandTotal.toLocaleString() + ' (' + found.paymentMethod + ')</div>' +
      '</div>';
  } else {
    output.style.display = "block";
    output.innerHTML = 
      '<div style="padding: 16px; background: rgba(225, 29, 72, 0.1); border: 1px solid var(--accent-crimson); border-radius: 6px; color: #ffb3c0; font-size: 0.88rem;">' +
        'কোনো সক্রিয় অর্ডার পাওয়া যায়নি। সঠিক অর্ডার আইডি (যেমন: NAJ-2026-XXXXX) অথবা অর্ডার করার ১১ ডিজিটের মোবাইল নম্বর দিন।' +
      '</div>';
  }
};

/* ========================================================
   9. MOBILE DRAWER TOGGLE
======================================================== */
window.toggleMobileDrawer = function(open) {
  var overlay = document.getElementById("mobile-drawer-overlay");
  var drawer = document.getElementById("mobile-drawer");
  if (open) {
    if (overlay) overlay.classList.add("is-active");
    if (drawer) drawer.classList.add("is-active");
    document.body.style.overflow = "hidden";
  } else {
    if (overlay) overlay.classList.remove("is-active");
    if (drawer) drawer.classList.remove("is-active");
    document.body.style.overflow = "";
  }
};
