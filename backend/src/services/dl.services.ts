import { DrivingLicenseRepository } from "../repositories/driving.license.repository";
import { DLSchema, DLType } from "../types/driving.license";
import { IDL } from "../models/driving.license.model";
import { NotificationServices } from "./notification.services";

export class DLServices {
  private repo = new DrivingLicenseRepository();
  private notificationService = new NotificationServices();

  // GET ALL
  async getAll(): Promise<IDL[]> {
    return await this.repo.getAll();
  }

  // GET BY ID
  async getById(id: string): Promise<IDL | null> {
    return await this.repo.getById(id);
  }

  // CREATE — triggers notification
  async create(data: DLType, userId: string): Promise<IDL> {
    const parsed = DLSchema.safeParse(data);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => e.message).join(", ");
      throw new Error(errors);
    }

    const dl = await this.repo.create(parsed.data); // ✅ save first

    // ✅ notify user after document uploaded
    await this.notificationService.createNotification({
      userId,
      title: "Document Uploaded ✅",
      message: "Your driving license and national ID have been uploaded successfully. You can now book a bike.",
      type: "booking_updated",
    });

    return dl;
  }

  // UPDATE
  async update(id: string, data: Partial<DLType>): Promise<IDL | null> {
    return await this.repo.update(id, data);
  }

  // DELETE
  async delete(id: string): Promise<boolean> {
    return await this.repo.delete(id);
  }
}