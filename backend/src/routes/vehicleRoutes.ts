import { Router, Request, Response, NextFunction } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  toggleVehicleAvailability,
} from "../controllers/vehicleController";
import { authMiddleware } from "../middleware/auth";
import mongoose from "mongoose";

const router = Router();

// Validation middleware
const validateVehicle = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];
  const {
    make,
    vehicleModel,
    year,
    type,
    seatingCapacity,
    basePricePerDay,
    driver,
    features = [],
    images = [],
  } = req.body;

  // Basic validation
  if (!make || typeof make !== "string") errors.push("Make is required");
  if (!vehicleModel || typeof vehicleModel !== "string")
    errors.push("Model is required");

  const currentYear = new Date().getFullYear();
  if (!year || isNaN(Number(year)) || year < 1900 || year > currentYear + 1) {
    errors.push(`Year must be between 1900 and ${currentYear + 1}`);
  }

  const validTypes = ["sedan", "suv", "van", "luxury", "bus"];
  if (!type || !validTypes.includes(type)) {
    errors.push(`Type must be one of: ${validTypes.join(", ")}`);
  }

  if (
    !seatingCapacity ||
    isNaN(Number(seatingCapacity)) ||
    seatingCapacity < 1
  ) {
    errors.push("Seating capacity must be at least 1");
  }

  if (
    !basePricePerDay ||
    isNaN(Number(basePricePerDay)) ||
    basePricePerDay < 0
  ) {
    errors.push("Base price must be a positive number");
  }

  // Driver validation
  if (!driver || typeof driver !== "object") {
    errors.push("Driver information is required");
  } else {
    if (!driver.name || typeof driver.name !== "string") {
      errors.push("Driver name is required");
    }
    if (!driver.mobile || !/^[0-9]{10}$/.test(driver.mobile)) {
      errors.push("Please enter a valid 10-digit mobile number");
    }
    if (
      driver.experience === undefined ||
      isNaN(Number(driver.experience)) ||
      driver.experience < 0
    ) {
      errors.push("Experience must be a positive number");
    }
    if (!driver.licenseNumber || typeof driver.licenseNumber !== "string") {
      errors.push("License number is required");
    }
  }

  if (!Array.isArray(features)) errors.push("Features must be an array");
  if (!Array.isArray(images)) errors.push("Images must be an array");

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Validate MongoDB ID
const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid vehicle ID",
    });
  }
  next();
};

// Public routes
router.get("/", getVehicles);
router.get("/:id", validateId, getVehicleById);

// Protected routes (require authentication)
router.use(authMiddleware);

router.post("/", validateVehicle, createVehicle);
router.put("/:id", [validateId, validateVehicle], updateVehicle);
router.delete("/:id", validateId, deleteVehicle);
router.patch("/:id/availability", validateId, toggleVehicleAvailability);

export default router;
