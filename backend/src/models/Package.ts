import mongoose, { Document, Schema } from 'mongoose';

export interface ItineraryDay {
  day: number;
  activities: string[];
  accommodation?: string;
  meals: string[];
  notes?: string;
}

export interface IPackage extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  itinerary: ItineraryDay[];
  minPax: number;
  maxPax: number;
  basePricePerPax: number;
  images: string[];
  region: 'kerala' | 'tamil-nadu' | 'karnataka' | 'pondicherry' | 'andhra-pradesh';
  tags: string[];
  featured: boolean;
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy?: string;
  termsAndConditions?: string;
  commissionOverride?: number;
  isActive: boolean;
  viewCount: number;
  bookingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItineraryDaySchema = new Schema<ItineraryDay>({
  day: { type: Number, required: true },
  activities: { type: [String], required: true },
  accommodation: { type: String },
  meals: { type: [String], default: [] },
  notes: { type: String }
}, { timestamps: true });

const PackageSchema = new Schema<IPackage>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDesc: { type: String, required: true },
  longDesc: { type: String, required: true },
  itinerary: { type: [ItineraryDaySchema], required: true },
  minPax: { type: Number, required: true, min: 1 },
  maxPax: { type: Number, required: true, min: 1 },
  basePricePerPax: { type: Number, required: true, min: 0 },
  images: { type: [String], default: [] },
  region: { 
    type: String, 
    required: true,
    enum: ['kerala', 'tamil-nadu', 'karnataka', 'pondicherry', 'andhra-pradesh']
  },
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  inclusions: { type: [String], default: [] },
  exclusions: { type: [String], default: [] },
  cancellationPolicy: { type: String },
  termsAndConditions: { type: String },
  commissionOverride: { type: Number, min: 0, max: 100 },
  isActive: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  bookingCount: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes
PackageSchema.index({ slug: 1 }, { unique: true });
PackageSchema.index({ region: 1 });
PackageSchema.index({ featured: 1 });
PackageSchema.index({ isActive: 1 });
PackageSchema.index({ basePricePerPax: 1 });
PackageSchema.index({ createdAt: -1 });
PackageSchema.index({ title: 'text', shortDesc: 'text', longDesc: 'text' });

export const Package = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
