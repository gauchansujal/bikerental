import { DrivingLicenseRepository } from "../repositories/driving.license.repository";
import { DLSchema, DLType } from "../types/driving.license";
import { IDL } from "../models/driving.license.model";
import { error } from "node:console";

export class DLServices {
  private repo = new DrivingLicenseRepository();

  async getAll(): Promise<IDL[]> {
    return await this.repo.getAll();
  }

  async create(data: DLType): Promise<IDL> {
    const parsed = DLSchema.safeParse(data);

    if (!parsed.success) {
      const errors = parsed.error.issues.map(e => e.message).join(", ");
      throw new Error(errors);
    }

    return await this.repo.create(parsed.data);
  }


  async getById(id: string): Promise<IDL | null> {
    return await this.repo.getById(id);
  }

  async update(id: string, data: Partial<DLType>): Promise<IDL | null> {
    return await this.repo.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repo.delete(id);
  }
}
