/**
 * GOOGLE DRIVE IMAGE CDN HELPER
 * Robust, fault-tolerant parser for all Google Drive URL formats, IDs, and shared links.
 * Converts to high-speed zero-redirect direct CDN URLs: https://lh3.googleusercontent.com/d/{FILE_ID}
 */

(function(window) {
  var DriveHelper = {
    /**
     * Check if a link is a Google Drive Folder link (which cannot be rendered as an image)
     */
    isFolderLink: function(ref) {
      if (!ref) return false;
      var str = String(ref).trim();
      return str.indexOf("/drive/folders/") > -1 || str.indexOf("/folders/") > -1;
    },

    /**
     * Convert any Google Drive File ID or URL into a direct high-speed CDN URL
     */
    resolveImageUrl: function(imageRef) {
      if (!imageRef) return "/assets/logo.jpg";

      // Clean input: remove whitespace and surrounding quotes
      var ref = String(imageRef).trim().replace(/^["']|["']$/g, "");

      // If it's a folder link, it cannot be rendered as an image
      if (this.isFolderLink(ref)) {
        return "/assets/logo.jpg";
      }

      // Check standard Google Drive file URL patterns:
      // Pattern 1: drive.google.com/file/d/{ID}
      var matchFile = ref.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/);
      if (matchFile && matchFile[1]) {
        return "https://lh3.googleusercontent.com/d/" + matchFile[1];
      }

      // Pattern 2: ?id={ID} or &id={ID} (e.g. drive.google.com/open?id=XXX or uc?id=XXX)
      var matchIdParam = ref.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
      if (matchIdParam && matchIdParam[1]) {
        return "https://lh3.googleusercontent.com/d/" + matchIdParam[1];
      }

      // Pattern 3: /d/{ID} (e.g. lh3.googleusercontent.com/d/XXX or drive.google.com/d/XXX)
      var matchShortD = ref.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
      if (matchShortD && matchShortD[1]) {
        return "https://lh3.googleusercontent.com/d/" + matchShortD[1];
      }

      // Pattern 4: gdrive:{ID} prefix
      if (ref.startsWith("gdrive:")) {
        var fid = ref.replace("gdrive:", "").trim();
        return "https://lh3.googleusercontent.com/d/" + fid;
      }

      // Pattern 5: Raw Google Drive ID (25 to 50 alphanumeric characters)
      if (/^[a-zA-Z0-9_-]{25,50}$/.test(ref)) {
        return "https://lh3.googleusercontent.com/d/" + ref;
      }

      // Otherwise it's a standard URL (Unsplash, HTTPS, local asset)
      return ref;
    },

    /**
     * Validate Google Drive Link health and permission in real-time
     */
    validateLinkStatus: function(url, callback) {
      if (!url || typeof callback !== "function") return;
      var resolved = this.resolveImageUrl(url);

      if (this.isFolderLink(url)) {
        callback({
          valid: false,
          isFolder: true,
          message: "এটি একটি ড্রাইভ ফোল্ডারের লিংক! ফোল্ডারের ভেতরে থাকা ছবির লিংক দিন।"
        });
        return;
      }

      var img = new Image();
      var timer = setTimeout(function() {
        img.onload = img.onerror = null;
        callback({
          valid: false,
          isDrive: resolved.indexOf("lh3.googleusercontent.com") > -1,
          message: "ছবি লোড হতে অতিরিক্ত সময় নিচ্ছে বা ড্রাইভ ফাইলটি Restricted।"
        });
      }, 7000);

      img.onload = function() {
        clearTimeout(timer);
        callback({
          valid: true,
          resolvedUrl: resolved,
          width: img.width,
          height: img.height,
          message: "ছবি সফলভাবে ভেরিফাইড ও প্রস্তুত!"
        });
      };

      img.onerror = function() {
        clearTimeout(timer);
        callback({
          valid: false,
          isDrive: resolved.indexOf("lh3.googleusercontent.com") > -1,
          message: "ছবি লোড হচ্ছে না! নিশ্চিত করুন Google Drive-এ ফাইলের Access 'Anyone with the link can view' করা আছে।"
        });
      };

      img.src = resolved;
    },

    /**
     * Image error fallback helper
     */
    attachImageFallback: function(imgElement, fallbackSrc) {
      if (!imgElement) return;
      imgElement.onerror = function() {
        this.onerror = null;
        this.src = fallbackSrc || "/assets/logo.jpg";
      };
    }
  };

  window.DriveHelper = DriveHelper;
})(window);
