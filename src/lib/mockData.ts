// src/lib/mockData.ts
// Afghan Faizi Paint Mock Data

// ۱. گروه‌های اصلی محصولات رنگ
export const MAIN_CATEGORIES = [
  { id: "all", label: "همه محصولات رنگ" },
  { id: "oil", label: "رنگ‌های روغنی (آلکیدی)" },
  { id: "plastic", label: "رنگ‌های پلاستیک و اکریلیک" },
  { id: "instant", label: "رنگ و جلای فوری (سیلر و کیلر)" },
  { id: "industrial", label: "رنگ‌های صنعتی و اپوکسی" },
];

// ۲. گروه‌های فیلتر تخصصی فرعی در صنایع رنگ
export const FILTER_GROUPS = {
  brands: ["فیضی دکوراتیو", "فیضی اینداستریال", "فیضی فوری", "فیضی الوان روغنی", "فیضی کمیکال"],
  resin_base: ["رزین آلکیدی", "اکریلیک پایه آب", "رزین اپوکسی", "پلی‌اورتان", "نیتروسلولز"],
  thinner_type: ["آب شرب", "تینر روغنی (وایت اسپریت)", "تینر فوری ۱۰۰۰۰", "تینر فوری ۲۰۰۰۰", "تینر اپوکسی"],
  packaging: ["۱ لیتری (کوارت)", "۴ لیتری (گالن)", "۲۰ لیتری (حلب)", "دبه ۲۵ کیلویی", "بشکه ۲۲۰ لیتری"],
  gloss_level: ["مات", "نیمه‌براق", "براق", "سوپربراق"],
  status: ["موجود در انبار", "تولید سفارشی", "توقف تولید"]
};

// ۳. لیست محصولات تستی شرکت رنگ افغان فیضی
export const MOCK_PRODUCTS = [
  { 
    id: 1, 
    faTitle: "رنگ روغنی براق آلکیدی ۴ لیتری", 
    enTitle: "Alkyd High-Gloss Oil Paint 4L", 
    brand: "فیضی الوان روغنی", 
    mainCatId: "oil", 
    resinBase: "رزین آلکیدی لانگ اویل", 
    thinnerType: "تینر روغنی فیضی", 
    coverage: "۱۰ تا ۱۲ مترمربع بر لیتر", 
    dryingTime: "۴ ساعت سطحی / ۲۴ ساعت کامل",
    packaging: "۴ لیتری (گالن)", 
    colorCode: "RAL 9010 (سفید براق)",
    status: "موجود در انبار",
    subCategory: "رنگ روغنی براق",
    img: "https://placehold.co/400x400/f8fafc/0f172a?text=Gloss+Paint", 
    isFeatured: true 
  },
  { 
    id: 2, 
    faTitle: "رنگ تمام پلاستیک درجه یک ۲۰ کیلویی", 
    enTitle: "Premium Full Plastic Emulsion 20kg", 
    brand: "فیضی دکوراتیو", 
    mainCatId: "plastic", 
    resinBase: "پلی وینیل استات (PVA)", 
    thinnerType: "آب شرب", 
    coverage: "۸ تا ۱۰ مترمربع بر کیلوگرم", 
    dryingTime: "۳۰ دقیقه سطحی / ۲ ساعت لایه دوم",
    packaging: "۲۰ لیتری (حلب)", 
    colorCode: "سفید مات صدفی",
    status: "موجود در انبار",
    subCategory: "رنگ پلاستیک مات",
    img: "https://placehold.co/400x400/f8fafc/0f172a?text=Plastic+Paint", 
    isFeatured: true 
  },
  { 
    id: 3, 
    faTitle: "سیلر فوری چوب ممتاز ۴ لیتری", 
    enTitle: "Premium Instant Wood Sealer 4L", 
    brand: "فیضی فوری", 
    mainCatId: "instant", 
    resinBase: "نیتروسلولز و آلکید سنتزی", 
    thinnerType: "تینر فوری ۱۰۰۰۰ فیضی", 
    coverage: "۹ تا ۱۱ مترمربع بر لیتر", 
    dryingTime: "۱۰ دقیقه سطحی / ۴۵ دقیقه سنباده‌خوری",
    packaging: "۴ لیتری (گالن)", 
    colorCode: "شفاف بی‌رنگ",
    status: "موجود در انبار",
    subCategory: "سیلر و کیلر فوری",
    img: "https://placehold.co/400x400/f8fafc/0f172a?text=Wood+Sealer", 
    isFeatured: true 
  },
  { 
    id: 4, 
    faTitle: "کفپوش اپوکسی صنعتی بدون حلال", 
    enTitle: "Solvent-Free Industrial Epoxy Flooring", 
    brand: "فیضی اینداستریال", 
    mainCatId: "industrial", 
    resinBase: "رزین اپوکسی بیسفنول A با هاردنر پلی‌آمین", 
    thinnerType: "بدون حلال (۱۰۰٪ جامد)", 
    coverage: "۱.۵ کیلوگرم بر مترمربع در ضخامت ۱ میلی‌متر", 
    dryingTime: "۲۴ ساعت تردد پیاده / ۷ روز پخت نهایی مکانیکی",
    packaging: "ست ۲۰ کیلوگرمی (جزء A + B)", 
    colorCode: "RAL 7035 (طوسی صنعتی)",
    status: "موجود در انبار",
    subCategory: "کفپوش اپوکسی",
    img: "https://placehold.co/400x400/f8fafc/0f172a?text=Epoxy+Floor", 
    isFeatured: true 
  },
  { 
    id: 5, 
    faTitle: "تینر فوری ۲۰۰۰۰ لوساید سوپر", 
    enTitle: "Super Lucite 20000 Instant Thinner", 
    brand: "فیضی کمیکال", 
    mainCatId: "industrial", 
    resinBase: "حلال خالص بدون رطوبت", 
    thinnerType: "حلال خالص تخصصی", 
    coverage: "افزایش جریان‌پذیری و براقیت رنگ", 
    dryingTime: "تبخیر یکنواخت بدون ایجاد ماتی و حباب",
    packaging: "۴ لیتری و ۲۰ لیتری", 
    colorCode: "بی‌رنگ شفاف",
    status: "موجود در انبار",
    subCategory: "تینر و حلال تخصصی",
    img: "https://placehold.co/400x400/f8fafc/0f172a?text=Thinner+20000", 
    isFeatured: false 
  }
];

export const MOCK_MEDIA = [
  {
    id: 1,
    type: "video",
    category: "teaser",
    faTitle: "تیزر معرفی خط تولید رنگ‌های صنعتی و ساختمانی فیضی",
    enTitle: "Afghan Faizi Paint Production Lines Teaser",
    thumbnail: "https://placehold.co/800x600/1e293b/ffffff?text=Factory+Teaser",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    isFeatured: true,
    date: "2026-05-10"
  },
  {
    id: 2,
    type: "album",
    category: "bts",
    faTitle: "آزمایشگاه کنترل کیفی و تست مقاومت سایشی رنگ",
    enTitle: "Quality Control Lab & Paint Testing",
    thumbnail: "https://placehold.co/600x600/f59e0b/ffffff?text=QC+Lab",
    isFeatured: false,
    date: "2026-04-22",
    items: [
      "https://placehold.co/800x600/f59e0b/ffffff?text=Lab+Test+1",
      "https://placehold.co/800x600/ea580c/ffffff?text=Viscosity+Test",
      "https://placehold.co/800x600/dc2626/ffffff?text=Color+Matching"
    ]
  }
];

export const MOCK_BLOG_POSTS = [
  {
    id: 1,
    faTitle: "راهنمای جامع انتخاب رنگ مناسب برای نمای ساختمان در افغانستان",
    enTitle: "Comprehensive Guide to Choosing Exterior Architectural Paint",
    slug: "exterior-paint-guide-afghanistan",
    category: "guide",
    excerpt: "بررسی مقاومت رنگ‌های اکریلیک سیلیکونی در برابر تابش شدید آفتاب، باد و گرد و غبار ولایات مختلف...",
    content: "<p>محتوای تخصصی نقاشی و انتخاب رنگ در اینجا قرار می‌گیرد...</p>",
    coverImage: "https://placehold.co/1200x600/1e293b/ffffff?text=Paint+Guide",
    thumbnailImage: "https://placehold.co/600x600/1e293b/ffffff?text=Paint+Thumb",
    readTime: "۵ دقیقه",
    author: "واحد فنی رنگ افغان فیضی",
    date: "2026-05-20",
    status: "published",
    seo: {
      title: "راهنمای انتخاب رنگ نمای ساختمان | رنگ افغان فیضی",
      description: "نکات مهم در انتخاب رنگ‌های مقاوم در شرایط اقلیمی گرم و سرد افغانستان.",
      keywords: "رنگ نما, رنگ اکریلیک, رنگ ساختمان, افغان فیضی"
    }
  },
  {
    id: 2,
    faTitle: "گزارش حضور شرکت رنگ افغان فیضی در نمایشگاه بین‌المللی کابل",
    enTitle: "Afghan Faizi Paint at Kabul International Trade Expo",
    slug: "afghan-faizi-paint-expo-2026",
    category: "news",
    excerpt: "رونمایی از نسل جدید رنگ‌های آنتی‌باکتریال و کفپوش‌های اپوکسی بدون حلال فیضی در نمایشگاه صنعتی...",
    content: "<p>گزارش کامل غرفه رنگ افغان فیضی در نمایشگاه...</p>",
    coverImage: "https://placehold.co/1200x600/f59e0b/ffffff?text=Faizi+Expo",
    thumbnailImage: "https://placehold.co/600x600/f59e0b/ffffff?text=Expo+Thumb",
    readTime: "۳ دقیقه",
    author: "روابط عمومی رنگ افغان فیضی",
    date: "2026-05-18",
    status: "published",
    seo: {
      title: "حضور رنگ افغان فیضی در نمایشگاه بین‌المللی کابل",
      description: "گزارش تصویری از غرفه شرکت تولیدی رنگ افغان فیضی.",
      keywords: "اخبار, نمایشگاه, رنگ افغان فیضی, کابل"
    }
  }
];

export const MOCK_USERS = [
  {
    id: 1,
    name: "مدیر عامل",
    email: "ceo@afghanfaizipaint.com",
    role: "super_admin",
    status: "active",
    avatar: "https://placehold.co/150x150/c72127/ffffff?text=AFP",
    permissions: ["all"],
    lastLogin: "2026-05-30 10:00",
  },
  {
    id: 2,
    name: "مدیر فروش و بازرگانی",
    email: "sales@afghanfaizipaint.com",
    role: "admin",
    status: "active",
    avatar: "https://placehold.co/150x150/f59e0b/ffffff?text=Sales",
    permissions: ["products", "gallery", "blog", "pricelists"],
    lastLogin: "2026-05-29 14:30",
  },
  {
    id: 3,
    name: "کارشناس تولید و آزمایشگاه",
    email: "lab@afghanfaizipaint.com",
    role: "editor",
    status: "active",
    avatar: "https://placehold.co/150x150/3b82f6/ffffff?text=QC",
    permissions: ["blog", "products"],
    lastLogin: "2026-05-20 09:15",
  }
];
