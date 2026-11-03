/**
 * N.A.J FASHION HOUSE - FAST BANGLADESHI 1-STEP CHECKOUT
 * Features instant COD order placement, 11-digit phone validation,
 * delivery calculations (Inside/Outside Dhaka), and 1-Click WhatsApp integration.
 */

window.CheckoutManager = {
  activeOrderItems: [],
  selectedArea: "inside", // "inside" (Dhaka) or "outside"
  selectedPayment: "cod",

  openCheckoutModal: function(itemsToOrder) {
    if (!itemsToOrder || itemsToOrder.length === 0) {
      itemsToOrder = window.CartManager.getItems();
    }
    if (!itemsToOrder || itemsToOrder.length === 0) {
      window.CartManager.showToast("অর্ডার করার আগে অন্তত একটি পণ্য নির্বাচন করুন!");
      return;
    }

    this.activeOrderItems = itemsToOrder;
    this.renderCheckoutPreview();
    this.calculateTotals();

    var modal = document.getElementById("checkout-modal");
    if (modal) {
      modal.classList.add("is-active");
      document.body.style.overflow = "hidden";
    }
  },

  closeCheckoutModal: function() {
    var modal = document.getElementById("checkout-modal");
    if (modal) {
      modal.classList.remove("is-active");
      document.body.style.overflow = "";
    }
    // Reset view if success was shown
    var successBox = document.getElementById("checkout-success-view");
    var formBox = document.getElementById("checkout-form-view");
    if (successBox) successBox.style.display = "none";
    if (formBox) formBox.style.display = "block";
  },

  setArea: function(area) {
    this.selectedArea = area;
    var cards = document.querySelectorAll(".area-radio-card");
    cards.forEach(function(card) {
      if (card.getAttribute("data-area") === area) {
        card.classList.add("is-selected");
      } else {
        card.classList.remove("is-selected");
      }
    });
    this.calculateTotals();
  },

  renderCheckoutPreview: function() {
    var container = document.getElementById("checkout-items-preview-container");
    if (!container) return;

    var html = "";
    this.activeOrderItems.forEach(function(it) {
      var resolvedImg = window.DriveHelper ? window.DriveHelper.resolveImageUrl(it.image) : it.image;
      html += 
        '<div class="checkout-item-preview">' +
          '<img src="' + resolvedImg + '" alt="' + it.title + '" class="checkout-item-thumb" onerror="this.src=\'/public/assets/logo.jpg\'" />' +
          '<div class="checkout-item-info">' +
            '<div class="checkout-item-title">' + it.title + '</div>' +
            '<div class="checkout-item-meta">সাইজ: ' + it.size + ' | কালার: ' + it.color + ' | পরিমাণ: ' + it.qty + 'টি</div>' +
          '</div>' +
          '<div class="checkout-item-price">৳' + (it.price * it.qty).toLocaleString() + '</div>' +
        '</div>';
    });
    container.innerHTML = html;
  },

  calculateTotals: function() {
    var subtotal = this.activeOrderItems.reduce(function(sum, it) {
      return sum + (it.price * it.qty);
    }, 0);

    var shippingCfg = window.STORE_CONFIG ? window.STORE_CONFIG.shipping : { insideDhakaFee: 70, outsideDhakaFee: 130, freeShippingThreshold: 2500 };
    var deliveryFee = 0;

    if (subtotal >= shippingCfg.freeShippingThreshold) {
      deliveryFee = 0;
    } else {
      deliveryFee = this.selectedArea === "inside" ? shippingCfg.insideDhakaFee : shippingCfg.outsideDhakaFee;
    }

    var grandTotal = subtotal + deliveryFee;

    var subtotalEl = document.getElementById("checkout-summary-subtotal");
    var shippingEl = document.getElementById("checkout-summary-shipping");
    var totalEl = document.getElementById("checkout-summary-total");

    if (subtotalEl) subtotalEl.textContent = "৳" + subtotal.toLocaleString();
    if (shippingEl) {
      if (deliveryFee === 0) {
        shippingEl.innerHTML = '<span style="color: var(--accent-emerald); font-weight: 700;">ফ্রি ডেলিভারি (FREE)</span>';
      } else {
        shippingEl.textContent = "৳" + deliveryFee;
      }
    }
    if (totalEl) totalEl.textContent = "৳" + grandTotal.toLocaleString();

    return {
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      grandTotal: grandTotal
    };
  },

  submitOrder: function(event) {
    if (event) event.preventDefault();

    var nameInput = document.getElementById("checkout-customer-name");
    var phoneInput = document.getElementById("checkout-customer-phone");
    var addressInput = document.getElementById("checkout-customer-address");
    var notesInput = document.getElementById("checkout-customer-notes");

    var name = nameInput ? nameInput.value.trim() : "";
    var phone = phoneInput ? phoneInput.value.trim() : "";
    var address = addressInput ? addressInput.value.trim() : "";
    var notes = notesInput ? notesInput.value.trim() : "";

    if (!name) {
      alert("অনুগ্রহ করে আপনার নাম লিখুন।");
      if (nameInput) nameInput.focus();
      return;
    }

    // Bangladesh Mobile Validation: 11 digits starting with 01
    var phoneClean = phone.replace(/\D/g, "");
    if (phoneClean.startsWith("8801")) {
      phoneClean = phoneClean.substring(2);
    }
    if (!/^01[3-9]\d{8}$/.test(phoneClean)) {
      alert("সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।");
      if (phoneInput) phoneInput.focus();
      return;
    }

    if (!address || address.length < 10) {
      alert("অনুগ্রহ করে আপনার পূর্ণাঙ্গ ঠিকানা (বাসা নং, রোড, থানা, জেলা) লিখুন।");
      if (addressInput) addressInput.focus();
      return;
    }

    var totals = this.calculateTotals();
    var orderId = "NAJ-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);
    var dateStr = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });

    var orderData = {
      orderId: orderId,
      date: dateStr,
      customer: {
        name: name,
        phone: phoneClean,
        address: address,
        notes: notes,
        area: this.selectedArea === "inside" ? "ঢাকা সিটি (Inside Dhaka)" : "ঢাকার বাইরে (Outside Dhaka)"
      },
      items: this.activeOrderItems,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      grandTotal: totals.grandTotal,
      paymentMethod: "Cash on Delivery (ক্যাশ অন ডেলিভারি)",
      status: "অর্ডার কনফার্মড (Processing)"
    };

    // Save to LocalStorage for order tracking
    try {
      var orders = JSON.parse(localStorage.getItem("naj_customer_orders") || "[]");
      orders.unshift(orderData);
      localStorage.setItem("naj_customer_orders", JSON.stringify(orders));
    } catch (e) {}

    // Clear cart if items came from cart
    window.CartManager.clearCart();

    // Show Success View
    this.showSuccessView(orderData);
  },

  showSuccessView: function(order) {
    var formView = document.getElementById("checkout-form-view");
    var successView = document.getElementById("checkout-success-view");

    if (formView) formView.style.display = "none";
    if (successView) {
      successView.style.display = "block";

      var idBadge = document.getElementById("success-order-id");
      var customerDetails = document.getElementById("success-customer-details");
      var totalVal = document.getElementById("success-total-val");
      var waBtn = document.getElementById("success-whatsapp-btn");

      if (idBadge) idBadge.textContent = "অর্ডার আইডি: #" + order.orderId;
      if (customerDetails) {
        customerDetails.innerHTML = 
          '<div><strong>গ্রাহক:</strong> ' + order.customer.name + ' (' + order.customer.phone + ')</div>' +
          '<div><strong>ঠিকানা:</strong> ' + order.customer.address + '</div>' +
          '<div><strong>ডেলিভারি এরিয়া:</strong> ' + order.customer.area + '</div>';
      }
      if (totalVal) totalVal.textContent = "৳" + order.grandTotal.toLocaleString();

      // WhatsApp Instant Order Link
      if (waBtn) {
        var waMsg = "আসসালামু আলাইকুম N.A.J Fashion House, আমি একটি নতুন অর্ডার প্লেস করেছি:\n\n" +
          "📦 অর্ডার আইডি: #" + order.orderId + "\n" +
          "👤 নাম: " + order.customer.name + "\n" +
          "📞 ফোন: " + order.customer.phone + "\n" +
          "📍 ঠিকানা: " + order.customer.address + "\n\n" +
          "🛍️ অর্ডারকৃত পণ্য:\n";

        order.items.forEach(function(it, idx) {
          waMsg += (idx + 1) + ". " + it.title + " (সাইজ: " + it.size + ", কালার: " + it.color + ") x " + it.qty + " = ৳" + (it.price * it.qty) + "\n";
        });

        waMsg += "\n💰 সর্বমোট মূল্য: ৳" + order.grandTotal + " (ক্যাশ অন ডেলিভারি)";

        var hotline = window.STORE_CONFIG ? window.STORE_CONFIG.whatsappNumber.replace(/\D/g, "") : "8801812345678";
        waBtn.href = "https://wa.me/" + hotline + "?text=" + encodeURIComponent(waMsg);
      }
    }
  }
};
