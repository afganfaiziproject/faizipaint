import mongoose from "mongoose";

const MultilingualSlideText = new mongoose.Schema({
  fa: { type: String, default: "" },
  en: { type: String, default: "" },
  ps: { type: String, default: "" }
}, { _id: false });

const heroSlideSchema = new mongoose.Schema(
  {
    id: { type: Number },
    title: { type: MultilingualSlideText, default: () => ({ fa: "", en: "", ps: "" }) },
    faTitle: { type: String, required: true },
    enTitle: { type: String, required: true },
    psTitle: { type: String, default: "" },

    subtitle: { type: MultilingualSlideText, default: () => ({ fa: "", en: "", ps: "" }) },
    faSubtitle: { type: String, default: "" },
    enSubtitle: { type: String, default: "" },
    psSubtitle: { type: String, default: "" },

    desc: { type: MultilingualSlideText, default: () => ({ fa: "", en: "", ps: "" }) },
    faDesc: { type: String, default: "" },
    enDesc: { type: String, default: "" },
    psDesc: { type: String, default: "" },

    color: { type: String, default: "from-blue-600 to-cyan-500" },
    mainImage: { type: String },
    leftImage: { type: String },
    rightImage: { type: String },
    floaters: [{ type: mongoose.Schema.Types.Mixed }],
    
    // نوع اتصال دکمه: برند/خط تولید، دسته‌بندی یا محصول تکی
    linkType: { type: String, enum: ['brand', 'category', 'product'], default: 'product' },
    
    // متن شخصی‌سازی شده دکمه
    buttonText: { type: MultilingualSlideText, default: () => ({ fa: "مشاهده محصولات رنگ", en: "View Paint Products", ps: "د رنګ محصولات کتل" }) },
    faButtonText: { type: String, default: "مشاهده محصولات رنگ" },
    enButtonText: { type: String, default: "View Paint Products" },
    psButtonText: { type: String, default: "د رنګ محصولات کتل" },

    // اتصال بر اساس برند یا خط تولید
    linkedBrand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    linkedBrandSlug: { type: String },

    // اتصال بر اساس دسته‌بندی رنگ
    linkedCategorySlug: { type: String },

    // اتصال بر اساس محصول خاص
    linkedProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    linkedProductSlug: { type: String },

    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

heroSlideSchema.pre('save', function () {
  const doc = this as any;
  if (doc.faTitle && !doc.title?.fa) doc.title.fa = doc.faTitle;
  if (doc.enTitle && !doc.title?.en) doc.title.en = doc.enTitle;
  if (doc.psTitle && !doc.title?.ps) doc.title.ps = doc.psTitle;
});

if (mongoose.models.HeroSlide) {
  delete mongoose.models.HeroSlide;
}

export default mongoose.models.HeroSlide || mongoose.model("HeroSlide", heroSlideSchema);