import { Ibike } from "../models/bike.model";
import { BikeRepository } from "../repositories/bike.repository";

export class BikeService {
  private repo = new BikeRepository();

  // Users & admins can view
  async getAllBikes(): Promise<Ibike[]> {
    return await this.repo.getAllBike();
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
