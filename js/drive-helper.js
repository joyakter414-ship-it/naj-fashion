/**
 * GOOGLE DRIVE IMAGE CDN HELPER
 * Enables connecting images directly to client's Google Drive.
 * Converts Google Drive IDs or sharing URLs to direct high-speed CDN URLs.
 */

window.DriveHelper = {
  /**
   * Convert Google Drive File ID or URL to direct high-speed embed link
   */
  resolveImageUrl: function(imageRef) {
    if (!imageRef) return "/public/assets/logo.jpg";
    
    // If it's already a full HTTP URL (Unsplash or external CDN)
    if (imageRef.startsWith("http://") || imageRef.startsWith("https://")) {
      // Check if it's a drive.google.com share link
      var driveMatch = imageRef.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                       imageRef.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return "https://lh3.googleusercontent.com/d/" + driveMatch[1];
      }
      return imageRef;
    }
    
    // If it starts with "gdrive:" prefix e.g. "gdrive:1UTXummcfOpgAInmstFETVZ3C0hZATRLV"
    if (imageRef.startsWith("gdrive:")) {
      var fileId = imageRef.replace("gdrive:", "").trim();
      return "https://lh3.googleusercontent.com/d/" + fileId;
    }
    
    // If it's a direct Google Drive alphanumeric ID (length typically 25-45 characters without slashes)
    if (/^[a-zA-Z0-9_-]{25,45}$/.test(imageRef)) {
      return "https://lh3.googleusercontent.com/d/" + imageRef;
    }
    
    // Otherwise it's a relative local path
    return imageRef;
  },

  /**
   * Setup image error fallback
   */
  attachImageFallback: function(imgElement, fallbackSrc) {
    if (!imgElement) return;
    imgElement.onerror = function() {
      this.onerror = null;
      this.src = fallbackSrc || "/public/assets/logo.jpg";
    };
  }
};
