/**
 * N.A.J FASHION HOUSE - CATALOG & PRODUCT DATABASE
 * Supports Sizes from S to 10XL across all apparel.
 * Google Drive Image URLs, local assets, and high-res luxury previews.
 */

window.STANDARD_SIZES_ALL = [
  "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"
];

window.STANDARD_SIZE_GUIDE = [
  { size: "S", chest: "38\"", length: "27\"", shoulder: "17.5\"", sleeve: "8.5\"" },
  { size: "M", chest: "40\"", length: "28\"", shoulder: "18.5\"", sleeve: "9.0\"" },
  { size: "L", chest: "42\"", length: "29\"", shoulder: "19.5\"", sleeve: "9.5\"" },
  { size: "XL", chest: "44\"", length: "30\"", shoulder: "20.5\"", sleeve: "10.0\"" },
  { size: "2XL", chest: "46\"", length: "31\"", shoulder: "21.5\"", sleeve: "10.5\"" },
  { size: "3XL", chest: "48\"", length: "32\"", shoulder: "22.5\"", sleeve: "11.0\"" },
  { size: "4XL", chest: "50\"", length: "32.5\"", shoulder: "23.5\"", sleeve: "11.5\"" },
  { size: "5XL", chest: "52\"", length: "33\"", shoulder: "24.5\"", sleeve: "12.0\"" },
  { size: "6XL", chest: "54\"", length: "33.5\"", shoulder: "25.5\"", sleeve: "12.0\"" },
  { size: "7XL", chest: "56\"", length: "34\"", shoulder: "26.5\"", sleeve: "12.5\"" },
  { size: "8XL", chest: "58\"", length: "34.5\"", shoulder: "27.5\"", sleeve: "12.5\"" },
  { size: "9XL", chest: "60\"", length: "35\"", shoulder: "28.5\"", sleeve: "13.0\"" },
  { size: "10XL", chest: "62\"", length: "35.5\"", shoulder: "29.5\"", sleeve: "13.0\"" }
];

window.PRODUCTS_DATA = [
  {
    id: "naj-signature-oversized-tee-onyx",
    title: "Signature Heavyweight Oversized Tee",
    bnTitle: "এন.এ.জে সিগনেচার হেভিওয়েট ওভারসাইজড টি-শার্ট",
    category: "t-shirts",
    categoryLabel: "Oversized Tees",
    price: 990,
    comparePrice: 1350,
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 74,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Onyx Black", hex: "#111113" },
      { name: "Off White", hex: "#f0ede6" },
      { name: "Vintage Charcoal", hex: "#2b2b30" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 45,
    sku: "NAJ-TS-001",
    fabric: "230 GSM 100% Compact Combed Cotton · Silicon Soft Wash",
    description: "Built for effortless silhouette. Crafted from custom-knit 230 GSM compact cotton, featuring a drop-shoulder drape, reinforced ribbed crew neckline, and breathable luxury finish. S থেকে 10XL পর্যন্ত সব সাইজে উপলব্ধ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-style-yourself-drop-shoulder-tee",
    title: "'Style Yourself' Metallic Edition Tee",
    bnTitle: "স্টাইল ইয়োরসেল্ফ মেটালিক ড্রপ শোল্ডার টি-শার্ট",
    category: "t-shirts",
    categoryLabel: "Oversized Tees",
    price: 1050,
    comparePrice: 1400,
    badge: "NEW DROP",
    rating: 5.0,
    reviewCount: 42,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Deep Noir", hex: "#0c0c0e" },
      { name: "Sage Mist", hex: "#7a8b7b" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 38,
    sku: "NAJ-TS-002",
    fabric: "240 GSM Heavy Cotton · High-Density Gold Puff Print",
    description: "The brand flag-bearer tee. Features subtle gold metallic typography on chest and high-density typography across the back. S থেকে 10XL পর্যন্ত পারফেক্ট সাইজিং।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-cuban-resort-linen-shirt",
    title: "Cuban Collar Resort Linen Shirt",
    bnTitle: "কিউবান কলার রিসোর্ট লিনেন শার্ট",
    category: "shirts",
    categoryLabel: "Premium Shirts",
    price: 1290,
    comparePrice: 1750,
    badge: "HOT",
    rating: 4.8,
    reviewCount: 63,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Olive Moss", hex: "#4b5320" },
      { name: "Desert Sand", hex: "#d8c4b6" },
      { name: "Classic Black", hex: "#1a1a1a" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 30,
    sku: "NAJ-SH-001",
    fabric: "Organic Linen Blend · Ultra-Breathable & Moisture-Wicking",
    description: "Designed for effortless warm-weather sophistication. Camp collar detailing, relaxed boxy drape, and real coconut shell buttons. S থেকে 10XL পর্যন্ত উপলব্ধ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-royal-oxford-formal-shirt",
    title: "Royal Oxford Classic Casual Shirt",
    bnTitle: "রয়্যাল অক্সফোর্ড প্রিমিয়াম ক্যাজুয়াল শার্ট",
    category: "shirts",
    categoryLabel: "Premium Shirts",
    price: 1390,
    comparePrice: 1850,
    badge: "PREMIUM",
    rating: 4.9,
    reviewCount: 51,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Sky Azure", hex: "#a4c2f4" },
      { name: "Crisp White", hex: "#ffffff" },
      { name: "Midnight Navy", hex: "#101d36" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 35,
    sku: "NAJ-SH-002",
    fabric: "100% Egyptian Giza Cotton · Wrinkle-Resistant Weave",
    description: "Crisp, tailored and enduring. Tailored with double-stitched seams, semi-spread collar, and curved hem that looks flawless. S থেকে 10XL পর্যন্ত সাইজ অপশন।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-urban-tactical-cargo-pant",
    title: "Urban Tactical 6-Pocket Cargo Pants",
    bnTitle: "আরবান ট্যাকটিক্যাল ৬-পকেট কার্গো প্যান্ট",
    category: "pants",
    categoryLabel: "Bottomwear",
    price: 1550,
    comparePrice: 2100,
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 92,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Stealth Black", hex: "#111111" },
      { name: "Army Green", hex: "#3b4d3c" },
      { name: "Khaki Tan", hex: "#9e8b6b" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 42,
    sku: "NAJ-PT-001",
    fabric: "Tough Ripstop Cotton Twill · Reinforced Knee Paneling",
    description: "Built for movement and everyday streetwear utility. Includes 6 deep gusseted pockets, adjustable drawstring cuffs at ankles, and elasticated waist. S থেকে 10XL পর্যন্ত সম্পূর্ণ সাইজে উপলব্ধ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-tailored-tapered-chino",
    title: "Tailored Tapered Stretch Chino",
    bnTitle: "টেইলরড টেপারড স্ট্রেচ চিনো ট্রাউজার",
    category: "pants",
    categoryLabel: "Bottomwear",
    price: 1450,
    comparePrice: 1900,
    badge: "POPULAR",
    rating: 4.8,
    reviewCount: 48,
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Charcoal Slate", hex: "#2f3542" },
      { name: "Beige Cream", hex: "#dcd1b4" },
      { name: "Pitch Black", hex: "#0f0f11" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 30,
    sku: "NAJ-PT-002",
    fabric: "98% Combed Cotton + 2% Spandex · 4-Way Comfort Stretch",
    description: "The ideal balance of boardroom smartness and cafe casual. Premium peach-finish cotton with subtle stretch that holds its crisp silhouette. S থেকে 10XL পর্যন্ত উপলব্ধ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-heavyweight-fleece-hoodie-black",
    title: "Obsidian Heavyweight Fleece Hoodie",
    bnTitle: "অবসিডিয়ান হেভিওয়েট ফ্লিস হুডি",
    category: "hoodies",
    categoryLabel: "Winter Drops",
    price: 1750,
    comparePrice: 2400,
    badge: "WINTER DROP",
    rating: 5.0,
    reviewCount: 88,
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Obsidian Black", hex: "#0d0d0f" },
      { name: "Marrow Brown", hex: "#3b2f2f" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 40,
    sku: "NAJ-HD-001",
    fabric: "380 GSM Heavy French Terry Fleece · Brushed Interior",
    description: "Substantial, cozy, and engineered for cold evenings. Double-layered hood without flimsy drawstrings for a minimal streetwear aesthetic. S থেকে 10XL সাইজ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-luxury-embroidered-panjabi",
    title: "Royal Minimalist Embroidered Panjabi",
    bnTitle: "রয়্যাল মিনিমালিস্ট এমব্রয়ডারি পাঞ্জাবি",
    category: "panjabi",
    categoryLabel: "Exclusive Panjabi",
    price: 2150,
    comparePrice: 2850,
    badge: "EXCLUSIVE",
    rating: 4.9,
    reviewCount: 67,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Emerald Forest", hex: "#0b3c2e" },
      { name: "Royal Jet Black", hex: "#0a0a0a" },
      { name: "Pearl White", hex: "#fcfbf7" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 28,
    sku: "NAJ-PJ-001",
    fabric: "Premium Silk-Cotton Jacquard · Subtle Collar Embroidery",
    description: "Designed for Eid, weddings, and distinguished gatherings. Tailored with clean mandarin collar, metallic engraved buttons, and tailored silhouette. S থেকে 10XL পর্যন্ত উপলব্ধ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-pro-knit-polo-shirt",
    title: "Pro-Knit Textured Polo Shirt",
    bnTitle: "প্রো-নিট টেক্সচার্ড কলার পোলো শার্ট",
    category: "t-shirts",
    categoryLabel: "Polos & Tees",
    price: 1150,
    comparePrice: 1550,
    badge: "TRENDING",
    rating: 4.8,
    reviewCount: 39,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Charcoal Melange", hex: "#333338" },
      { name: "Burgundy Wine", hex: "#5b1425" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 32,
    sku: "NAJ-PL-001",
    fabric: "240 GSM Waffle Knit Pique Cotton · Ribbed Collar & Hem",
    description: "A refined classic reimagined. Structured waffle weave texture prevents sweat marks and ensures all-day comfort. Features buttonless open Johnny collar. S থেকে 10XL সাইজ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-baggy-fleece-jogger",
    title: "No-Limits Heavy Baggy Joggers",
    bnTitle: "নো-লিমিটস হেভি ব্যাগী জগার্স",
    category: "pants",
    categoryLabel: "Bottomwear",
    price: 1390,
    comparePrice: 1850,
    badge: "NEW DROP",
    rating: 4.9,
    reviewCount: 56,
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Heather Grey", hex: "#57585a" },
      { name: "Pure Black", hex: "#111111" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 36,
    sku: "NAJ-JG-001",
    fabric: "340 GSM Heavy Cotton Fleece · Elasticized Cuffed Hem",
    description: "Engineered for peak chill and street-ready flair. Deep pockets with hidden zippers so your smartphone never drops during commutes. S থেকে 10XL উপলব্ধ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-vintage-streetwear-bomber",
    title: "Signature Streetwear Flight Bomber",
    bnTitle: "সিগনেচার স্ট্রিটওয়্যার ফ্লাইট বম্বার জ্যাকেট",
    category: "hoodies",
    categoryLabel: "Winter Drops",
    price: 2450,
    comparePrice: 3200,
    badge: "EXCLUSIVE",
    rating: 5.0,
    reviewCount: 33,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Matte Black", hex: "#111112" },
      { name: "Military Olive", hex: "#434b3e" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 22,
    sku: "NAJ-JK-001",
    fabric: "Weather-Resistant Matte Poly Shell · Quilted Satin Lining",
    description: "The ultimate cold-weather statement piece. Heavy duty metal zipper, sleeve utility pocket, and windproof ribbed cuffs. S থেকে 10XL সাইজ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  },
  {
    id: "naj-platinum-silk-panjabi-black",
    title: "Platinum Edit Silk-Blend Panjabi",
    bnTitle: "প্লাটিনাম এডিট সিল্ক ব্লেন্ড পাঞ্জাবি",
    category: "panjabi",
    categoryLabel: "Exclusive Panjabi",
    price: 2350,
    comparePrice: 3100,
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 79,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
      { name: "Deep Charcoal Black", hex: "#121214" },
      { name: "Rich Navy", hex: "#0b1b36" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"],
    inStock: true,
    stockCount: 30,
    sku: "NAJ-PJ-002",
    fabric: "Pure Viscose Silk Blend · Luxurious Natural Sheen",
    description: "Exquisite softness with a distinguished royal presence. Enhanced with tonal piping around the collar and cuffs for understated luxury. S থেকে 10XL সাইজ।",
    sizeGuide: window.STANDARD_SIZE_GUIDE
  }
];

window.CATEGORIES_DATA = [
  {
    id: "all",
    label: "ALL PIECES",
    bnLabel: "সব কালেকশন",
    count: 12
  },
  {
    id: "t-shirts",
    label: "OVERSIZED TEES",
    bnLabel: "টি-শার্ট ও পোলো",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
    count: 3
  },
  {
    id: "shirts",
    label: "PREMIUM SHIRTS",
    bnLabel: "প্রিমিয়াম শার্ট",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
    count: 2
  },
  {
    id: "pants",
    label: "CARGO & PANTS",
    bnLabel: "প্যান্ট ও জগার্স",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    count: 3
  },
  {
    id: "hoodies",
    label: "WINTER DROPS",
    bnLabel: "হুডি ও জ্যাকেট",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
    count: 2
  },
  {
    id: "panjabi",
    label: "EXCLUSIVE PANJABI",
    bnLabel: "পাঞ্জাবি কালেকশন",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
    count: 2
  }
];

window.CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: "Tanzir Ahmed",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    title: "অসাধারণ ফেব্রিক কোয়ালিটি!",
    comment: "NAJ Fashion থেকে ২টা ওভারসাইজড টি-শার্ট অর্ডার করেছিলাম। কাপড় এত হেভি আর আরামদায়ক হবে ভাবিনি। কালার একদম যেমন ছবিতে তেমনই পেয়েছি। ক্যাশ অন ডেলিভারিতে চেক করে নিয়েছি। ১০/১০ রেটিং!",
    productName: "Signature Heavyweight Oversized Tee",
    date: "৩ দিন আগে",
    verified: true
  },
  {
    id: 2,
    name: "Sabbir Hossain",
    location: "Chittagong GEC",
    rating: 5,
    title: "বেস্ট ফিটিং কার্গো প্যান্ট",
    comment: "ট্যাকটিক্যাল কার্গো প্যান্টের ফেব্রিক এবং সেলাই সত্যিই মাস্টারপিস। চট্টগ্রামের বাইরে ডেলিভারি মাত্র ২ দিনে পেয়েছি। সাইজ সোয়াপ বা কোনো ঝামেলা ছাড়াই পারফেক্ট ফিট হয়েছে।",
    productName: "Urban Tactical 6-Pocket Cargo Pants",
    date: "১ সপ্তাহ আগে",
    verified: true
  },
  {
    id: 3,
    name: "Mahfuzur Rahman",
    location: "Uttara, Dhaka",
    rating: 5,
    title: "প্রিমিয়াম প্যাকেজিং ও ফাস্ট ডেলিভারি",
    comment: "পাঞ্জাবিটির সিল্ক-সুতি টেক্সচার অসম্ভব চমৎকার। গায়ে দিলে অসাধারণ প্রিমিয়াম লুক দেয়। ডেলিভারি বয় খুব ভালো ছিল, দেখে নেওয়ার সুযোগ দিয়েছে।",
    productName: "Royal Minimalist Embroidered Panjabi",
    date: "৫ দিন আগে",
    verified: true
  },
  {
    id: 4,
    name: "Rakibul Islam",
    location: "Sylhet Sadar",
    rating: 5,
    title: "Style Yourself স্লোগান সত্যি সার্থক!",
    comment: "অনলাইনে পোশাক কিনতে ভয় লাগত। কিন্তু N.A.J Fashion আমাকে অবাক করেছে। হুডিটার থিকনেস আর কম্ফোর্ট উইন্টারে একদম বেস্ট। সবার নজর কাড়বে নিশ্চিত।",
    productName: "Obsidian Heavyweight Fleece Hoodie",
    date: "২ সপ্তাহ আগে",
    verified: true
  }
];
