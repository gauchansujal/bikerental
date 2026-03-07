import { Types } from "mongoose";
import { DrivingLicenseRepository } from "../../../repositories/driving.license.repository";
import { DLModel, IDL } from "../../../models/driving.license.model";

jest.mock("../../../models/driving.license.model");

const mockDL = {
  _id: new Types.ObjectId(),
  user: "user123",                                        // ✅ string to match DLType
  fullname: "John Doe",
  nationalId: "NAT-001",
  nationalIdImageUrl: "https://example.com/national-id.jpg",
  drivingLicense: "DL-001",
  drivingLicenseImageUrl: "https://example.com/driving-license.jpg",
  phoneNumber: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as IDL;                                      // ✅ cast to IDL to avoid type errors

describe("DrivingLicenseRepository", () => {
  let repo: DrivingLicenseRepository;

  beforeEach(() => {
    repo = new DrivingLicenseRepository();
    jest.clearAllMocks();
  });

  // ─── getAll ───────────────────────────────────────────────────────────────

  describe("getAll", () => {
    it("should return all driving licenses", async () => {
      (DLModel.find as jest.Mock).mockResolvedValue([mockDL]);

      const result = await repo.getAll();

      expect(DLModel.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockDL]);
    });

    it("should return an empty array when no licenses exist", async () => {
      (DLModel.find as jest.Mock).mockResolvedValue([]);

      const result = await repo.getAll();

      expect(DLModel.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  // ─── getById ─────────────────────────────────────────────────────────────

  describe("getById", () => {
    it("should return a license by id", async () => {
      (DLModel.findById as jest.Mock).mockResolvedValue(mockDL);

      const result = await repo.getById(mockDL._id.toString());

      expect(DLModel.findById).toHaveBeenCalledWith(mockDL._id.toString());
      expect(result).toEqual(mockDL);
    });

    it("should return null when license is not found", async () => {
      (DLModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await repo.getById("nonexistent");

      expect(DLModel.findById).toHaveBeenCalledWith("nonexistent");
      expect(result).toBeNull();
    });
  });

  // ─── create ──────────────────────────────────────────────────────────────

  describe("create", () => {
    it("should create and return a new license", async () => {
      const saveMock = jest.fn().mockResolvedValue(mockDL);
      (DLModel as unknown as jest.Mock).mockImplementation(() => ({
        save: saveMock,
      }));

      const result = await repo.create(mockDL);

      expect(DLModel).toHaveBeenCalledWith(mockDL);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockDL);
    });

    it("should throw if save fails", async () => {
      const saveMock = jest.fn().mockRejectedValue(new Error("DB error"));
      (DLModel as unknown as jest.Mock).mockImplementation(() => ({
        save: saveMock,
      }));

      await expect(repo.create(mockDL)).rejects.toThrow("DB error");
      expect(saveMock).toHaveBeenCalledTimes(1);
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────

  describe("update", () => {
    it("should update and return the updated license", async () => {
      const updated = { ...mockDL, fullname: "Jane Doe" };
      (DLModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

      const result = await repo.update(mockDL._id.toString(), { fullname: "Jane Doe" });

      expect(DLModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockDL._id.toString(),
        { fullname: "Jane Doe" },
        { new: true }
      );
      expect(result).toEqual(updated);
    });

    it("should return null when license to update is not found", async () => {
      (DLModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await repo.update("nonexistent", { fullname: "Jane Doe" });

      expect(DLModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "nonexistent",
        { fullname: "Jane Doe" },
        { new: true }
      );
      expect(result).toBeNull();
    });
  });

  // ─── delete ──────────────────────────────────────────────────────────────

  describe("delete", () => {
    it("should return true when license is deleted", async () => {
      (DLModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDL);

      const result = await repo.delete(mockDL._id.toString());

      expect(DLModel.findByIdAndDelete).toHaveBeenCalledWith(mockDL._id.toString());
      expect(result).toBe(true);
    });

    it("should return false when license to delete is not found", async () => {
      (DLModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await repo.delete("nonexistent");

      expect(DLModel.findByIdAndDelete).toHaveBeenCalledWith("nonexistent");
      expect(result).toBe(false);
    });
  });
});