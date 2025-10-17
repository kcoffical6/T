// Shared types for XYZ Tours and Travels

export interface Package {
  _id: string;
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  itinerary: ItineraryDay[];
  minPax: number;
  maxPax: number;
  basePricePerPax: number;
  images: string[];
  region: string;
  tags: string[];
  featured: boolean;
  inclusions?: string[];
  exclusions?: string[];
  cancellationPolicy?: string;
  termsAndConditions?: string;
  commissionOverride?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  day: number;
  activities: string[];
  accommodation?: string;
  meals: string[];
  notes?: string;
}

export interface Vehicle {
  _id: string;
  type: 'sedan' | 'suv' | '7-seater' | 'tempo-traveller' | 'minibus' | 'bus';
  capacity: number;
  luggageCapacity: string;
  ac: boolean;
  regNo: string;
  images: string[];
  status: 'active' | 'inactive' | 'maintenance';
  availability: AvailabilityBlock[];
  assignedDriverId?: string;
  createdAt: string;
}

export interface AvailabilityBlock {
  startDate: string;
  endDate: string;
  reason: string;
  blockedBy: string;
  blockedAt: string;
}

export interface Driver {
  _id: string;
  name: string;
  phone: string;
  licenseNo: string;
  vehicleIds: string[];
  availability: boolean;
  rating: number;
  totalTrips: number;
  totalKm: number;
  reviewCount: number;
  address?: string;
  emergencyContact?: string;
  licenseExpiry?: string;
  lastTripDate?: string;
  isActive: boolean;
  profileImage?: string;
  languages: string[];
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  role: 'user' | 'admin' | 'super_admin' | 'driver';
  savedPassengers: SavedPassenger[];
  isActive: boolean;
  lastLoginAt?: string;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
  createdAt: string;
}

export interface SavedPassenger {
  name: string;
  age: number;
  passport?: string;
}

export interface Booking {
  _id: string;
  userId?: string;
  guestInfo: GuestInfo;
  packageId: string;
  vehicleId?: string;
  pickupLocation: string;
  dropLocation: string;
  startDateTime: string;
  returnDateTime: string;
  paxCount: number;
  baseAmount: number;
  taxes: number;
  userVisibleAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  totalAmount: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  approvalNote?: string;
  paymentRequestId?: string;
  paymentRequestedAt?: string;
  paymentConfirmedAt?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending_approval' | 'approved_pending_payment' | 'payment_pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled' | 'rejected';
  auditLogs: AuditLog[];
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  country: string;
  passengers: SavedPassenger[];
}

export interface AuditLog {
  actorId: string;
  action: string;
  meta?: any;
  timestamp: string;
}

export interface PaymentRequest {
  id: string;
  bookingId: string;
  method: 'upi' | 'psp';
  qr?: string;
  link?: string;
  amount: number;
  currency: string;
  expiresAt: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  paymentId?: string;
  paidAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  paymentProof?: any;
  attemptCount: number;
  lastAttemptAt?: string;
}

export interface DriverAssignment {
  _id: string;
  bookingId: string;
  driverId: string;
  vehicleId: string;
  status: 'assigned' | 'accepted' | 'started' | 'completed';
  pickupLocation: string;
  dropLocation: string;
  startDateTime: string;
  returnDateTime: string;
  passengerInfo: GuestInfo;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface CreateBookingRequest {
  packageId: string;
  pickupLocation: string;
  dropLocation: string;
  startDateTime: string;
  returnDateTime: string;
  paxCount: number;
  guestInfo: GuestInfo;
  specialRequests?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  country: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Filter types
export interface PackageFilters {
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  minPax?: number;
  featured?: boolean;
  search?: string;
}

export interface BookingFilters {
  status?: string;
  approvalStatus?: string;
  userId?: string;
}

// Utility types
export type BookingStatus = Booking['status'];
export type ApprovalStatus = Booking['approvalStatus'];
export type PaymentStatus = Booking['paymentStatus'];
export type UserRole = User['role'];
export type VehicleType = Vehicle['type'];
export type VehicleStatus = Vehicle['status'];

// Constants
export const REGIONS = ['kerala', 'tamil-nadu', 'karnataka', 'pondicherry', 'andhra-pradesh'] as const;
export const VEHICLE_TYPES = ['sedan', 'suv', '7-seater', 'tempo-traveller', 'minibus', 'bus'] as const;
export const USER_ROLES = ['user', 'admin', 'super_admin', 'driver'] as const;
export const BOOKING_STATUSES = [
  'pending_approval',
  'approved_pending_payment',
  'payment_pending',
  'confirmed',
  'ongoing',
  'completed',
  'cancelled',
  'rejected'
] as const;
