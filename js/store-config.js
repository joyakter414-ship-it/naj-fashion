/**
 * N.A.J FASHION HOUSE - STORE CONFIGURATION
 * Brand Name: N.A.J Fashion House (N.A.J FASHION)
 * Slogan: STYLE YOURSELF
 * Client Facebook: https://www.facebook.com/profile.php?id=100081147288431
 */

window.STORE_CONFIG = {
  name: "N.A.J Fashion House",
  shortName: "N.A.J FASHION",
  tagline: "STYLE YOURSELF",
  subTagline: "Premium Men's & Contemporary Clothing · Dhaka, Bangladesh",
  
  // Official Links & Social Media
  facebookUrl: "https://www.facebook.com/profile.php?id=100081147288431",
  whatsappNumber: "+8801812345678", // Default BD WhatsApp hotline
  displayPhone: "+880 1812-345678",
  displayPhoneSecondary: "+880 1712-987654",
  email: "najfashionhousebd@gmail.com",
  address: "House #18, Road #04, Block-C, Mirpur-1, Dhaka-1216, Bangladesh",
  warehouseLocation: "Dhaka Central Distribution Hub",
  
  // Google Drive Connected Folder Info
  googleDrive: {
    folderId: "1sUFGleV_WKsrFntIiWRYUBltHYALF6rc",
    folderName: "NAJ Fashion House Assets",
    logoFileId: "1UTXummcfOpgAInmstFETVZ3C0hZATRLV",
    cdnBase: "https://lh3.googleusercontent.com/d/"
  },
  
  // Local Assets Fallbacks
  logoPath: "/public/assets/logo.jpg",
  
  // E-commerce & Delivery Rules (BDT)
  currency: "৳",
  currencyCode: "BDT",
  shipping: {
    insideDhakaFee: 70,
    outsideDhakaFee: 130,
    subDhakaFee: 100, // Gazipur / Narayanganj / Savar
    freeShippingThreshold: 2500, // Free delivery on orders over ৳2,500
    estimatedDhakaDays: "24-48 Hours",
    estimatedOutsideDays: "2-4 Days"
  },
  
  // Announcements Strip Messages
  announcements: [
    "✨ নতুন কালেকশন ২০২৬: সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা!",
    "🔥 SPECIAL OFFER: ২,৫০০ টাকার অর্ডারে সারাদেশে ফ্রি ডেলিভারি!",
    "👕 ১০০% প্রিমিয়াম সুতি ফেব্রিক ও গ্যারান্টেড কোয়ালিটি · স্টাইল ইয়োরসেল্ফ",
    "⚡ ঢাকা সিটিতে ২৪-৪৮ ঘণ্টার মধ্যে সুপারফাস্ট হোম ডেলিভারি",
    "📞 সরাসরি অর্ডার ও সাপোর্টের জন্য হোয়াটসঅ্যাপ করুন: +880 1812-345678"
  ],
  
  // Bangladesh Payment Methods Supported
  paymentMethods: [
    { id: "cod", name: "ক্যাশ অন ডেলিভারি (Cash on Delivery)", desc: "পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন", badge: "সবচেয়ে জনপ্রিয়" },
    { id: "bkash", name: "bKash (বিকাশ সেন্ড মানি)", desc: "বিকাশ পার্সোনাল: 01812345678", badge: "Fast" },
    { id: "nagad", name: "Nagad (নগদ সেন্ড মানি)", desc: "নগদ পার্সোনাল: 01812345678", badge: "Instant" }
  ]
};
