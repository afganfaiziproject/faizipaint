/**
 * Afghan Solar Hijri (تقویم هجری شمسی دری افغانستان) Date Utilities
 * Afghan Faizi Paint - PriceList & System Dates
 */

export const AFGHAN_DARI_MONTHS = [
  "حمل",    // 1 - Farvardin / Aries
  "ثور",    // 2 - Ordibehesht / Taurus
  "جوزا",   // 3 - Khordad / Gemini
  "سرطان",  // 4 - Tir / Cancer
  "اسد",    // 5 - Mordad / Leo
  "سنبله",  // 6 - Shahrivar / Virgo
  "میزان",  // 7 - Mehr / Libra
  "عقرب",   // 8 - Aban / Scorpio
  "قوس",    // 9 - Azar / Sagittarius
  "جدی",    // 10 - Dey / Capricorn
  "دلو",    // 11 - Bahman / Aquarius
  "حوت"     // 12 - Esfand / Pisces
];

export const AFGHAN_PASHTO_MONTHS = [
  "وری",     // 1
  "غویی",    // 2
  "غبرګولی",  // 3
  "چنګاښ",   // 4
  "زمرری",    // 5
  "وږی",     // 6
  "تله",     // 7
  "لړم",     // 8
  "لیندۍ",   // 9
  "مرغومی",  // 10
  "سلواغه",  // 11
  "کب"       // 12
];

export const AFGHAN_PROVINCES = [
  { id: "kabul", faName: "کابل", enName: "Kabul", psName: "کابل" },
  { id: "herat", faName: "هرات", enName: "Herat", psName: "هرات" },
  { id: "balkh", faName: "بلخ (مزار شریف)", enName: "Balkh (Mazar-i-Sharif)", psName: "بلخ" },
  { id: "kandahar", faName: "قندهار", enName: "Kandahar", psName: "کندهار" },
  { id: "nangarhar", faName: "ننگرهار (جلال‌آباد)", enName: "Nangarhar (Jalalabad)", psName: "ننګرهار" },
  { id: "badakhshan", faName: "بدخشان", enName: "Badakhshan", psName: "بدخشان" },
  { id: "baghlan", faName: "بغلان", enName: "Baghlan", psName: "بغلان" },
  { id: "bamyan", faName: "بامیان", enName: "Bamyan", psName: "بامیان" },
  { id: "daykundi", faName: "دایکندی", enName: "Daykundi", psName: "دایکنډي" },
  { id: "farah", faName: "فراه", enName: "Farah", psName: "فراه" },
  { id: "faryab", faName: "فاریاب", enName: "Faryab", psName: "فاریاب" },
  { id: "ghazni", faName: "غزنی", enName: "Ghazni", psName: "غزني" },
  { id: "ghor", faName: "غور", enName: "Ghor", psName: "غور" },
  { id: "helmand", faName: "هلمند", enName: "Helmand", psName: "هلمند" },
  { id: "jawzjan", faName: "جوزجان", enName: "Jawzjan", psName: "جوزجان" },
  { id: "kapisa", faName: "کاپیسا", enName: "Kapisa", psName: "کاپیسا" },
  { id: "khost", faName: "خوست", enName: "Khost", psName: "خوست" },
  { id: "kunar", faName: "کنر", enName: "Kunar", psName: "کونړ" },
  { id: "kunduz", faName: "کندز", enName: "Kunduz", psName: "کندوز" },
  { id: "laghman", faName: "لغمان", enName: "Laghman", psName: "لغمان" },
  { id: "logar", faName: "لوگر", enName: "Logar", psName: "لوګر" },
  { id: "nimruz", faName: "نیمروز", enName: "Nimruz", psName: "نیمروز" },
  { id: "nuristan", faName: "نورستان", enName: "Nuristan", psName: "نورستان" },
  { id: "paktia", faName: "پکتیا", enName: "Paktia", psName: "پکتیا" },
  { id: "paktika", faName: "پکتیکا", enName: "Paktika", psName: "پکتیکا" },
  { id: "panjshir", faName: "پنجشیر", enName: "Panjshir", psName: "پنجشېر" },
  { id: "parwan", faName: "پروان", enName: "Parwan", psName: "پروان" },
  { id: "samangan", faName: "سمنگان", enName: "Samangan", psName: "سمنګان" },
  { id: "sar-e-pol", faName: "سرپل", enName: "Sar-e Pol", psName: "سرپل" },
  { id: "takhar", faName: "تخار", enName: "Takhar", psName: "تخار" },
  { id: "uruzgan", faName: "ارزگان", enName: "Uruzgan", psName: "روزګان" },
  { id: "wardak", faName: "میدان وردک", enName: "Maidan Wardak", psName: "میدان وردګ" },
  { id: "zabul", faName: "زابل", enName: "Zabul", psName: "زابل" },
  { id: "badghis", faName: "بادغیس", enName: "Badghis", psName: "بادغیس" }
];

/**
 * Format a Date into full Afghan Dari Shamsi representation:
 * Example: "۱۵ حمل ۱۴۰۵ - ساعت ۱۶:۳۰"
 */
export function formatAfghanShamsiDate(
  dateInput: Date | string | number = new Date(),
  locale: 'fa-AF' | 'ps-AF' | 'en' = 'fa-AF',
  includeTime: boolean = true
): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  try {
    const formatter = new Intl.DateTimeFormat(locale === 'ps-AF' ? 'ps-AF-u-ca-persian' : 'fa-AF-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime ? {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      } : {})
    });
    return formatter.format(date);
  } catch {
    // Fallback if environment doesn't have full ICU data
    const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
    return parts;
  }
}

/**
 * Get current Afghan Solar Hijri string for PriceList publishing
 */
export function getAfghanShamsiNow(includeTime: boolean = true): string {
  return formatAfghanShamsiDate(new Date(), 'fa-AF', includeTime);
}
