import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace 'any' with a more specific user type
    }
  }
}

// Simple authentication middleware
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

// Role-based access control middleware for Express
export const withRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // First verify the user is authenticated
    authMiddleware(req, res, () => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "No user found",
          });
        }

        // Check if user has required role
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: "Insufficient permissions",
          });
        }

        // User has required role, proceed to the next middleware/route handler
        next();
      } catch (error) {
        console.error("Role check error:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error during authorization",
        });
      }
    });
  };
};
