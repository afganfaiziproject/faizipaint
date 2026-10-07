import mongoose, { Schema, Document } from 'mongoose';

export interface IMultilingualCategoryText {
  fa: string;
  en: string;
  ps?: string;
}

export interface ICategory extends Document {
  slug: string;
  name: IMultilingualCategoryText;
  faName: string;
  enName: string;
  psName?: string;
  description?: IMultilingualCategoryText;
  // دسته‌بندی‌های مادر در شرکت رنگ: روغنی، پلاستیک، فوری، صنعتی، پایه‌های رزین، حلال‌ها، بسته‌بندی، براقیت و...
  parent: 'oil' | 'plastic' | 'instant' | 'industrial' | 'primers' | 'decorative' | 'tools' | 'resin_base' | 'thinner_type' | 'packaging' | 'gloss_level' | 'status' | 'media' | 'all' | string;
  iconName: string;
  order: number;
  status: 'active' | 'inactive';
}

const MultilingualCategorySchema = new Schema({
  fa: { type: String, default: "" },
  en: { type: String, default: "" },
  ps: { type: String, default: "" }
}, { _id: false });

const CategorySchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true, index: true, lowercase: true },
  name: { type: MultilingualCategorySchema, default: () => ({ fa: "", en: "", ps: "" }) },
  faName: { type: String, required: true },
  enName: { type: String, required: true },
  psName: { type: String, default: "" },
  description: { type: MultilingualCategorySchema, default: () => ({ fa: "", en: "", ps: "" }) },
  parent: { type: String, required: true, index: true },
  iconName: { type: String, default: "Layers" },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

CategorySchema.pre('save', function () {
  const doc = this as any;
  if (doc.faName && !doc.name?.fa) doc.name.fa = doc.faName;
  if (doc.enName && !doc.name?.en) doc.name.en = doc.enName;
  if (doc.psName && !doc.name?.ps) doc.name.ps = doc.psName;
  
  if (doc.name?.fa && !doc.faName) doc.faName = doc.name.fa;
  if (doc.name?.en && !doc.enName) doc.enName = doc.name.en;
  if (doc.name?.ps && !doc.psName) doc.psName = doc.name.ps;
});

if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);