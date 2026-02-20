import { DLModel, IDL } from "../models/driving.license.model";

export interface IDrivingLicenseRepository {
  getAll(): Promise<IDL[]>;
  getById(id: string): Promise<IDL | null>;
  create(data: Partial<IDL>): Promise<IDL>;
  update(id: string, data: Partial<IDL>): Promise<IDL | null>;
  delete(id: string): Promise<boolean>;
}

export class DrivingLicenseRepository implements IDrivingLicenseRepository {
  getById(id: string): Promise<IDL | null> {
    return DLModel.findById(id);
  }
  async getAll(): Promise<IDL[]> {
    return await DLModel.find();
  }

  async create(data: Partial<IDL>): Promise<IDL> {
    const dl = new DLModel(data);
    return await dl.save();
  }

  async update(id: string, data: Partial<IDL>): Promise<IDL | null> {
    return await DLModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await DLModel.findByIdAndDelete(id);
    return !!result;
  }
}
