import { Request, Response } from "express";
import { DLServices } from "../services/dl.services";
import { DLType } from "../types/driving.license";

const service = new DLServices();

type IdParams = {
  id: string;
};

// GET ALL
export const getAllDL = async (req: Request, res: Response) => {
  try {
    const dl = await service.getAll();
    res.status(200).json(dl);
  } catch {
    res.status(500).json({ message: "Failed to fetch licenses" });
  }
};

// CREATE
export const createDL = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.drivingLicenseImageUrl?.[0]) {
        data.drivingLicenseImageUrl = files.drivingLicenseImageUrl[0].filename;
      }
      if (files.nationalIdImageUrl?.[0]) {
        data.nationalIdImageUrl = files.nationalIdImageUrl[0].filename;
      }
    }

    if (!data.drivingLicenseImageUrl) {
      return res.status(400).json({ message: "Driving license image is required" });
    }
    if (!data.nationalIdImageUrl) {
      return res.status(400).json({ message: "National ID image is required" });
    }

    const userId = (req as any).user._id.toString(); // ✅ extract userId
    data.user = userId;

    const dl = await service.create(data, userId); // ✅ pass userId
    res.status(201).json(dl);

  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
export const updateDL = async (req: Request<IdParams>, res: Response) => {
  try {
    const data: Partial<DLType> = req.body;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files.drivingLicenseImageUrl?.[0]) {
        data.drivingLicenseImageUrl = files.drivingLicenseImageUrl[0].filename;
      }
      if (files.nationalIdImageUrl?.[0]) {
        data.nationalIdImageUrl = files.nationalIdImageUrl[0].filename;
      }
    }

    const dl = await service.update(req.params.id, data);
    res.status(200).json(dl);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Update failed" });
  }
};

// DELETE
export const deleteDL = async (req: Request<IdParams>, res: Response) => {
  try {
    await service.delete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ message: "Delete failed" });
  }
};

// GET BY ID
export const getDLById = async (req: Request<IdParams>, res: Response) => {
  try {
    const dl = await service.getById(req.params.id);
    res.status(200).json(dl);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Driving license not found" });
  }
};