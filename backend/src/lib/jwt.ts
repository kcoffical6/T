import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

const accessSecret = process.env.JWT_SECRET || "default_secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "default_refresh";

export function generateAccessToken(
  payload: Omit<JWTPayload, "iat" | "exp">
): string {
  const expiresIn: string = process.env.JWT_EXPIRES_IN || "15m";
  return jwt.sign(payload, accessSecret, { expiresIn } as any);
}

export function generateRefreshToken(
  payload: Omit<JWTPayload, "iat" | "exp">
): string {
  const expiresIn: string = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  return jwt.sign(payload, refreshSecret, { expiresIn } as any);
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, accessSecret) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, refreshSecret) as JWTPayload;
}

export function extractTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}
