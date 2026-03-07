import { DLServices } from "../../../services/dl.services";
import { DrivingLicenseRepository } from "../../../repositories/driving.license.repository";

// ✅ Mock the repository
jest.mock("../../../repositories/driving.license.repository");

const mockDL = {
  _id: "abc123",
  user: "user123",
  fullname: "John Doe",
  nationalId: "01-01-01-00001",
  nationalIdImageUrl: "https://example.com/national-id.jpg",
  drivingLicense: "01-06-01234567",
  drivingLicenseImageUrl: "https://example.com/driving-license.jpg",
  phoneNumber: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ✅ Valid input matching DLSchema
const validInput = {
  user: "user123",
  fullname: "John Doe",
  nationalId: "01-01-01-00001",
  nationalIdImageUrl: "https://example.com/national-id.jpg",
  drivingLicense: "01-06-01234567",
  drivingLicenseImageUrl: "https://example.com/driving-license.jpg",
  phoneNumber: "1234567890",
};

describe("DLServices", () => {
  let service: DLServices;
  let repoMock: jest.Mocked<DrivingLicenseRepository>;

  beforeEach(() => {
    // ✅ Get the mocked instance
    service = new DLServices();
    repoMock = (DrivingLicenseRepository as jest.Mock).mock.instances[0];
    jest.clearAllMocks();
  });

  // ─── getAll ───────────────────────────────────────────────────────────────

  describe("getAll", () => {
    it("should return all driving licenses", async () => {
      repoMock.getAll = jest.fn().mockResolvedValue([mockDL]);

      const result = await service.getAll();

      expect(repoMock.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockDL]);
    });

    it("should return an empty array when no licenses exist", async () => {
      repoMock.getAll = jest.fn().mockResolvedValue([]);

      const result = await service.getAll();

      expect(repoMock.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  // ─── getById ─────────────────────────────────────────────────────────────

  describe("getById", () => {
    it("should return a license by id", async () => {
      repoMock.getById = jest.fn().mockResolvedValue(mockDL);

      const result = await service.getById("abc123");

      expect(repoMock.getById).toHaveBeenCalledWith("abc123");
      expect(result).toEqual(mockDL);
    });

    it("should return null when license is not found", async () => {
      repoMock.getById = jest.fn().mockResolvedValue(null);

      const result = await service.getById("nonexistent");

      expect(repoMock.getById).toHaveBeenCalledWith("nonexistent");
      expect(result).toBeNull();
    });
  });

  // ─── create ──────────────────────────────────────────────────────────────

  describe("create", () => {
    it("should create and return a new license with valid data", async () => {
      repoMock.create = jest.fn().mockResolvedValue(mockDL);

      const result = await service.create(validInput);

      expect(repoMock.create).toHaveBeenCalledWith(validInput);
      expect(result).toEqual(mockDL);
    });

    it("should throw when user is empty", async () => {
      await expect(
        service.create({ ...validInput, user: "" })
      ).rejects.toThrow("User is required");
    });

    it("should throw when fullname is empty", async () => {
      await expect(
        service.create({ ...validInput, fullname: "" })
      ).rejects.toThrow("Full name is required");
    });

    it("should throw when drivingLicense format is invalid", async () => {
      await expect(
        service.create({ ...validInput, drivingLicense: "INVALID" })
      ).rejects.toThrow("License number must follow 01-06-01234567 format");
    });

    it("should throw when nationalId format is invalid", async () => {
      await expect(
        service.create({ ...validInput, nationalId: "INVALID" })
      ).rejects.toThrow("National ID must be at least 16 digits");
    });

    it("should throw when phoneNumber is too short", async () => {
      await expect(
        service.create({ ...validInput, phoneNumber: "123" })
      ).rejects.toThrow("Phone number must be at least 10 digits");
    });

    it("should throw when nationalIdImageUrl is empty", async () => {
      await expect(
        service.create({ ...validInput, nationalIdImageUrl: "" })
      ).rejects.toThrow("National ID image is required");
    });

    it("should throw when drivingLicenseImageUrl is empty", async () => {
      await expect(
        service.create({ ...validInput, drivingLicenseImageUrl: "" })
      ).rejects.toThrow("License image is required");
    });

    it("should not call repo.create when validation fails", async () => {
      repoMock.create = jest.fn();

      await expect(
        service.create({ ...validInput, fullname: "" })
      ).rejects.toThrow();

      expect(repoMock.create).not.toHaveBeenCalled();
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────

  describe("update", () => {
    it("should update and return the updated license", async () => {
      const updated = { ...mockDL, fullname: "Jane Doe" };
      repoMock.update = jest.fn().mockResolvedValue(updated);

      const result = await service.update("abc123", { fullname: "Jane Doe" });

      expect(repoMock.update).toHaveBeenCalledWith("abc123", { fullname: "Jane Doe" });
      expect(result).toEqual(updated);
    });

    it("should return null when license to update is not found", async () => {
      repoMock.update = jest.fn().mockResolvedValue(null);

      const result = await service.update("nonexistent", { fullname: "Jane Doe" });

      expect(repoMock.update).toHaveBeenCalledWith("nonexistent", { fullname: "Jane Doe" });
      expect(result).toBeNull();
    });
  });

  // ─── delete ──────────────────────────────────────────────────────────────

  describe("delete", () => {
    it("should return true when license is deleted", async () => {
      repoMock.delete = jest.fn().mockResolvedValue(true);

      const result = await service.delete("abc123");

      expect(repoMock.delete).toHaveBeenCalledWith("abc123");
      expect(result).toBe(true);
    });

    it("should return false when license to delete is not found", async () => {
      repoMock.delete = jest.fn().mockResolvedValue(false);

      const result = await service.delete("nonexistent");

      expect(repoMock.delete).toHaveBeenCalledWith("nonexistent");
      expect(result).toBe(false);
    });
  });
});