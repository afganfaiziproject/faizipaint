import mongoose, { Schema, Document } from 'mongoose';

export interface IMultilingualBrandText {
  fa: string;
  en: string;
  ps?: string;
}

export interface IBrand extends Document {
  slug: string;
  name: IMultilingualBrandText;
  faName: string;
  enName: string;
  psName?: string;
  slogan: IMultilingualBrandText;
  faSlogan: string;
  enSlogan: string;
  psSlogan?: string;
  description?: IMultilingualBrandText;
  logo: string;
  logoFa: string;
  logoEn: string;
  logoPs?: string;
  heroImage: string;
  color: string;
  order: number;
  status: 'active' | 'inactive';
}

const MultilingualBrandSchema = new Schema({
  fa: { type: String, default: "" },
  en: { type: String, default: "" },
  ps: { type: String, default: "" }
}, { _id: false });

const BrandSchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  name: { type: MultilingualBrandSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  faName: { type: String, required: true },
  enName: { type: String, required: true },
  psName: { type: String, default: "" },
  slogan: { type: MultilingualBrandSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  faSlogan: { type: String, default: "" },
  enSlogan: { type: String, default: "" },
  psSlogan: { type: String, default: "" },
  description: { type: MultilingualBrandSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  logo: { type: String, required: true },
  logoFa: { type: String, default: "" },
  logoEn: { type: String, default: "" },
  logoPs: { type: String, default: "" },
  heroImage: { type: String, default: "" },
  color: { type: String, default: "from-blue-500 to-indigo-700" },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { 
  timestamps: true 
});

BrandSchema.pre('save', function () {
  const doc = this as any;
  if (doc.faName && !doc.name?.fa) doc.name.fa = doc.faName;
  if (doc.enName && !doc.name?.en) doc.name.en = doc.enName;
  if (doc.psName && !doc.name?.ps) doc.name.ps = doc.psName;
  
  if (doc.name?.fa && !doc.faName) doc.faName = doc.name.fa;
  if (doc.name?.en && !doc.enName) doc.enName = doc.name.en;
  if (doc.name?.ps && !doc.psName) doc.psName = doc.name.ps;

  if (doc.faSlogan && !doc.slogan?.fa) doc.slogan.fa = doc.faSlogan;
  if (doc.enSlogan && !doc.slogan?.en) doc.slogan.en = doc.enSlogan;
  if (doc.psSlogan && !doc.slogan?.ps) doc.slogan.ps = doc.psSlogan;
});

if (mongoose.models.Brand) {
  delete mongoose.models.Brand;
}

export default mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);