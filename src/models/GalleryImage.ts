import mongoose, { Schema, Model } from 'mongoose';

export interface IGalleryImage {
  userId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  prompt: string;
  isUnlocked: boolean;
  unlockGameType: 'scratch' | 'puzzle';
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  prompt: {
    type: String,
    required: true,
  },
  isUnlocked: {
    type: Boolean,
    default: false,
  },
  unlockGameType: {
    type: String,
    enum: ['scratch', 'puzzle'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

GalleryImageSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const GalleryImage: Model<IGalleryImage> = 
  mongoose.models.GalleryImage || mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
