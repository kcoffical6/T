import mongoose, { Document, Schema } from 'mongoose';

export interface SavedPassenger {
  name: string;
  age: number;
  passport?: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  country: string;
  passwordHash: string;
  role: 'user' | 'admin' | 'super_admin' | 'driver';
  savedPassengers: SavedPassenger[];
  isActive: boolean;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SavedPassengerSchema = new Schema<SavedPassenger>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  passport: { type: String }
}, { timestamps: true });

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'admin', 'super_admin', 'driver'],
    default: 'user'
  },
  savedPassengers: { type: [SavedPassengerSchema], default: [] },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  emailVerifiedAt: { type: Date },
  phoneVerifiedAt: { type: Date }
}, { timestamps: true });

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
