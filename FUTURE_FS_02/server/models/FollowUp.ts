import mongoose, { Document, Schema } from 'mongoose';

export type FollowUpPriority = 'Low' | 'Medium' | 'High';
export type FollowUpStatus = 'Pending' | 'Completed';

export interface IFollowUp extends Document {
  leadId: mongoose.Types.ObjectId | string;
  leadName?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  description: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const followUpSchema = new Schema<IFollowUp>(
  {
    leadId: {
      type: Schema.Types.Mixed,
      required: [true, 'Lead ID is required'],
      index: true,
    },
    leadName: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Follow-up date is required'],
    },
    time: {
      type: String,
      default: '10:00 AM',
    },
    description: {
      type: String,
      required: [true, 'Follow-up description is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
    createdBy: {
      type: String,
      default: 'Admin User',
    },
  },
  {
    timestamps: true,
  }
);

export const FollowUp = mongoose.models.FollowUp || mongoose.model<IFollowUp>('FollowUp', followUpSchema);
