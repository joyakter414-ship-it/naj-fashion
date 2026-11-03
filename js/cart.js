/**
 * N.A.J FASHION HOUSE - CART MANAGEMENT
 * Handles local storage persistence, drawer UI, quantity controls, and free shipping progress.
 */

window.CartManager = {
  storageKey: "naj_fashion_cart_v1",

  getItems: function() {
    try {
      var raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveItems: function(items) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (e) {}
    this.updateBadges();
    this.renderCartUI();
  },

  addItem: function(product, size, color, qty) {
    qty = qty || 1;
    var items = this.getItems();
    var itemId = product.id + "_" + (size || "M") + "_" + (color ? color.name : "Default");
    
    var existingIndex = items.findIndex(function(it) {
      return it.itemId === itemId;
    });

    if (existingIndex > -1) {
      items[existingIndex].qty += qty;
    } else {
      items.push({
        itemId: itemId,
        productId: product.id,
        title: product.title,
        price: product.price,
        comparePrice: product.comparePrice,
        image: product.images && product.images[0] ? product.images[0] : "",
        size: size || "M",
        color: color ? color.name : "Standard",
        qty: qty
      });
    }

    this.saveItems(items);
    this.showToast("Shopping bag-এ যোগ করা হয়েছে! (Added to Bag)");
    this.openDrawer();
  },

  updateQty: function(itemId, delta) {
    var items = this.getItems();
    var item = items.find(function(it) { return it.itemId === itemId; });
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      items = items.filter(function(it) { return it.itemId !== itemId; });
    }

    this.saveItems(items);
  },

  removeItem: function(itemId) {
    var items = this.getItems().filter(function(it) { return it.itemId !== itemId; });
    this.saveItems(items);
  },

  clearCart: function() {
    this.saveItems([]);
  },

  getSubtotal: function() {
    var items = this.getItems();
    return items.reduce(function(sum, it) {
      return sum + (it.price * it.qty);
    }, 0);
  },

  getItemCount: function() {
    var items = this.getItems();
    return items.reduce(function(sum, it) {
      return sum + it.qty;
    }, 0);
  },

  updateBadges: function() {
    var count = this.getItemCount();
    var badges = document.querySelectorAll(".cart-badge-count");
    badges.forEach(function(badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    });
  },

  renderCartUI: function() {
    var items = this.getItems();
    var subtotal = this.getSubtotal();
    var body = document.getElementById("cart-drawer-body");
    var subtotalEl = document.getElementById("cart-subtotal-val");
    var meterNotice = document.getElementById("cart-meter-notice");
    var meterFill = document.getElementById("cart-meter-fill");
    var checkoutBtn = document.getElementById("cart-checkout-btn");

    if (!body) return;

    if (items.length === 0) {
      body.innerHTML = 
        '<div class="cart-empty-view">' +
          '<div class="empty-cart-icon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
          '</div>' +
          '<h3 class="cart-empty-title">আপনার ব্যাগ খালি!</h3>' +
          '<p style="color: var(--text-muted); margin-bottom: 24px;">আপনি এখনও কোনো পছন্দের পোশাক ব্যাগে যোগ করেননি।</p>' +
          '<button class="btn btn-gold btn-block" onclick="CartManager.closeDrawer(); window.location.hash=\'#products-section\';">কালেকশন দেখুন</button>' +
        '</div>';
      
      if (subtotalEl) subtotalEl.textContent = "৳0";
      if (meterNotice) meterNotice.innerHTML = "ফ্রি ডেলিভারির জন্য <strong>৳২,৫০০</strong> বা তার বেশি অর্ডার করুন";
      if (meterFill) meterFill.style.width = "0%";
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    // Render Items
    var html = "";
    items.forEach(function(it) {
      var resolvedImg = window.DriveHelper ? window.DriveHelper.resolveImageUrl(it.image) : it.image;
      html += 
        '<div class="cart-item-card" data-item-id="' + it.itemId + '">' +
          '<img src="' + resolvedImg + '" alt="' + it.title + '" class="cart-item-img" onerror="this.src=\'/public/assets/logo.jpg\'" />' +
          '<div class="cart-item-details">' +
            '<div>' +
              '<div class="cart-item-title">' + it.title + '</div>' +
              '<div class="cart-item-meta">' +
                '<span>Size: ' + it.size + '</span>' +
                '<span>•</span>' +
                '<span>' + it.color + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="cart-qty-row">' +
              '<div class="qty-stepper">' +
                '<button class="qty-btn" onclick="CartManager.updateQty(\'' + it.itemId + '\', -1)">−</button>' +
                '<span class="qty-input">' + it.qty + '</span>' +
                '<button class="qty-btn" onclick="CartManager.updateQty(\'' + it.itemId + '\', 1)">+</button>' +
              '</div>' +
              '<div class="cart-item-price">৳' + (it.price * it.qty).toLocaleString() + '</div>' +
            '</div>' +
          '</div>' +
          '<button class="cart-item-remove-btn" title="মুছে ফেলুন" onclick="CartManager.removeItem(\'' + it.itemId + '\')">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
          '</button>' +
        '</div>';
    });

    body.innerHTML = html;

    if (subtotalEl) {
      subtotalEl.textContent = "৳" + subtotal.toLocaleString();
    }

    // Free delivery meter logic
    var threshold = window.STORE_CONFIG ? window.STORE_CONFIG.shipping.freeShippingThreshold : 2500;
    if (meterNotice && meterFill) {
      if (subtotal >= threshold) {
        meterNotice.innerHTML = "🎉 অভিনন্দন! আপনি পাচ্ছেন <strong>সারা বাংলাদেশে ফ্রি ডেলিভারি</strong>!";
        meterFill.style.width = "100%";
      } else {
        var needed = threshold - subtotal;
        var pct = Math.min(100, Math.round((subtotal / threshold) * 100));
        meterNotice.innerHTML = "ফ্রি ডেলিভারির জন্য আর মাত্র <strong>৳" + needed.toLocaleString() + "</strong> টাকার পণ্য যোগ করুন!";
        meterFill.style.width = pct + "%";
      }
    }
  },

  openDrawer: function() {
    var overlay = document.getElementById("cart-drawer-overlay");
    var drawer = document.getElementById("cart-drawer");
    if (overlay) overlay.classList.add("is-active");
    if (drawer) drawer.classList.add("is-active");
    document.body.style.overflow = "hidden";
  },

  closeDrawer: function() {
    var overlay = document.getElementById("cart-drawer-overlay");
    var drawer = document.getElementById("cart-drawer");
    if (overlay) overlay.classList.remove("is-active");
    if (drawer) drawer.classList.remove("is-active");
    document.body.style.overflow = "";
  },

  showToast: function(msg) {
    var toast = document.getElementById("site-toast");
    if (!toast) return;
    toast.innerHTML = 
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--accent-emerald);"><path d="M20 6 9 17l-5-5"/></svg>' +
      '<span>' + msg + '</span>';
    toast.classList.add("is-active");
    setTimeout(function() {
      toast.classList.remove("is-active");
    }, 3200);
  }
};
