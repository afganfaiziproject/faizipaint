import mongoose, { Schema, Document } from 'mongoose';

export interface IMultilingualBlogText {
  fa: string;
  en: string;
  ps?: string;
}

export interface IBlog extends Document {
  slug: string;
  title: IMultilingualBlogText;
  faTitle: string;
  enTitle: string;
  psTitle?: string;
  category: 'architectural' | 'industrial' | 'wood_finishing' | 'guide' | 'news' | 'products' | string;
  excerpt: IMultilingualBlogText;
  faExcerpt?: string;
  enExcerpt?: string;
  psExcerpt?: string;
  content: IMultilingualBlogText;
  faContent?: string;
  enContent?: string;
  psContent?: string;
  readTime: string;
  author: string;
  status: 'published' | 'draft';
  coverImage: string;
  thumbnailImage: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const MultilingualBlogSchema = new Schema({
  fa: { type: String, default: "" },
  en: { type: String, default: "" },
  ps: { type: String, default: "" }
}, { _id: false });

const BlogSchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  title: { type: MultilingualBlogSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  faTitle: { type: String, required: true },
  enTitle: { type: String, required: true },
  psTitle: { type: String, default: "" },
  
  category: { 
    type: String, 
    enum: ['architectural', 'industrial', 'wood_finishing', 'guide', 'news', 'products', 'health'], 
    default: 'guide' 
  },
  
  excerpt: { type: MultilingualBlogSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  faExcerpt: { type: String, default: "" },
  enExcerpt: { type: String, default: "" },
  psExcerpt: { type: String, default: "" },
  
  content: { type: MultilingualBlogSchema, default: () => ({ fa: "", en: "", ps: "" }) },
  faContent: { type: String, default: "" },
  enContent: { type: String, default: "" },
  psContent: { type: String, default: "" },
  
  readTime: { type: String, default: "۵ دقیقه" },
  author: { type: String, default: "تحریریه رنگ افغان فیضی" },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  coverImage: { type: String, required: true },
  thumbnailImage: { type: String, required: true },
  seo: {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: String, default: "" }
  }
}, { timestamps: true });

BlogSchema.pre('save', function () {
  const doc = this as any;
  if (doc.faTitle && !doc.title?.fa) doc.title.fa = doc.faTitle;
  if (doc.enTitle && !doc.title?.en) doc.title.en = doc.enTitle;
  if (doc.psTitle && !doc.title?.ps) doc.title.ps = doc.psTitle;
  
  if (doc.title?.fa && !doc.faTitle) doc.faTitle = doc.title.fa;
  if (doc.title?.en && !doc.enTitle) doc.enTitle = doc.title.en;
  if (doc.title?.ps && !doc.psTitle) doc.psTitle = doc.title.ps;
});

if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);