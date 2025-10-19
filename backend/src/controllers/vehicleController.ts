import { Request, Response } from "express";
import { Vehicle, IVehicle } from "../models/Vehicle";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      make,
      model,
      year,
      type,
      seatingCapacity,
      features = [],
      description,
      images = [],
      isAvailable = true,
      basePricePerDay,
      driver,
    } = req.body;

    // Input validation
    const errors: string[] = [];

    if (!make || typeof make !== "string") {
      errors.push("Valid make is required");
    }
    if (!model || typeof model !== "string") {
      errors.push("Valid model is required");
    }
    if (
      !year ||
      isNaN(Number(year)) ||
      year < 1900 ||
      year > new Date().getFullYear() + 1
    ) {
      errors.push("Valid year is required (1900 - current year + 1)");
    }
    if (!type || typeof type !== "string") {
      errors.push("Valid vehicle type is required");
    }
    if (
      !seatingCapacity ||
      isNaN(Number(seatingCapacity)) ||
      seatingCapacity <= 0
    ) {
      errors.push(
        "Valid seating capacity is required and must be a positive number"
      );
    }
    if (!description || typeof description !== "string") {
      errors.push("Valid description is required");
    }
    if (!Array.isArray(features) || features.length > 20) {
      errors.push("Features must be an array with a maximum of 20 items");
    }
    if (!Array.isArray(images) || images.length > 10) {
      errors.push("Images must be an array with a maximum of 10 items");
    }
    if (typeof isAvailable !== "boolean") {
      errors.push("isAvailable must be a boolean");
    }
    if (
      !basePricePerDay ||
      isNaN(Number(basePricePerDay)) ||
      basePricePerDay < 0
    ) {
      errors.push(
        "Valid base price per day is required and must be a non-negative number"
      );
    }
    if (
      !driver ||
      typeof driver !== "object" ||
      !driver.name ||
      !driver.mobile ||
      !driver.experience ||
      !driver.licenseNumber
    ) {
      errors.push(
        "Valid driver information is required including name, mobile, experience, and license number"
      );
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const vehicleData: Partial<IVehicle> = {
      make,
      model,
      year: Number(year),
      type,
      seatingCapacity: Number(seatingCapacity),
      features: features as string[],
      description,
      images: images as string[],
      isAvailable: Boolean(isAvailable),
      basePricePerDay: Number(basePricePerDay),
      driver: {
        name: driver.name,
        mobile: driver.mobile,
        experience: Number(driver.experience),
        licenseNumber: driver.licenseNumber,
        ...(driver.description && { description: driver.description }),
        ...(driver.image && { image: driver.image }),
      },
    };

    const newVehicle = new Vehicle(vehicleData);
    await newVehicle.save();

    res.status(201).json({
      success: true,
      data: newVehicle,
    });
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
      error: error.message,
    });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const { type, minSeats, maxPrice, search, isAvailable } = req.query;
    const query: any = {};

    if (type) query.type = type;
    if (isAvailable) query.isAvailable = isAvailable === "true";
    if (minSeats) query.seatingCapacity = { $gte: Number(minSeats) };
    if (maxPrice)
      query.basePricePerDay = {
        ...query.basePricePerDay,
        $lte: Number(maxPrice),
      };

    if (search) {
      query.$text = { $search: search as string };
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error: any) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error: any) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
      error: error.message,
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Input validation
    const errors: string[] = [];

    // Check if vehicle exists first
    const existingVehicle = await Vehicle.findById(id);
    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Validate update data
    if (updateData.make && typeof updateData.make !== "string") {
      errors.push("Make must be a string");
    }
    if (updateData.model && typeof updateData.model !== "string") {
      errors.push("Model must be a string");
    }
    if (
      updateData.year &&
      (isNaN(Number(updateData.year)) ||
        updateData.year < 1900 ||
        updateData.year > new Date().getFullYear() + 1)
    ) {
      errors.push("Year must be a valid year (1900 - current year + 1)");
    }
    if (updateData.type && typeof updateData.type !== "string") {
      errors.push("Type must be a string");
    }
    if (
      updateData.seatingCapacity &&
      (isNaN(Number(updateData.seatingCapacity)) ||
        updateData.seatingCapacity <= 0)
    ) {
      errors.push("Seating capacity must be a positive number");
    }
    if (
      updateData.features &&
      (!Array.isArray(updateData.features) || updateData.features.length > 20)
    ) {
      errors.push("Features must be an array with a maximum of 20 items");
    }
    if (
      updateData.images &&
      (!Array.isArray(updateData.images) || updateData.images.length > 10)
    ) {
      errors.push("Images must be an array with a maximum of 10 items");
    }
    if (
      updateData.isAvailable !== undefined &&
      typeof updateData.isAvailable !== "boolean"
    ) {
      errors.push("isAvailable must be a boolean");
    }
    if (
      updateData.basePricePerDay &&
      (isNaN(Number(updateData.basePricePerDay)) ||
        updateData.basePricePerDay < 0)
    ) {
      errors.push("Base price per day must be a non-negative number");
    }

    // Validate driver data if provided
    if (updateData.driver) {
      if (typeof updateData.driver !== "object") {
        errors.push("Driver must be an object");
      } else {
        if (
          updateData.driver.name &&
          typeof updateData.driver.name !== "string"
        ) {
          errors.push("Driver name must be a string");
        }
        if (
          updateData.driver.mobile &&
          typeof updateData.driver.mobile !== "string"
        ) {
          errors.push("Driver mobile must be a string");
        }
        if (
          updateData.driver.experience !== undefined &&
          (isNaN(Number(updateData.driver.experience)) ||
            updateData.driver.experience < 0)
        ) {
          errors.push("Driver experience must be a non-negative number");
        }
        if (
          updateData.driver.licenseNumber &&
          typeof updateData.driver.licenseNumber !== "string"
        ) {
          errors.push("Driver license number must be a string");
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Prepare update object with only the fields that were provided
    const updateObj: any = {};
    const validFields = [
      "make",
      "model",
      "year",
      "type",
      "seatingCapacity",
      "features",
      "description",
      "images",
      "isAvailable",
      "basePricePerDay",
      "driver",
    ];

    for (const key of validFields) {
      if (updateData[key] !== undefined) {
        updateObj[key] = updateData[key];
      }
    }

    // If driver data is being updated, ensure all required fields are present
    if (updateObj.driver) {
      updateObj.driver = {
        ...existingVehicle.driver.toObject(), // Keep existing driver data
        ...updateObj.driver, // Apply updates
      };
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedVehicle,
    });
  } catch (error: any) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      error: error.message,
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!deletedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
      error: error.message,
    });
  }
};

export const toggleVehicleAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    vehicle.isAvailable = !vehicle.isAvailable;
    await vehicle.save();

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error: any) {
    console.error("Error toggling vehicle availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle vehicle availability",
      error: error.message,
    });
  }
};
