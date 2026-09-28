import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  leadId: mongoose.Types.ObjectId | string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    leadId: {
      type: Schema.Types.Mixed,
      required: [true, 'Lead ID is required'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Note content cannot be empty'],
      trim: true,
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

export const Note = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);
