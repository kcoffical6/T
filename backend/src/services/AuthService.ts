import { User, IUser } from "@/models/User";
import { hashPassword, comparePassword } from "@/lib/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  JWTPayload,
} from "@/lib/jwt";

export interface AuthResponse {
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async validateUser(
    email: string,
    password: string
  ): Promise<Partial<IUser> | null> {
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return null;
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    // Convert Mongoose document to plain object and exclude passwordHash
    const { passwordHash, ...result } = user.toObject();
    return result;
  }

  async login(user: Partial<IUser>): Promise<AuthResponse> {
    const payload: Omit<JWTPayload, "iat" | "exp"> = {
      userId: user._id!.toString(),
      email: user.email!,
      role: user.role!,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        savedPassengers: user.savedPassengers,
      },
      accessToken,
      refreshToken,
    };
  }

  async signup(signupData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
  }): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: signupData.email }, { phone: signupData.phone }],
    });

    if (existingUser) {
      throw new Error("User with this email or phone already exists");
    }

    // Hash password
    const passwordHash = await hashPassword(signupData.password);

    // Create user
    const user = await User.create({
      ...signupData,
      passwordHash,
      role: "user",
    });

    // Generate tokens
    const payload: Omit<JWTPayload, "iat" | "exp"> = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        savedPassengers: user.savedPassengers,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = verifyRefreshToken(refreshToken);

      const user = await User.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new Error("Invalid refresh token");
      }

      const newPayload: Omit<JWTPayload, "iat" | "exp"> = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const newAccessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(newPayload);

      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          country: user.country,
          role: user.role,
          savedPassengers: user.savedPassengers,
        },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async validateUserById(userId: string): Promise<Partial<IUser> | null> {
    const user = await User.findById(userId);
    return user?.isActive ? user : null;
  }
}
