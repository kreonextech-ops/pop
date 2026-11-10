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

export const PRODUCTS: Record<string, ProductDetails> = {
  "peri-peri": {
    slug: "peri-peri",
    id: "periperi",
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
    bgSvg: "/product-bg/peri-peri.svg",
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
      single: { label: "1 Pouch", count: "20g Pouch", price: 40, originalPrice: 45 },
      trio: { label: "Pack of 3", count: "3 × 20g (60g)", price: 115, originalPrice: 135, badge: "MOST POPULAR" },
      party: { label: "Pack of 6", count: "6 × 20g (120g)", price: 220, originalPrice: 270, badge: "SAVE 18%" },
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
    bgSvg: "/product-bg/cheese.svg",
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
      single: { label: "1 Pouch", count: "20g Pouch", price: 40, originalPrice: 45 },
      trio: { label: "Pack of 3", count: "3 × 20g (60g)", price: 115, originalPrice: 135, badge: "MOST POPULAR" },
      party: { label: "Pack of 6", count: "6 × 20g (120g)", price: 220, originalPrice: 270, badge: "SAVE 18%" },
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

  "raw-makhana": {
    slug: "raw-makhana",
    id: "plain",
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
    packImage: "/packets/plain.png",
    bgSvg: "/product-bg/plain.svg",
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
      single: { label: "1 Pouch", count: "20g Pouch", price: 35, originalPrice: 40 },
      trio: { label: "Pack of 3", count: "3 × 20g (60g)", price: 100, originalPrice: 120, badge: "BEST VALUE" },
      party: { label: "Pack of 6", count: "6 × 20g (120g)", price: 195, originalPrice: 240, badge: "SAVE 19%" },
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
