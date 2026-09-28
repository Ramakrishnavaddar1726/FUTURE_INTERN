import mongoose, { Document, Schema } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Converted';
export type LeadSource = 'Website Contact Form' | 'Referral' | 'Social Media' | 'Advertisement' | 'Other';
export type LeadPriority = 'Low' | 'Medium' | 'High';

export interface ILead extends Document {
  supabaseId?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  lastContactedAt?: Date;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Valid email required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    company: {
      type: String,
      default: 'Independent',
      trim: true,
    },
    service: {
      type: String,
      default: 'General Inquiry',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Inquiry message is required'],
    },
    source: {
      type: String,
      enum: ['Website Contact Form', 'Referral', 'Social Media', 'Advertisement', 'Other'],
      default: 'Website Contact Form',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted'],
      default: 'New',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    lastContactedAt: {
      type: Date,
    },
    followUpDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ name: 'text', email: 'text', company: 'text', phone: 'text' });

export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema);
