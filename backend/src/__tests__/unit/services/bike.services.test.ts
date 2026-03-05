import { BikeService } from "../../../services/bike.services";
import { BikeRepository } from "../../../repositories/bike.repository";

// ✅ BikeService uses: private repo = new BikeRepository()
// repo is a CLASS FIELD — created per instance, so prototype spying works perfectly
const getAllBikeSpy = jest.spyOn(BikeRepository.prototype, "getAllBike");
const getBikeByIdSpy = jest.spyOn(BikeRepository.prototype, "getBikeById");
const getBikeByNameSpy = jest.spyOn(BikeRepository.prototype, "getBikeByName");
const createBikeSpy = jest.spyOn(BikeRepository.prototype, "createBike");
const updateBikeSpy = jest.spyOn(BikeRepository.prototype, "updateBike");
const deleteBikeSpy = jest.spyOn(BikeRepository.prototype, "deleteBike");

const mockBike = {
  _id: "507f1f77bcf86cd799439011",
  name: "CBR 600",
  brand: "Honda",
  price: "15000",
  engineCC: 600,
  milage: "30km/l",
  isAvailable: true,
} as any;

describe("BikeService", () => {
  let bikeService: BikeService;

  beforeEach(() => {
    jest.clearAllMocks();
    bikeService = new BikeService();
  });

  // ── getAllBikes ────────────────────────────────────────────────
  describe("getAllBikes", () => {
    test("should return paginated bikes with default page/size", async () => {
      getAllBikeSpy.mockResolvedValue({ bikes: [mockBike], total: 1 });

      const result = await bikeService.getAllBikes();

      expect(getAllBikeSpy).toHaveBeenCalledWith(1, 10, undefined);
      expect(result.bikes).toEqual([mockBike]);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.size).toBe(10);
      expect(result.pagination.totalItems).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    test("should parse page and size strings to numbers", async () => {
      getAllBikeSpy.mockResolvedValue({ bikes: [], total: 0 });

      await bikeService.getAllBikes("2", "5");

      expect(getAllBikeSpy).toHaveBeenCalledWith(2, 5, undefined);
    });

    test("should pass search to repository", async () => {
      getAllBikeSpy.mockResolvedValue({ bikes: [mockBike], total: 1 });

      await bikeService.getAllBikes("1", "10", "Honda");

      expect(getAllBikeSpy).toHaveBeenCalledWith(1, 10, "Honda");
    });

    test("should calculate totalPages correctly", async () => {
      getAllBikeSpy.mockResolvedValue({ bikes: [], total: 25 });

      const result = await bikeService.getAllBikes("1", "10");

      expect(result.pagination.totalPages).toBe(3); // Math.ceil(25/10)
    });
  });

  // ── getBikeById ────────────────────────────────────────────────
  describe("getBikeById", () => {
    test("should return bike when found", async () => {
      getBikeByIdSpy.mockResolvedValue(mockBike);

      const result = await bikeService.getBikeById(mockBike._id);

      expect(getBikeByIdSpy).toHaveBeenCalledWith(mockBike._id);
      expect(result).toEqual(mockBike);
    });

    test("should return null when bike not found", async () => {
      getBikeByIdSpy.mockResolvedValue(null);

      const result = await bikeService.getBikeById("000000000000000000000000");

      expect(result).toBeNull();
    });
  });

  // ── getBikeByName ──────────────────────────────────────────────
  describe("getBikeByName", () => {
    test("should return bike when name found", async () => {
      getBikeByNameSpy.mockResolvedValue(mockBike);

      const result = await bikeService.getBikeByName("CBR 600");

      expect(getBikeByNameSpy).toHaveBeenCalledWith("CBR 600");
      expect(result).toEqual(mockBike);
    });

    test("should return null when name not found", async () => {
      getBikeByNameSpy.mockResolvedValue(null);

      const result = await bikeService.getBikeByName("Ghost Bike");

      expect(result).toBeNull();
    });
  });

  // ── createBike ─────────────────────────────────────────────────
  describe("createBike", () => {
    test("should create bike when user is admin", async () => {
      createBikeSpy.mockResolvedValue(mockBike);

      const result = await bikeService.createBike(mockBike, "admin");

      expect(createBikeSpy).toHaveBeenCalledWith(mockBike);
      expect(result).toEqual(mockBike);
    });

    test("should throw error when user is not admin", async () => {
      await expect(bikeService.createBike(mockBike, "user"))
        .rejects
        .toThrow("Unauthorized: Only admin can create bikes");
    });

    test("should not call repository when unauthorized", async () => {
      await expect(bikeService.createBike(mockBike, "user")).rejects.toThrow();
      expect(createBikeSpy).not.toHaveBeenCalled();
    });
  });

  // ── updateBike ─────────────────────────────────────────────────
  describe("updateBike", () => {
    test("should update bike when user is admin", async () => {
      const updatedBike = { ...mockBike, price: "16000" };
      updateBikeSpy.mockResolvedValue(updatedBike);

      const result = await bikeService.updateBike(mockBike._id, { price: "16000" }, "admin");

      expect(updateBikeSpy).toHaveBeenCalledWith(mockBike._id, { price: "16000" });
      expect(result?.price).toBe("16000");
    });

    test("should throw error when user is not admin", async () => {
      await expect(bikeService.updateBike(mockBike._id, { price: "16000" }, "user"))
        .rejects
        .toThrow("Unauthorized: Only admin can update bikes");
    });

    test("should return null when bike not found", async () => {
      updateBikeSpy.mockResolvedValue(null);

      const result = await bikeService.updateBike("000000000000000000000000", {}, "admin");

      expect(result).toBeNull();
    });
  });

  // ── deleteBike ─────────────────────────────────────────────────
  describe("deleteBike", () => {
    test("should delete bike when user is admin", async () => {
      deleteBikeSpy.mockResolvedValue(true);

      const result = await bikeService.deleteBike(mockBike._id, "admin");

      expect(deleteBikeSpy).toHaveBeenCalledWith(mockBike._id);
      expect(result).toBe(true);
    });

    test("should throw error when user is not admin", async () => {
      await expect(bikeService.deleteBike(mockBike._id, "user"))
        .rejects
        .toThrow("Unauthorized: Only admin can delete bikes");
    });

    test("should not call repository when unauthorized", async () => {
      await expect(bikeService.deleteBike(mockBike._id, "user")).rejects.toThrow();
      expect(deleteBikeSpy).not.toHaveBeenCalled();
    });

    test("should return false when bike not found", async () => {
      deleteBikeSpy.mockResolvedValue(false);

      const result = await bikeService.deleteBike("000000000000000000000000", "admin");

      expect(result).toBe(false);
    });
  });
});