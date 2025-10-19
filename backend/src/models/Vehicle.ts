import mongoose, { Document, Schema } from "mongoose";

export interface IDriver {
  name: string;
  mobile: string;
  experience: number; // in years
  licenseNumber: string;
  description?: string;
  image?: string;
}

export interface IVehicle extends Document {
  _id: mongoose.Types.ObjectId;
  make: string;
  vehicleModel: string; // Changed from 'model' to avoid conflict with Document's model property
  year: number;
  type: string;
  seatingCapacity: number;
  features: string[];
  description: string;
  images: string[];
  isAvailable: boolean;
  basePricePerDay: number;
  driver: IDriver;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  mobile: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  experience: {
    type: Number,
    required: true,
    min: [0, "Experience cannot be negative"],
  },
  licenseNumber: {
    type: String,
    required: true,
    uppercase: true,
  },
  description: String,
  image: String,
});

const VehicleSchema = new Schema<IVehicle>(
  {
    make: { type: String, required: true },
    vehicleModel: { type: String, required: true, field: "model" },
    year: {
      type: Number,
      required: true,
      min: [1900, "Year must be after 1900"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    type: {
      type: String,
      required: true,
      enum: ["sedan", "suv", "van", "luxury", "bus"],
    },
    seatingCapacity: {
      type: Number,
      required: true,
      min: [1, "Seating capacity must be at least 1"],
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: (features: string[]) => features.length <= 20,
        message: "Cannot have more than 20 features",
      },
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot be longer than 1000 characters"],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images: string[]) => images.length <= 10,
        message: "Cannot have more than 10 images",
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    basePricePerDay: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    driver: {
      type: DriverSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc: any, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
VehicleSchema.index({ make: 1, vehicleModel: 1 });

// Virtual for the original 'model' field to maintain backward compatibility
VehicleSchema.virtual("model")
  .get(function (this: IVehicle) {
    return this.vehicleModel;
  })
  .set(function (this: IVehicle, value: string) {
    this.vehicleModel = value;
  });
VehicleSchema.index({ type: 1 });
VehicleSchema.index({ isAvailable: 1 });
VehicleSchema.index({ "driver.name": "text", description: "text" });

export const Vehicle =
  mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", VehicleSchema);
