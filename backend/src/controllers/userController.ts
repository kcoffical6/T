import { Request, Response } from "express";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const adminListUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "20");
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin list users error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const adminGetUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Admin get user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const adminCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, country, password, role = "user" } = req.body;
    if (!name || !email || !phone || !country || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await User.create({
      name,
      email,
      phone,
      country,
      passwordHash,
      role,
    });
    return res.status(201).json(created);
  } catch (error: any) {
    console.error("Admin create user error:", error);
    return res.status(400).json({ error: error.message || "Failed to create" });
  }
};

export const adminUpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update: any = { ...req.body };
    if (update.password) {
      update.passwordHash = await bcrypt.hash(update.password, 10);
      delete update.password;
    }
    const updated = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error("Admin update user error:", error);
    return res.status(400).json({ error: error.message || "Failed to update" });
  }
};

export const adminDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Admin delete user error:", error);
    return res.status(500).json({ error: "Failed to delete" });
  }
};
