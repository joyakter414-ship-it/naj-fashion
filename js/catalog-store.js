/**
 * N.A.J FASHION HOUSE - UNIFIED CATALOG & PERSISTENCE STORE
 * Bridges the Storefront and the Admin Panel with real-time sync.
 */

(function(window) {
  var STORAGE_KEYS = {
    PRODUCTS: "naj_custom_products_v2",
    CATEGORIES: "naj_custom_categories_v1",
    SETTINGS: "naj_store_settings_v1",
    AUTH: "naj_admin_auth_v1",
    ORDERS: "naj_customer_orders"
  };

  var ALL_SIZES = [
    "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"
  ];

  // Default Admin Credentials
  var DEFAULT_AUTH = {
    email: "admin@najfashion.com",
    password: "najfashion2026",
    role: "Super Admin",
    lastLogin: null
  };

  var CatalogStore = {
    keys: STORAGE_KEYS,

    // ================= PRODUCTS =================
    getProducts: function() {
      try {
        var local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (local) {
          var parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Sanitize: ensure no numeric waist sizes exist
            parsed.forEach(function(p) {
              if (!p.sizes || p.sizes.some(function(s) { return /^\d+$/.test(s); })) {
                p.sizes = ALL_SIZES.slice();
              }
            });
            return parsed;
          }
        }
      } catch (e) {
        console.error("Error reading products:", e);
      }

      // Fallback to static PRODUCTS_DATA and seed localStorage
      var initial = (window.PRODUCTS_DATA && window.PRODUCTS_DATA.length > 0) ? window.PRODUCTS_DATA : [];
      if (initial.length > 0) {
        this.saveProducts(initial);
      }
      return initial;
    },

    saveProducts: function(products) {
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        window.dispatchEvent(new CustomEvent("naj_products_updated", { detail: products }));
        return true;
      } catch (e) {
        console.error("Error saving products:", e);
        return false;
      }
    },

    addProduct: function(product) {
      var list = this.getProducts();
      // Ensure unique ID
      if (!product.id) {
        product.id = "naj-" + (product.category || "item") + "-" + Date.now();
      }
      list.unshift(product);
      this.saveProducts(list);
      return product;
    },

    updateProduct: function(productId, updatedFields) {
      var list = this.getProducts();
      var index = list.findIndex(function(p) { return p.id === productId; });
      if (index === -1) return false;

      list[index] = Object.assign({}, list[index], updatedFields);
      this.saveProducts(list);
      return list[index];
    },

    deleteProduct: function(productId) {
      var list = this.getProducts();
      var filtered = list.filter(function(p) { return p.id !== productId; });
      this.saveProducts(filtered);
      return true;
    },

    // ================= CATEGORIES =================
    getCategories: function() {
      try {
        var local = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (local) {
          var parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {}

      var initial = (window.CATEGORIES_DATA && window.CATEGORIES_DATA.length > 0) ? window.CATEGORIES_DATA : [];
      if (initial.length > 0) {
        this.saveCategories(initial);
      }
      return initial;
    },

    saveCategories: function(categories) {
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        window.dispatchEvent(new CustomEvent("naj_categories_updated", { detail: categories }));
        return true;
      } catch (e) {
        return false;
      }
    },

    addCategory: function(cat) {
      var list = this.getCategories();
      if (!cat.id) {
        cat.id = cat.label.toLowerCase().replace(/[^a-z0-9]/g, "-");
      }
      list.push(cat);
      this.saveCategories(list);
      return cat;
    },

    deleteCategory: function(catId) {
      if (catId === "all") return false; // Prevent deleting "all"
      var list = this.getCategories();
      var filtered = list.filter(function(c) { return c.id !== catId; });
      this.saveCategories(filtered);
      return true;
    },

    // ================= ADMIN AUTH =================
    getAuth: function() {
      try {
        var local = localStorage.getItem(STORAGE_KEYS.AUTH);
        if (local) {
          return JSON.parse(local);
        }
      } catch (e) {}
      this.saveAuth(DEFAULT_AUTH);
      return DEFAULT_AUTH;
    },

    saveAuth: function(authData) {
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
        return true;
      } catch (e) {
        return false;
      }
    },

    login: function(email, password) {
      var auth = this.getAuth();
      if (auth.email.trim().toLowerCase() === email.trim().toLowerCase() && auth.password === password) {
        auth.lastLogin = new Date().toISOString();
        this.saveAuth(auth);
        sessionStorage.setItem("naj_admin_logged_in", "true");
        return { success: true };
      }
      return { success: false, message: "ভুল ইমেইল বা পাসওয়ার্ড প্রদান করেছেন!" };
    },

    isLoggedIn: function() {
      return sessionStorage.getItem("naj_admin_logged_in") === "true";
    },

    logout: function() {
      sessionStorage.removeItem("naj_admin_logged_in");
    },

    /**
     * Change Email, Password or Both
     * Requires verifying current email and current password
     */
    updateCredentials: function(currentEmail, currentPassword, newEmail, newPassword) {
      var auth = this.getAuth();

      // Verify current credentials
      if (auth.email.trim().toLowerCase() !== currentEmail.trim().toLowerCase()) {
        return { success: false, message: "বর্তমান ইমেইলটি সঠিক নয়!" };
      }
      if (auth.password !== currentPassword) {
        return { success: false, message: "বর্তমান পাসওয়ার্ডটি সঠিক নয়!" };
      }

      var changedFields = [];

      // Update email if provided
      if (newEmail && newEmail.trim() !== "") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
          return { success: false, message: "অনুগ্রহ করে একটি সঠিক নতুন ইমেইল দিন!" };
        }
        auth.email = newEmail.trim().toLowerCase();
        changedFields.push("ইমেইল");
      }

      // Update password if provided
      if (newPassword && newPassword.trim() !== "") {
        if (newPassword.length < 6) {
          return { success: false, message: "নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে!" };
        }
        auth.password = newPassword;
        changedFields.push("পাসওয়ার্ড");
      }

      if (changedFields.length === 0) {
        return { success: false, message: "পরিবর্তন করার জন্য নতুন ইমেইল অথবা নতুন পাসওয়ার্ড লিখুন!" };
      }

      this.saveAuth(auth);
      return {
        success: true,
        message: "সফলভাবে " + changedFields.join(" ও ") + " পরিবর্তন করা হয়েছে!",
        newEmail: auth.email
      };
    },

    // ================= ORDERS =================
    getOrders: function() {
      try {
        var local = localStorage.getItem(STORAGE_KEYS.ORDERS);
        return local ? JSON.parse(local) : [];
      } catch (e) {
        return [];
      }
    },

    saveOrders: function(orders) {
      try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return true;
      } catch (e) {
        return false;
      }
    },

    updateOrderStatus: function(orderId, newStatus) {
      var orders = this.getOrders();
      var found = orders.find(function(o) { return o.orderId === orderId; });
      if (found) {
        found.status = newStatus;
        this.saveOrders(orders);
        return true;
      }
      return false;
    },

    deleteOrder: function(orderId) {
      var orders = this.getOrders().filter(function(o) { return o.orderId !== orderId; });
      this.saveOrders(orders);
      return true;
    },

    // ================= BACKUP & EXPORT =================
    exportStoreData: function() {
      return {
        exportedAt: new Date().toISOString(),
        products: this.getProducts(),
        categories: this.getCategories(),
        orders: this.getOrders(),
        auth: {
          email: this.getAuth().email
        }
      };
    }
  };

  window.CatalogStore = CatalogStore;
})(window);
