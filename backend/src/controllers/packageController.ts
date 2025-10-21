import { Request, Response } from "express";
import { Package } from "@/models/Package";

export const adminListPackages = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "20");
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      Package.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Package.countDocuments(),
    ]);

    return res.status(200).json({
      packages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Admin list packages error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const adminGetPackageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    return res.status(200).json(pkg);
  } catch (error: any) {
    console.error("Admin get package error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const adminCreatePackage = async (req: Request, res: Response) => {
  try {
    const created = await Package.create(req.body);
    return res.status(201).json(created);
  } catch (error: any) {
    console.error("Admin create package error:", error);
    return res.status(400).json({ error: error.message || "Failed to create" });
  }
};

export const adminUpdatePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Package.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Package not found" });
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error("Admin update package error:", error);
    return res.status(400).json({ error: error.message || "Failed to update" });
  }
};

export const adminDeletePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Package.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Package not found" });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Admin delete package error:", error);
    return res.status(500).json({ error: "Failed to delete" });
  }
};
