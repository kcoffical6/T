import { Request, Response } from "express";
import { Booking } from "@/models/Booking";

export const adminListBookings = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "20");
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;

    const query: any = {};
    if (status) query.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("userId", "name email phone")
        .populate("packageId", "title slug basePricePerPax")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query),
    ]);

    return res.status(200).json({
      bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin list bookings error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const adminGetBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("userId", "name email phone")
      .populate("packageId", "title slug basePricePerPax");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    return res.status(200).json(booking);
  } catch (error: any) {
    console.error("Admin get booking error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const adminCreateBooking = async (req: Request, res: Response) => {
  try {
    const created = await Booking.create(req.body);
    return res.status(201).json(created);
  } catch (error: any) {
    console.error("Admin create booking error:", error);
    return res.status(400).json({ error: error.message || "Failed to create" });
  }
};

export const adminUpdateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Booking not found" });
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error("Admin update booking error:", error);
    return res.status(400).json({ error: error.message || "Failed to update" });
  }
};

export const adminDeleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Booking not found" });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Admin delete booking error:", error);
    return res.status(500).json({ error: "Failed to delete" });
  }
};
