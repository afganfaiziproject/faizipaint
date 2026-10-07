import mongoose, { Schema, Document } from 'mongoose';

export interface IMultilingualText {
  fa: string;
  en: string;
  ps?: string;
}

export interface IProductSpecs {
  // پایه رزین (Resin Base)
  resinBase: IMultilingualText;
  
  // نوع حلال / تینر (Solvent / Thinner Type)
  thinnerType: IMultilingualText;
  
  // زمان خشک شدن (Drying Times)
  dryingTime: {
    surfaceDry: IMultilingualText;    // خشک شدن سطحی / لمسی
    fullDry: IMultilingualText;       // خشک شدن نهایی / عمقی
    recoatInterval?: IMultilingualText; // فاصله بین دست‌ها
  };
  
  // میزان پوشش‌دهی متر مربع بر لیتر (Coverage Rate: m²/Liter)
  coverage: IMultilingualText;
  coverageRate?: number;
  
  // کدهای استاندارد رنگ و شید رال (Standard Color Codes / RAL)
  standardCodes: string[];
  colorCode?: string;
  
  // درجه براقیت (Gloss Level)
  glossLevel?: IMultilingualText;
  
  // روش اجرا (Application Method: Brush, Roller, Spray)
  applicationMethod?: IMultilingualText;
  
  // اندازه‌های بسته‌بندی (Packaging Sizes)
  packagingSizes?: string[];
  
  // وزن مخصوص / دانسیته (Density)
  density?: string;
  
  // ویسکوزیته (Viscosity)
  viscosity?: string;
  
  // قابلیت شستشو و مقاومت سایشی (Washability)
  washability?: IMultilingualText;
  
  // شرایط نگهداری و انبارداری (Storage Conditions)
  storageConditions?: IMultilingualText;
  
  // ماندگاری در انبار (Storage Shelf Life)
  shelfLife?: IMultilingualText;
  
  // میزان ترکیبات آلی فرار (VOC Level)
  vocLevel?: string;
}

export interface IProduct extends Document {
  brandId: mongoose.Types.ObjectId;
  
  // فیلدهای چندزبانه اصلی
  title: IMultilingualText;
  faTitle: string;
  enTitle: string;
  psTitle?: string;
  
  slug: string;
  
  // دسته‌بندی‌های تخصصی رنگ: روغنی، پلاستیک، فوری، صنعتی و...
  mainCat: 'oil' | 'plastic' | 'instant' | 'industrial' | 'primers' | 'decorative' | 'tools' | string;
  category: string;
  categoryI18n?: IMultilingualText;
  
  status: 'published' | 'draft' | 'archived';
  isFeatured: boolean;
  order: number;
  
  // توضیحات محصول
  description: IMultilingualText;
  faDesc: string;
  enDesc: string;
  psDesc?: string;
  shortDesc?: IMultilingualText;
  
  // مشخصات فنی تخصصی رنگ
  specs: IProductSpecs;
  
  // تصاویر، کالیته رنگ و برگه فنی (TDS)
  images: {
    main: string;
    gallery: string[];
    colorSwatch?: string;
    datasheetPdf?: string;
  };
  
  // نکات ایمنی و هشدارهای تخصصی کار با رنگ و حلال
  hasWarning: boolean;
  warningMessage?: IMultilingualText;
  warningMessageFa?: string;
  warningMessageEn?: string;
  warningMessagePs?: string;
}

const MultilingualSchema = new Schema({
  fa: { type: String, default: "" },
  en: { type: String, default: "" },
  ps: { type: String, default: "" }
}, { _id: false });

const ProductSchema: Schema = new Schema({
  brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  
  // نام محصول با پشتیبانی کامل از زبان‌های فارسی، انگلیسی و پشتو
  title: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  faTitle: { type: String, required: true },
  enTitle: { type: String, required: true },
  psTitle: { type: String, default: "" },
  
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  
  // دسته‌بندی‌های رنگ
  mainCat: { 
    type: String, 
    required: true, 
    index: true 
  },
  category: { type: String, required: true, index: true },
  categoryI18n: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published', index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  order: { type: Number, default: 0, index: true },
  
  // توضیحات چندزبانه
  description: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  faDesc: { type: String, default: "" },
  enDesc: { type: String, default: "" },
  psDesc: { type: String, default: "" },
  shortDesc: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  
  // تصاویر و اسناد فنی
  images: {
    main: { type: String, required: true },
    gallery: [{ type: String }],
    colorSwatch: { type: String, default: "" },
    datasheetPdf: { type: String, default: "" }
  },
  
  // مشخصات فنی مهندسی رنگ
  specs: {
    // پایه رزین (اکریلیک، آلکیدی، اپوکسی، پلی‌اورتان و...)
    resinBase: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
    
    // نوع حلال / تینر (آب، تینر فوری ۱۰۰۰۰، تینر روغنی، تینر اپوکسی و...)
    thinnerType: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
    
    // زمان خشک شدن
    dryingTime: {
      surfaceDry: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
      fullDry: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
      recoatInterval: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) }
    },
    
    // میزان پوشش‌دهی بر حسب متر مربع بر لیتر (m²/Liter)
    coverage: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
    coverageRate: { type: Number, default: 10 },
    
    // کدهای استاندارد رنگ، رال (RAL) و استانداردهای ملی و بین‌المللی
    standardCodes: [{ type: String }],
    colorCode: { type: String, default: "" },
    
    // درجه براقیت (مات، نیمه‌براق، براق، سوپربراق)
    glossLevel: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
    
    // روش اجرا (قلم‌مو، غلطک، پیستوله/ایرلس)
    applicationMethod: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
    
    // اندازه‌ها و بسته‌بندی‌ها (۱ لیتری، ۴ لیتری/گالن، ۲۰ لیتری/حلب، بشکه)
    packagingSizes: [{ type: String }],
    
    // مشخصات فیزیکی و شیمیایی
    density: { type: String, default: "" },
    viscosity: { type: String, default: "" },
    washability: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
    storageConditions: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
    shelfLife: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
    vocLevel: { type: String, default: "" }
  },
  
  // هشدارها و نکات ایمنی اشتعال‌پذیری و تهویه
  hasWarning: { type: Boolean, default: false },
  warningMessage: { type: MultilingualSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  warningMessageFa: { type: String, default: "" },
  warningMessageEn: { type: String, default: "" },
  warningMessagePs: { type: String, default: "" }
}, { 
  timestamps: true 
});

// همگام‌سازی فیلدهای مستقیم و چندزبانه قبل از ذخیره
ProductSchema.pre('save', function () {
  const doc = this as any;
  if (doc.faTitle && !doc.title?.fa) doc.title.fa = doc.faTitle;
  if (doc.enTitle && !doc.title?.en) doc.title.en = doc.enTitle;
  if (doc.psTitle && !doc.title?.ps) doc.title.ps = doc.psTitle;
  
  if (doc.title?.fa && !doc.faTitle) doc.faTitle = doc.title.fa;
  if (doc.title?.en && !doc.enTitle) doc.enTitle = doc.title.en;
  if (doc.title?.ps && !doc.psTitle) doc.psTitle = doc.title.ps;
  
  if (doc.faDesc && !doc.description?.fa) doc.description.fa = doc.faDesc;
  if (doc.enDesc && !doc.description?.en) doc.description.en = doc.enDesc;
  if (doc.psDesc && !doc.description?.ps) doc.description.ps = doc.psDesc;
});

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);