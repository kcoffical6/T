import { User, IUser } from '@/models/User';

export class UsersService {
  async create(createUserDto: Partial<IUser>): Promise<IUser> {
    const user = new User(createUserDto);
    return user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-passwordHash');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select('-passwordHash');
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return User.findOne({ email, isActive: true }).select('+passwordHash');
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return User.findOne({ phone }).select('-passwordHash');
  }

  async updateProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-passwordHash');
    
    return user;
  }

  async addSavedPassenger(userId: string, passenger: any): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { savedPassengers: passenger } },
      { new: true }
    ).select('-passwordHash');
    
    return user;
  }

  async removeSavedPassenger(userId: string, passengerIndex: number): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $unset: { [`savedPassengers.${passengerIndex}`]: 1 } },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) {
      return null;
    }
    
    // Clean up the array
    user.savedPassengers = user.savedPassengers.filter((p: any) => p !== null);
    await user.save();
    
    return user;
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().select('-passwordHash').skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);
    
    return { users, total };
  }

  async getUsersByRole(role: string): Promise<IUser[]> {
    return User.find({ role }).select('-passwordHash');
  }

  async deactivateUser(userId: string): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-passwordHash');
    
    return user;
  }

  async activateUser(userId: string): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-passwordHash');
    
    return user;
  }

  async findByIdWithPassword(id: string): Promise<IUser | null> {
    return User.findById(id).select('+passwordHash');
  }

  async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { lastLoginAt: new Date() });
  }

  async createUser(userData: any): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async findUserByEmailOrPhone(email: string, phone: string): Promise<IUser | null> {
    return User.findOne({
      $or: [{ email }, { phone }],
    });
  }
}
