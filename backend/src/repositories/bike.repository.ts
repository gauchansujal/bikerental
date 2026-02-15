import { BikeModel, Ibike } from "../models/bike.model";

export interface IBikeRepository {
  getBikeByName(name: string): Promise<Ibike | null>;
  getAllBike(): Promise<Ibike[]>; // should return an array
  createBike(useData: Partial<Ibike>): Promise<Ibike>;
  updateBike(id: string, updateData: Partial<Ibike>): Promise<Ibike | null>;
  deleteBike(id: string): Promise<boolean>;
}

export class BikeRepository implements IBikeRepository {
  async getBikeByName(name: string): Promise<Ibike | null> {
    return await BikeModel.findOne({ name });
  }

  async getAllBike(): Promise<Ibike[]> {  // ✅ fix return type
    return await BikeModel.find();
  }

  async createBike(useData: Partial<Ibike>): Promise<Ibike> {
    const bike = new BikeModel(useData);
    return await bike.save();
  }

  async updateBike(id: string, updateData: Partial<Ibike>): Promise<Ibike | null> {
    // ✅ Fix syntax: use { new: true } instead of (new: true)
    return await BikeModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteBike(id: string): Promise<boolean> {
    // ✅ Fix syntax: remove 'const result : await'
    const result = await BikeModel.findByIdAndDelete(id);
    return result ? true : false;
  }
}
