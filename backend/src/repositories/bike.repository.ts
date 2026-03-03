import { BikeModel, Ibike } from "../models/bike.model";
import { QueryFilter } from "mongoose";
import { QueryParmas } from "../types/query.types";

export interface IBikeRepository {
  getBikeByName(name: string): Promise<Ibike | null>;
  getAllBike(pageNumber: number, pageSize: number, search?: string): Promise<{bikes: Ibike[], total: number}>; // should return an array
  createBike(useData: Partial<Ibike>): Promise<Ibike>;
  updateBike(id: string, updateData: Partial<Ibike>): Promise<Ibike | null>;
  deleteBike(id: string): Promise<boolean>;
    getBikeById(id: string): Promise<Ibike | null>;
 
}

export class BikeRepository implements IBikeRepository {
  async getBikeById(id: string): Promise<Ibike | null> {
  return await BikeModel.findById(id);  }
  async getBikeByName(name: string): Promise<Ibike | null> {
    return await BikeModel.findOne({ name });
  }

  async getAllBike(pageNumber: number, pageSize: number, search?: string): Promise<{bikes: Ibike[], total: number}> {  // ✅ fix return type
    const filter: QueryFilter<Ibike> ={};
    if(search){
      const searchCondations: any[]= [
      
        {name: {$regex: search, $options: 'i'}},
        {brand: {$regex: search, $options: 'i'}},
        // {engineCC: {$regex: search, $options: 'i'}},
      ];
      const engineCCValue = Number(search);
      if(!isNaN(engineCCValue)){
        searchCondations.push({engineCC: engineCCValue});
      }
      filter.$or = searchCondations;
    }
      const [bikes, total] = await Promise.all([
    BikeModel.find(filter).skip((pageNumber - 1) * pageSize).limit(pageSize),
    BikeModel.countDocuments(filter),
  ]);

  return {  bikes, total };
  
  
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
