/**
 * N.A.J FASHION HOUSE - QUICK VIEW & PRODUCT DETAILS MODAL
 */

window.QuickViewManager = {
  activeProduct: null,
  selectedSize: null,
  selectedColor: null,
  quantity: 1,

  openModal: function(productId) {
    var product = (window.PRODUCTS_DATA || []).find(function(p) {
      return p.id === productId;
    });
    if (!product) return;

    this.activeProduct = product;
    this.selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M";
    this.selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;
    this.quantity = 1;

    this.renderModalContent();

    var modal = document.getElementById("quickview-modal");
    if (modal) {
      modal.classList.add("is-active");
      document.body.style.overflow = "hidden";
    }
  },

  closeModal: function() {
    var modal = document.getElementById("quickview-modal");
    if (modal) {
      modal.classList.remove("is-active");
      document.body.style.overflow = "";
    }
  },

  renderModalContent: function() {
    var p = this.activeProduct;
    if (!p) return;

    var catEl = document.getElementById("qv-category");
    var titleEl = document.getElementById("qv-title");
    var priceEl = document.getElementById("qv-price");
    var compareEl = document.getElementById("qv-compare");
    var fabricEl = document.getElementById("qv-fabric");
    var descEl = document.getElementById("qv-desc");
    var mainImg = document.getElementById("qv-main-img");
    var thumbsRow = document.getElementById("qv-thumbs");
    var sizesGroup = document.getElementById("qv-sizes");
    var qtyEl = document.getElementById("qv-qty");

    if (catEl) catEl.textContent = p.categoryLabel;
    if (titleEl) titleEl.textContent = p.title;
    if (priceEl) priceEl.textContent = "৳" + p.price.toLocaleString();
    if (compareEl) compareEl.textContent = "৳" + p.comparePrice.toLocaleString();
    if (fabricEl) fabricEl.innerHTML = "<strong>ফেব্রিক ও স্পেকস:</strong> " + p.fabric;
    if (descEl) descEl.textContent = p.description;
    if (qtyEl) qtyEl.textContent = this.quantity;

    // Main image
    var firstImg = p.images && p.images[0] ? p.images[0] : "/public/assets/logo.jpg";
    var resolvedFirst = window.DriveHelper ? window.DriveHelper.resolveImageUrl(firstImg) : firstImg;
    if (mainImg) {
      mainImg.src = resolvedFirst;
      mainImg.onerror = function() { this.src = "/public/assets/logo.jpg"; };
    }

    // Thumbnails
    if (thumbsRow) {
      var thumbHtml = "";
      (p.images || []).forEach(function(imgSrc, idx) {
        var resolved = window.DriveHelper ? window.DriveHelper.resolveImageUrl(imgSrc) : imgSrc;
        thumbHtml += 
          '<div class="quickview-thumb ' + (idx === 0 ? "is-active" : "") + '" onclick="QuickViewManager.switchImage(\'' + resolved + '\', this)">' +
            '<img src="' + resolved + '" alt="Thumbnail" onerror="this.src=\'/public/assets/logo.jpg\'" />' +
          '</div>';
      });
      thumbsRow.innerHTML = thumbHtml;
    }

    // Sizes
    if (sizesGroup) {
      var sizesHtml = "";
      var self = this;
      (p.sizes || []).forEach(function(s) {
        var activeClass = s === self.selectedSize ? "is-active" : "";
        sizesHtml += '<button class="quickview-size-btn ' + activeClass + '" onclick="QuickViewManager.selectSize(\'' + s + '\', this)">' + s + '</button>';
      });
      sizesGroup.innerHTML = sizesHtml;
    }
  },

  switchImage: function(imgUrl, thumbEl) {
    var mainImg = document.getElementById("qv-main-img");
    if (mainImg) mainImg.src = imgUrl;

    var thumbs = document.querySelectorAll(".quickview-thumb");
    thumbs.forEach(function(t) { t.classList.remove("is-active"); });
    if (thumbEl) thumbEl.classList.add("is-active");
  },

  selectSize: function(size, btnEl) {
    this.selectedSize = size;
    var btns = document.querySelectorAll(".quickview-size-btn");
    btns.forEach(function(b) { b.classList.remove("is-active"); });
    if (btnEl) btnEl.classList.add("is-active");
  },

  updateQty: function(delta) {
    this.quantity = Math.max(1, this.quantity + delta);
    var qtyEl = document.getElementById("qv-qty");
    if (qtyEl) qtyEl.textContent = this.quantity;
  },

  addToBag: function() {
    if (!this.activeProduct) return;
    window.CartManager.addItem(this.activeProduct, this.selectedSize, this.selectedColor, this.quantity);
    this.closeModal();
  },

  buyNowInstantCOD: function() {
    if (!this.activeProduct) return;
    this.closeModal();
    var directItem = {
      itemId: this.activeProduct.id + "_" + this.selectedSize + "_direct",
      productId: this.activeProduct.id,
      title: this.activeProduct.title,
      price: this.activeProduct.price,
      comparePrice: this.activeProduct.comparePrice,
      image: this.activeProduct.images && this.activeProduct.images[0] ? this.activeProduct.images[0] : "",
      size: this.selectedSize,
      color: this.selectedColor ? this.selectedColor.name : "Standard",
      qty: this.quantity
    };
    window.CheckoutManager.openCheckoutModal([directItem]);
  },

  openSizeGuide: function() {
    var modal = document.getElementById("sizeguide-modal");
    if (modal) {
      modal.classList.add("is-active");
    }
  },

  closeSizeGuide: function() {
    var modal = document.getElementById("sizeguide-modal");
    if (modal) {
      modal.classList.remove("is-active");
    }
  }
};
