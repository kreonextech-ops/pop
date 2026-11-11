export interface NutritionItem {
  label: string;
  amount: string;
  dailyValue?: string;
  isIndent?: boolean;
  isBold?: boolean;
}

export interface ProductDetails {
  slug: string;
  id: string;
  numericId: number;
  variantIds: {
    single: number;
    trio: number;
    party: number;
  };
  name: string;
  badge: string;
  emoji: string;
  tagline: string;
  shortDesc: string;
  flavorProfile: {
    crunch: number; // out of 5
    spice: number; // out of 5
    tangy: number; // out of 5
    cheesiness: number; // out of 5
  };
  keyBenefits: string[];
  themeColor: string;
  accentBg: string;
  gradient: string;
  packImage: string;
  bgSvg: string;
  accentColor: string;
  servingSize: string;
  ingredients: string;
  allergen: string;
  disclaimer: string;
  borderAccentColor: string; // matches the packaging nutrition label border
  nutrition: NutritionItem[];
  pricing: {
    single: { label: string; count: string; price: number; originalPrice: number; badge?: string };
    trio: { label: string; count: string; price: number; originalPrice: number; badge?: string };
    party: { label: string; count: string; price: number; originalPrice: number; badge?: string };
  };
  faqs: { q: string; a: string }[];
  reviews: { name: string; rating: number; title: string; comment: string; date: string }[];
}

export interface ComboItem {
  slug: string;
  id: string;
  numericId: number;
  variantId: number;
  name: string;
  badge: string;
  emoji: string;
  tagline: string;
  shortDesc: string;
  packImage: string;
  secondaryImage?: string;
  includedFlavours: string[];
  themeColor: string;
  accentBg: string;
  price: number;
  originalPrice: number;
  savingsBadge?: string;
  rating: number;
  reviewsCount: number;
  packCountText: string;
  isBestSeller?: boolean;
}

export const COMBOS: Record<string, ComboItem> = {
  "trio-variety-pack": {
    slug: "trio-variety-pack",
    id: "combo-trio",
    numericId: 100004,
    variantId: 10000401,
    name: "ULTIMATE TRIO VARIETY PACK",
    badge: "🎁 TRIO PACK (3 PACKS)",
    emoji: "🎁",
    tagline: "1 × Peri Peri + 1 × Cheddar Cheese + 1 × Raw Makhana",
    shortDesc:
      "Can’t pick just one? Taste all three signature Pop Culture flavours in one exciting box. The perfect crunch discovery kit!",
    packImage: "/packets/peri peri.svg",
    secondaryImage: "/packets/cheese.svg",
    includedFlavours: [
      "1 × Peri Peri Punch (20g)",
      "1 × Cheddar Cheese Melt (20g)",
      "1 × Raw Roasted Makhana (20g)",
    ],
    themeColor: "#D73B3A",
    accentBg: "#ED0006",
    price: 115,
    originalPrice: 135,
    savingsBadge: "BEST SELLER",
    rating: 4.9,
    reviewsCount: 312,
    packCountText: "3 × 20g Pouches (60g)",
    isBestSeller: true,
  },
  "party-crunch-box": {
    slug: "party-crunch-box",
    id: "combo-party",
    numericId: 100005,
    variantId: 10000501,
    name: "PARTY CRUNCH BUNDLE",
    badge: "🎉 PARTY PACK (6 PACKS)",
    emoji: "🎉",
    tagline: "2 × Peri Peri + 2 × Cheddar Cheese + 2 × Raw Makhana",
    shortDesc:
      "Stock up for movie nights, late-night gaming, and guilt-free couch munching. Double the crunch for the whole crew.",
    packImage: "/packets/cheese.svg",
    secondaryImage: "/packets/peri peri.svg",
    includedFlavours: [
      "2 × Peri Peri Punch (20g)",
      "2 × Cheddar Cheese Melt (20g)",
      "2 × Raw Roasted Makhana (20g)",
    ],
    themeColor: "#FAC537",
    accentBg: "#F79E1B",
    price: 220,
    originalPrice: 270,
    savingsBadge: "SAVE 18%",
    rating: 5.0,
    reviewsCount: 184,
    packCountText: "6 × 20g Pouches (120g)",
    isBestSeller: false,
  },
  "mega-muncher-stash": {
    slug: "mega-muncher-stash",
    id: "combo-mega",
    numericId: 100006,
    variantId: 10000601,
    name: "MEGA MUNCHER 12-PACK STASH",
    badge: "⚡ MEGA STASH (12 PACKS)",
    emoji: "⚡",
    tagline: "4 × Peri Peri + 4 × Cheddar Cheese + 4 × Raw Makhana",
    shortDesc:
      "The ultimate pantry supply for healthy homes and offices. Maximum flavour variety, bulk savings, and free express delivery.",
    packImage: "/packets/raw-makhana-pouch.png",
    secondaryImage: "/packets/cheese.svg",
    includedFlavours: [
      "4 × Peri Peri Punch (20g)",
      "4 × Cheddar Cheese Melt (20g)",
      "4 × Raw Roasted Makhana (20g)",
    ],
    themeColor: "#3CA837",
    accentBg: "#3CA837",
    price: 420,
    originalPrice: 540,
    savingsBadge: "SAVE 22%",
    rating: 4.9,
    reviewsCount: 96,
    packCountText: "12 × 20g Pouches (240g)",
    isBestSeller: false,
  },
};

export const PRODUCTS: Record<string, ProductDetails> = {
  "peri-peri": {
    slug: "peri-peri",
    id: "periperi",
    numericId: 100001,
    variantIds: { single: 10000101, trio: 10000102, party: 10000103 },
    name: "PERI PERI",
    badge: "🌶️ PERI PERI",
    emoji: "🌶️",
    tagline: "Fiery, Tangy & Irresistibly Crunchy",
    shortDesc:
      "Sun-ripened red chillies, aromatic dried garlic, and authentic African peri-peri zest slow-tossed over jumbo handpicked foxnuts. A bold kick that explodes with every crunch.",
    flavorProfile: {
      crunch: 5,
      spice: 4,
      tangy: 5,
      cheesiness: 0,
    },
    keyBenefits: [
      "Slow-Roasted, Never Fried",
      "Rich in Plant Protein & Fibre",
      "Zero Cholesterol & 0g Trans Fat",
      "Authentic Peri Peri Spices",
    ],
    themeColor: "#D73B3A", // Scarlet Rush
    accentBg: "#ED0006", // Accent Vibrant Red
    gradient: "from-[#D73B3A] via-[#ED0006] to-[#522C28]",
    packImage: "/packets/peri peri.svg",
    bgSvg: "/product-bg/peri-peri.webp",
    accentColor: "#FAC537", // Accent Warm Yellow
    servingSize: "20g",
    borderAccentColor: "#F97316", // Vibrant Orange as seen in packaging
    ingredients:
      "Foxnut (Makhana) , Edible Vegetable Oil (Rice Bran Oil, Olive Oil), Peri Peri Seasoning [Iodized Salt, Sugar, Black Salt, Acidity Regulators (INS 330, INS 262), Spices & Condiments (Red Chilli, Turmeric, Black Pepper, Cumin, Dried Garlic Powder, Dried Onion Powder), Maltodextrin, Flavour Enhancer (INS 621), Natural Colour (INS160c), Anticaking Agent (INS 551)].\nCONTAINS ADDED FLAVOURS (NATURAL & NATURE IDENTICAL).",
    allergen: "MAY CONTAIN NUTS.",
    disclaimer:
      "*%RDA Values Are Based On A 2000 Kcal Diet As Per Fssai Guidelines. Actual Needs May Vary Based On Individual Dietary Requirements.",
    nutrition: [
      { label: "Energy", amount: "512 kcal", dailyValue: "4.80%", isBold: true },
      { label: "Protein", amount: "10g", isBold: true },
      { label: "Carbohydrates", amount: "70g", isBold: true },
      { label: "Total Sugar", amount: "5g", isIndent: true },
      { label: "Dietary Fibre", amount: "3g", isIndent: true },
      { label: "Total Fat", amount: "20g", dailyValue: "6.60%", isBold: true },
      { label: "Saturated Fat", amount: "4g", dailyValue: "4.0%", isIndent: true },
      { label: "M.U.F.A", amount: "10g", isIndent: true },
      { label: "P.U.F.A", amount: "7g", isIndent: true },
      { label: "Trans Fat", amount: "0g", isBold: true },
      { label: "Cholesterol", amount: "1mg", isBold: true },
      { label: "Sodium", amount: "600mg", dailyValue: "6.0%", isBold: true },
    ],
    pricing: {
      single: { label: "1 Pouch", count: "60g Pouch", price: 149, originalPrice: 175 },
      trio: { label: "Pack of 3", count: "3 × 60g (180g)", price: 429, originalPrice: 525, badge: "MOST POPULAR" },
      party: { label: "Pack of 6", count: "6 × 60g (360g)", price: 829, originalPrice: 1050, badge: "SAVE 21%" },
    },
    faqs: [
      {
        q: "How spicy is Peri Peri?",
        a: "It has a medium-high zesty punch! The heat is balanced with tangy lime notes and aromatic garlic so it's addictively snackable.",
      },
      {
        q: "Is this fried or roasted?",
        a: "100% slow-roasted in small batches. We never deep-fry our foxnuts.",
      },
      {
        q: "What is the shelf life?",
        a: "Pop Culture Makhana stays fresh and ultra-crunchy for 9 months from the date of manufacture.",
      },
    ],
    reviews: [
      {
        name: "Aakash V.",
        rating: 5,
        title: "Best evening work snack!",
        comment: "The peri peri spice hits just right without being overwhelmingly hot. Super crunchy!",
        date: "2 days ago",
      },
      {
        name: "Sneha R.",
        rating: 5,
        title: "Replaced my potato chips",
        comment: "Finally a healthy guilt-free snack that actually tastes exciting. Love the bold flavor.",
        date: "1 week ago",
      },
    ],
  },

  "cheddar-cheese": {
    slug: "cheddar-cheese",
    id: "cheddar",
    numericId: 100002,
    variantIds: { single: 10000201, trio: 10000202, party: 10000203 },
    name: "CHEDDAR CHEESE",
    badge: "🧀 CHEDDAR CHEESE",
    emoji: "🧀",
    tagline: "Rich, Melty & Velvety Golden Crunch",
    shortDesc:
      "A velvety cloud of slow-aged golden cheddar dust melted over fluffy, crunchy lotus pops. Rich, savory, and indulgently cheesy without the greasy guilt.",
    flavorProfile: {
      crunch: 5,
      spice: 0,
      tangy: 2,
      cheesiness: 5,
    },
    keyBenefits: [
      "Real Cheddar Cheese Seasoning",
      "Slow-Roasted, Never Deep-Fried",
      "0g Trans Fat & Zero Cholesterol",
      "Kid-Friendly & Guilt-Free",
    ],
    themeColor: "#FAC537", // Accent Warm Yellow
    accentBg: "#F79E1B",
    gradient: "from-[#FAC537] via-[#F79E1B] to-[#522C28]",
    packImage: "/packets/cheese.svg",
    bgSvg: "/product-bg/cheese.webp",
    accentColor: "#522C28", // Espresso
    servingSize: "20g",
    borderAccentColor: "#A855F7", // Purple Accent as seen in packaging image
    ingredients:
      "Foxnut (Makhana) , Edible Vegetable Oil (Rice Bran Oil, Olive Oil), Cheddar Cheese Seasoning [Sugar, Iodized Salt, Black Salt, Acidity Regulators (INS 330, INS 262), Cheese Powder, Milk Solids, Maltodextrin, Flavour Enhancers (INS621), Anticaking Agent (INS 551)].\nCONTAINS ADDED FLAVOURS (NATURAL & NATURE IDENTICAL).",
    allergen: "CONTAINS MILK. MAY CONTAIN NUTS.",
    disclaimer:
      "*%RDA Values Are Based On A 2000 Kcal Diet As Per Fssai Guidelines. Actual Needs May Vary Based On Individual Dietary Requirements.",
    nutrition: [
      { label: "Energy", amount: "505 kcal", dailyValue: "4.80%", isBold: true },
      { label: "Protein", amount: "7.8g", isBold: true },
      { label: "Carbohydrates", amount: "63g", isBold: true },
      { label: "Total Sugar", amount: "3.2g", isIndent: true },
      { label: "Dietary Fibre", amount: "11.8g", isIndent: true },
      { label: "Total Fat", amount: "18.5g", dailyValue: "5.50%", isBold: true },
      { label: "Saturated Fat", amount: "10.2g", dailyValue: "9.3%", isIndent: true },
      { label: "M.U.F.A", amount: "8g", isIndent: true },
      { label: "P.U.F.A", amount: "2g", isIndent: true },
      { label: "Trans Fat", amount: "0g", isBold: true },
      { label: "Cholesterol", amount: "0mg", isBold: true },
      { label: "Sodium", amount: "290mg", dailyValue: "2.90%", isBold: true },
    ],
    pricing: {
      single: { label: "1 Pouch", count: "60g Pouch", price: 149, originalPrice: 175 },
      trio: { label: "Pack of 3", count: "3 × 60g (180g)", price: 429, originalPrice: 525, badge: "MOST POPULAR" },
      party: { label: "Pack of 6", count: "6 × 60g (360g)", price: 829, originalPrice: 1050, badge: "SAVE 21%" },
    },
    faqs: [
      {
        q: "Does this contain real cheese?",
        a: "Yes! We use authentic cheddar cheese powder blended with milk solids for that golden, velvety savoriness.",
      },
      {
        q: "Is it suitable for vegetarians?",
        a: "Yes, 100% vegetarian friendly with green dot certification.",
      },
      {
        q: "What makes it healthier than cheese puffs?",
        a: "Regular cheese puffs are deep-fried corn starch. Pop Culture uses nutrient-dense foxnuts with zero trans fats and 11.8g of natural dietary fibre per 100g.",
      },
    ],
    reviews: [
      {
        name: "Pooja M.",
        rating: 5,
        title: "Tastes like movie popcorn but better!",
        comment: "So light and airy with tons of cheese flavour. My kids finish the whole pack in minutes.",
        date: "3 days ago",
      },
      {
        name: "Rohan K.",
        rating: 5,
        title: "Obsessed with this crunch",
        comment: "The aged cheddar dust is gourmet quality. 10/10 recommendation.",
        date: "2 weeks ago",
      },
    ],
  },

  "pink-salt": {
    slug: "pink-salt",
    id: "pinksalt",
    numericId: 100007,
    variantIds: { single: 10000701, trio: 10000702, party: 10000703 },
    name: "HIMALAYAN PINK SALT",
    badge: "🧂 PINK SALT",
    emoji: "🧂",
    tagline: "Crisp, Mineral-Rich & Effortlessly Savoury",
    shortDesc:
      "Handpicked jumbo foxnuts slow-roasted in rice bran & olive oil and dusted with pure Himalayan pink rock salt. Clean, mineral-rich crunch made for everyday snacking.",
    flavorProfile: {
      crunch: 5,
      spice: 0,
      tangy: 1,
      cheesiness: 0,
    },
    keyBenefits: [
      "Pure Himalayan Rock Salt",
      "Slow-Roasted, Never Fried",
      "0.0g Added Sugar & 0.0g Trans Fat",
      "Gluten-Free & Mineral Rich",
    ],
    themeColor: "#E1366C",
    accentBg: "#E1366C",
    gradient: "from-[#F05A89] via-[#E1366C] to-[#522C28]",
    packImage: "/packets/pink-salt-pouch.png",
    bgSvg: "/product-bg/pink-salt.webp",
    accentColor: "#FAC537",
    servingSize: "25g",
    borderAccentColor: "#F97316",
    ingredients:
      "Foxnut (Makhana) , Edible Vegetable Oil (Rice Bran Oil, Olive Oil), Rock Salt",
    allergen: "MAY CONTAIN NUTS.",
    disclaimer:
      "*Approximate Values. Guideline Daily Amount according to \"Recommended Dietary Allowance\" for average adult per day (2000 kcal Diet) as per FSSR (Labelling & Display) 2020. ^% Daily Values are based on a 2000 kcal diet.",
    nutrition: [
      { label: "Energy", amount: "510 kcal", dailyValue: "6.4%", isBold: true },
      { label: "Protein", amount: "7.8g", isBold: true },
      { label: "Carbohydrates", amount: "68.0g", isBold: true },
      { label: "Total Sugar", amount: "0.5g", isIndent: true },
      { label: "Added Sugar", amount: "0.0g", dailyValue: "0.0%", isIndent: true },
      { label: "Dietary Fibre", amount: "11.2g", isIndent: true },
      { label: "Total Fat", amount: "22.5g", dailyValue: "8.4%", isBold: true },
      { label: "Saturated Fat", amount: "9.2g", dailyValue: "10.3%", isIndent: true },
      { label: "M.U.F.A.", amount: "10.0g", isIndent: true },
      { label: "P.U.F.A.", amount: "7.0g", isIndent: true },
      { label: "Trans Fat", amount: "0.0g", isBold: true },
      { label: "Cholesterol", amount: "0.0mg", isBold: true },
      { label: "Sodium", amount: "315.0mg", dailyValue: "3.9%", isBold: true },
    ],
    pricing: {
      single: { label: "1 Pouch", count: "60g Pouch", price: 149, originalPrice: 175 },
      trio: { label: "Pack of 3", count: "3 × 60g (180g)", price: 429, originalPrice: 525, badge: "MOST POPULAR" },
      party: { label: "Pack of 6", count: "6 × 60g (360g)", price: 829, originalPrice: 1050, badge: "SAVE 21%" },
    },
    faqs: [
      {
        q: "What kind of salt is used in Pink Salt Makhana?",
        a: "We use pure Himalayan Pink Rock Salt gently tossed with slow-roasted jumbo foxnuts for a clean, balanced savoury finish.",
      },
      {
        q: "Is there any added sugar or trans fat?",
        a: "Zero! It contains 0.0g Added Sugar, 0.0g Trans Fat, and 0.0mg Cholesterol per our nutritional panel.",
      },
      {
        q: "Is it suitable for daily guilt-free snacking?",
        a: "Yes — packed with 11.2g of dietary fibre and 7.8g protein per 100g, it keeps hunger away cleanly.",
      },
    ],
    reviews: [
      {
        name: "Meera N.",
        rating: 5,
        title: "So clean and addictive!",
        comment: "Just the right amount of pink salt with an insane crunch. My new go-to desk snack.",
        date: "3 days ago",
      },
      {
        name: "Kabir S.",
        rating: 5,
        title: "Light, airy & zero heaviness",
        comment: "Love that there is 0g added sugar and authentic rock salt taste.",
        date: "1 week ago",
      },
    ],
  },

  "raw-makhana": {
    slug: "raw-makhana",
    id: "plain",
    numericId: 100003,
    variantIds: { single: 10000301, trio: 10000302, party: 10000303 },
    name: "RAW MAKHANA",
    badge: "🌱 RAW MAKHANA",
    emoji: "🌱",
    tagline: "100% Pure, Lightly Roasted & Naturally Crisp",
    shortDesc:
      "Handpicked jumbo graded lotus pops slow-roasted to golden perfection with a delicate whisper of rock salt. Pure, unadulterated crunch that pairs with every lifestyle.",
    flavorProfile: {
      crunch: 5,
      spice: 0,
      tangy: 0,
      cheesiness: 0,
    },
    keyBenefits: [
      "100% Handpicked Lotus Pops",
      "Low Calorie & Naturally High Fibre",
      "Keto, Vegan & Fasting Friendly",
      "Zero Added Flavours or Preservatives",
    ],
    themeColor: "#3CA837", // Accent Kelly Green
    accentBg: "#3CA837",
    gradient: "from-[#93BF56] via-[#3CA837] to-[#522C28]",
    packImage: "/packets/raw-makhana-pouch.png",
    bgSvg: "/product-bg/plain.webp",
    accentColor: "#93BF56", // Accent Lime Green
    servingSize: "20g",
    borderAccentColor: "#10B981", // Fresh Green Accent
    ingredients:
      "Foxnut (Makhana) [100% Handpicked Jumbo Lotus Seeds], Edible Vegetable Oil (Rice Bran Oil, Olive Oil), Himalayan Rock Salt.\nCONTAINS NO ARTIFICIAL COLOURS, PRESERVATIVES OR ARTIFICIAL FLAVOURS.",
    allergen: "MAY CONTAIN NUTS. GLUTEN FREE.",
    disclaimer:
      "*%RDA Values Are Based On A 2000 Kcal Diet As Per Fssai Guidelines. Actual Needs May Vary Based On Individual Dietary Requirements.",
    nutrition: [
      { label: "Energy", amount: "350 kcal", dailyValue: "3.50%", isBold: true },
      { label: "Protein", amount: "9.7g", isBold: true },
      { label: "Carbohydrates", amount: "77g", isBold: true },
      { label: "Total Sugar", amount: "0.5g", isIndent: true },
      { label: "Dietary Fibre", amount: "14.5g", isIndent: true },
      { label: "Total Fat", amount: "0.8g", dailyValue: "0.30%", isBold: true },
      { label: "Saturated Fat", amount: "0.2g", dailyValue: "0.2%", isIndent: true },
      { label: "M.U.F.A", amount: "0.3g", isIndent: true },
      { label: "P.U.F.A", amount: "0.3g", isIndent: true },
      { label: "Trans Fat", amount: "0g", isBold: true },
      { label: "Cholesterol", amount: "0mg", isBold: true },
      { label: "Sodium", amount: "120mg", dailyValue: "1.20%", isBold: true },
    ],
    pricing: {
      single: { label: "1 Pouch", count: "60g Pouch", price: 149, originalPrice: 175 },
      trio: { label: "Pack of 3", count: "3 × 60g (180g)", price: 429, originalPrice: 525, badge: "BEST VALUE" },
      party: { label: "Pack of 6", count: "6 × 60g (360g)", price: 829, originalPrice: 1050, badge: "SAVE 21%" },
    },
    faqs: [
      {
        q: "Can I eat this during fasting (Vrat)?",
        a: "Yes! 100% pure foxnuts roasted with rock salt (Sendha Namak) make this completely fasting compliant.",
      },
      {
        q: "How should I store it once opened?",
        a: "Seal the zipper pouch tightly or transfer to an airtight container to maintain maximum crunch.",
      },
      {
        q: "Are these good for weight management?",
        a: "Absolutely. With 14.5g fibre and almost zero fat, makhana keeps you full for hours with minimal calories.",
      },
    ],
    reviews: [
      {
        name: "Dr. Vikram S.",
        rating: 5,
        title: "Cleanest snack on the market",
        comment: "Great quality jumbo seeds, evenly roasted with no burnt bits. Perfect daily health snack.",
        date: "5 days ago",
      },
      {
        name: "Ananya B.",
        rating: 5,
        title: "Naturally crisp and pure",
        comment: "I love that there are no synthetic seasonings. Just pure roasted makhana that tastes fresh.",
        date: "3 weeks ago",
      },
    ],
  },
};
