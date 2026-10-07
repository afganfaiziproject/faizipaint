import mongoose, { Schema, Document } from 'mongoose';

export interface IAgencyForm extends Document {
  name: string;
  phone: string;
  province: string;
  city: string;
  businessName?: string;
  businessType?: 'retail_shop' | 'wholesaler' | 'contractor' | 'hardware_store' | 'other';
  warehouseCapacity?: string;
  estimatedMonthlySales?: string;
  experience: string;
  description: string;
  status: 'unread' | 'reviewed' | 'approved' | 'rejected';
}

const AgencyFormSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  province: { type: String, required: true, index: true },
  city: { type: String, required: true },
  businessName: { type: String, default: "" },
  businessType: { 
    type: String, 
    enum: ['retail_shop', 'wholesaler', 'contractor', 'hardware_store', 'other'], 
    default: 'retail_shop' 
  },
  warehouseCapacity: { type: String, default: "" },
  estimatedMonthlySales: { type: String, default: "" },
  experience: { type: String, default: "" },
  description: { type: String, default: "" },
  status: { type: String, enum: ['unread', 'reviewed', 'approved', 'rejected'], default: 'unread', index: true }
}, { timestamps: true });

if (mongoose.models.AgencyForm) {
  delete mongoose.models.AgencyForm;
}

export default mongoose.models.AgencyForm || mongoose.model<IAgencyForm>('AgencyForm', AgencyFormSchema);