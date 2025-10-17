import mongoose, { Document, Schema } from 'mongoose';

export interface Passenger {
  name: string;
  age: number;
  passport?: string;
}

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  passengers: Passenger[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookingDate: Date;
  travelDate: Date;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PassengerSchema = new Schema<Passenger>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  passport: { type: String }
});

const BookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  passengers: { type: [PassengerSchema], required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    required: true, 
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  bookingDate: { type: Date, required: true },
  travelDate: { type: Date, required: true },
  specialRequests: { type: String }
}, { timestamps: true });

// Indexes
BookingSchema.index({ userId: 1 });
BookingSchema.index({ packageId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ bookingDate: -1 });
BookingSchema.index({ travelDate: 1 });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
