import { Package, IPackage } from '@/models/Package';

export interface PackageFilters {
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  minPax?: number;
  featured?: boolean;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export class PackagesService {
  async findAll(filters: PackageFilters = {}, pagination: PaginationOptions = { page: 1, limit: 10 }): Promise<{
    packages: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const query: any = { isActive: true };
    
    // Apply filters
    if (filters.region) {
      query.region = filters.region;
    }
    
    if (filters.minPrice || filters.maxPrice) {
      query.basePricePerPax = {};
      if (filters.minPrice) query.basePricePerPax.$gte = filters.minPrice;
      if (filters.maxPrice) query.basePricePerPax.$lte = filters.maxPrice;
    }
    
    if (filters.minPax) {
      query.minPax = { $lte: filters.minPax };
    }
    
    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }
    
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const skip = (pagination.page - 1) * pagination.limit;
    
    const [packages, total] = await Promise.all([
      Package
        .find(query)
        .sort(filters.featured ? { featured: -1, createdAt: -1 } : { createdAt: -1 })
        .skip(skip)
        .limit(pagination.limit)
        .lean(),
      Package.countDocuments(query),
    ]);

    return {
      packages,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async findBySlug(slug: string): Promise<IPackage | null> {
    const packageData = await Package.findOne({ slug, isActive: true });
    
    if (!packageData) {
      return null;
    }

    // Increment view count
    await Package.findByIdAndUpdate(packageData._id, {
      $inc: { viewCount: 1 }
    });

    return packageData;
  }

  async findById(id: string): Promise<IPackage | null> {
    const packageData = await Package.findById(id);
    return packageData;
  }

  async create(createPackageDto: any): Promise<IPackage> {
    const packageData = new Package(createPackageDto);
    return packageData.save();
  }

  async update(id: string, updatePackageDto: any): Promise<IPackage | null> {
    const packageData = await Package.findByIdAndUpdate(
      id,
      updatePackageDto,
      { new: true }
    );
    
    return packageData;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Package.findByIdAndDelete(id);
    return !!result;
  }

  async getFeaturedPackages(limit: number = 6): Promise<any[]> {
    return Package
      .find({ featured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getPackagesByRegion(region: string, limit: number = 10): Promise<any[]> {
    return Package
      .find({ region, isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getPopularPackages(limit: number = 10): Promise<any[]> {
    return Package
      .find({ isActive: true })
      .sort({ bookingCount: -1, viewCount: -1 })
      .limit(limit)
      .lean();
  }

  async incrementBookingCount(packageId: string): Promise<void> {
    await Package.findByIdAndUpdate(packageId, {
      $inc: { bookingCount: 1 }
    });
  }

  async getAllPackagesForAdmin(page: number = 1, limit: number = 20): Promise<{
    packages: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const skip = (page - 1) * limit;
    
    const [packages, total] = await Promise.all([
      Package
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Package.countDocuments(),
    ]);

    return {
      packages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
