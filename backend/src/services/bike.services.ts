import { Ibike } from "../models/bike.model";
import { BikeRepository } from "../repositories/bike.repository";

// ✅ Define a return type for paginated response
export interface PaginatedBikes {
  bikes: Ibike[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}

export class BikeService {
  private repo = new BikeRepository();

  // ✅ Fixed return type
  async getAllBikes(page?: string, size?: string, search?: string): Promise<PaginatedBikes> {
    const pageNumber = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;

    const { bikes, total } = await this.repo.getAllBike(pageNumber, pageSize, search);

    const pagination = {
      page: pageNumber,
      size: pageSize,
      totalItems: total,
      totalPages: Math.ceil(total / pageSize), // ✅ fixed typo: totalpages → totalPages
    };

    return { bikes, pagination };
  }
  async getBikeById(id: string): Promise<Ibike | null> {
  return await this.repo.getBikeById(id);
}


  async getBikeByName(name: string): Promise<Ibike | null> {
    return await this.repo.getBikeByName(name);
  }

  // Admin only
  async createBike(data: Partial<Ibike>, userRole: string): Promise<Ibike> {
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Only admin can create bikes");
    }
    return await this.repo.createBike(data);
  }

  // Admin only
  async updateBike(id: string, data: Partial<Ibike>, userRole: string): Promise<Ibike | null> {
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Only admin can update bikes");
    }
    return await this.repo.updateBike(id, data);
  }

  // Admin only
  async deleteBike(id: string, userRole: string): Promise<boolean> {
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Only admin can delete bikes");
    }
    return await this.repo.deleteBike(id);
  }
}