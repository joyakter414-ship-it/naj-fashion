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
  whatsappNumber: "+8801920217501", // BD WhatsApp hotline
  displayPhone: "01920217501",
  displayPhoneSecondary: "+880 1920-217501",
  email: "najfashionhousebd@gmail.com",
  address: "ঢাকা, সাভার, নবীনগর, চারিগ্রাম",
  warehouseLocation: "ঢাকা, সাভার, নবীনগর, চারিগ্রাম",
  
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
    "⚡ ২৪-৪৮ ঘণ্টার মধ্যে সুপারফাস্ট হোম ডেলিভারি",
    "📞 সরাসরি অর্ডার ও সাপোর্টের জন্য কল বা হোয়াটসঅ্যাপ করুন: 01920217501"
  ],
  
  // Bangladesh Payment Methods Supported
  paymentMethods: [
    { id: "cod", name: "ক্যাশ অন ডেলিভারি (Cash on Delivery)", desc: "পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন", badge: "সবচেয়ে জনপ্রিয়" },
    { id: "bkash", name: "bKash (বিকাশ সেন্ড মানি)", desc: "বিকাশ পার্সোনাল: 01920217501", badge: "Fast" },
    { id: "nagad", name: "Nagad (নগদ সেন্ড মানি)", desc: "নগদ পার্সোনাল: 01920217501", badge: "Instant" }
  ]
};
