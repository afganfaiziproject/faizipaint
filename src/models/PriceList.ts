import mongoose, { Schema, Document } from 'mongoose';
import { getAfghanShamsiNow } from '@/lib/dateUtils';

export interface IMultilingualPriceText {
  fa: string;
  en: string;
  ps?: string;
}

export type PriceUserRole = 'consumer' | 'retailer' | 'official_agency';

export interface IPriceListItem {
  productId?: mongoose.Types.ObjectId;
  productCode: string;
  productName: IMultilingualPriceText;
  category: string;
  packagingUnit: string; // لیتر، کیلوگرم، کوارت، گالن، دبه، حلب، بشکه
  unitSize: string; // ۱ لیتری، ۴ کیلوگرمی، ۲۰ لیتری و...
  prices: {
    consumer: number;       // قیمت مصرف‌کننده (خرده‌فروشی)
    retailer: number;       // قیمت فروشنده / همکار رنگ‌فروش
    officialAgency: number; // قیمت نمایندگی رسمی و عاملیت مجاز
  };
  currency: string; // AFN (افغانی) یا USD (دلار)
  discountMaxPercent?: number; // سقف تخفیف مجاز
  isAvailable: boolean;
}

export interface IPriceList extends Document {
  title: IMultilingualPriceText;
  code: string; // کد یکتای نرخنامه مثلاً PL-1405-SPRING
  version: string; // شماره نسخه مثلاً 1.0.0
  
  // نقش‌های کاربری مجاز برای مشاهده این نرخنامه
  allowedRoles: PriceUserRole[];
  
  // لیست ولایات مجاز برای مشاهده قیمت‌ها (منطق دسترسی ولایتی)
  allowedProvinces: string[];
  isAllProvinces: boolean;
  
  // اقلام و قیمت‌های محصولات
  items: IPriceListItem[];
  
  // توضیحات، شرایط پرداخت و حمل و نقل
  notes?: IMultilingualPriceText;
  termsAndConditions?: IMultilingualPriceText;
  
  // تاریخ و ساعت انتشار به تقویم هجری شمسی دری افغانستان (fa-AF)
  publishedAtShamsi: string;
  publishedAtDate: Date;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  
  // وضعیت و قابلیت آرشیو نسخه‌های قدیمی
  status: 'active' | 'archived' | 'draft';
  isArchived: boolean;
  archivedAt?: Date;
  archiveReason?: string;
  
  // پیوست فایل PDF مهر شده و اطلاعات ثبتی
  fileUrl?: string;
  createdBy?: mongoose.Types.ObjectId;
  approvedBy?: string;
}

const MultilingualTextSchema = new Schema({
  fa: { type: String, default: "" },
  en: { type: String, default: "" },
  ps: { type: String, default: "" }
}, { _id: false });

const PriceListItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  productCode: { type: String, default: "" },
  productName: { type: MultilingualTextSchema, required: true },
  category: { type: String, default: "oil" },
  packagingUnit: { type: String, default: "گالن" },
  unitSize: { type: String, default: "۴ لیتری" },
  prices: {
    consumer: { type: Number, required: true, default: 0 },       // قیمت مصرف‌کننده
    retailer: { type: Number, required: true, default: 0 },       // قیمت فروشنده
    officialAgency: { type: Number, required: true, default: 0 }  // قیمت نمایندگی رسمی
  },
  currency: { type: String, default: "AFN" },
  discountMaxPercent: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true }
}, { _id: true });

const PriceListSchema: Schema = new Schema({
  title: { type: MultilingualTextSchema, required: true },
  code: { type: String, required: true, unique: true, index: true },
  version: { type: String, default: "1.0.0" },
  
  // نقش‌های کاربری: مصرف‌کننده، فروشنده، نمایندگی رسمی
  allowedRoles: [{ 
    type: String, 
    enum: ['consumer', 'retailer', 'official_agency'], 
    default: ['consumer', 'retailer', 'official_agency'] 
  }],
  
  // آرایه ولایات مجاز (برای کنترل دسترسی و قیمت‌گذاری اختصاصی هر ولایت)
  allowedProvinces: [{ type: String, index: true }],
  isAllProvinces: { type: Boolean, default: true },
  
  // لیست اقلام و محصولات موجود در نرخنامه
  items: [PriceListItemSchema],
  
  // یادداشت‌ها و شرایط رسمی
  notes: { type: MultilingualTextSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  termsAndConditions: { type: MultilingualTextSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  
  // تاریخ و ساعت ثبت دقیق به تقویم شمسی دری (fa-AF) برای بایگانی دقیق
  publishedAtShamsi: { 
    type: String, 
    default: () => getAfghanShamsiNow(true)
  },
  publishedAtDate: { type: Date, default: Date.now, index: true },
  effectiveFrom: { type: Date, default: Date.now },
  effectiveTo: { type: Date },
  
  // مدیریت وضعیت و بایگانی (Archiving)
  status: { 
    type: String, 
    enum: ['active', 'archived', 'draft'], 
    default: 'active', 
    index: true 
  },
  isArchived: { type: Boolean, default: false, index: true },
  archivedAt: { type: Date },
  archiveReason: { type: String, default: "" },
  
  // فایل PDF نرخنامه رسمی شرکت
  fileUrl: { type: String, default: "" },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: String, default: "مدیریت فروش رنگ افغان فیضی" }
}, { 
  timestamps: true 
});

// پیش از ذخیره، تاریخ شمسی دری افغانستان در صورت عدم مقداردهی به صورت خودکار محاسبه شود
PriceListSchema.pre('save', function () {
  const doc = this as any;
  if (!doc.publishedAtShamsi && doc.publishedAtDate) {
    doc.publishedAtShamsi = getAfghanShamsiNow(true);
  }
  if (doc.isArchived && !doc.archivedAt) {
    doc.archivedAt = new Date();
  }
});

if (mongoose.models.PriceList) {
  delete mongoose.models.PriceList;
}

export default mongoose.models.PriceList || mongoose.model<IPriceList>('PriceList', PriceListSchema);
