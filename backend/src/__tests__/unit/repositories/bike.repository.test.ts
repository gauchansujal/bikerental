import { BikeRepository } from "../../../repositories/bike.repository";
import { BikeModel } from "../../../models/bike.model";

jest.mock("../../../models/bike.model");

const mockBike = {
  _id: "507f1f77bcf86cd799439011",
  name: "CBR 600",
  brand: "Honda",
  price: "15000",
  engineCC: 600,
  milage: "30km/l",
  isAvailable: true,
} as any;

describe("BikeRepository", () => {
  let bikeRepository: BikeRepository;

  beforeEach(() => {
    bikeRepository = new BikeRepository();
    jest.clearAllMocks();
  });

  // ── getBikeById ────────────────────────────────────────────────
  describe("getBikeById", () => {
    test("should return bike when id exists", async () => {
      (BikeModel.findById as jest.Mock).mockResolvedValue(mockBike);

      const result = await bikeRepository.getBikeById(mockBike._id);

      expect(BikeModel.findById).toHaveBeenCalledWith(mockBike._id);
      expect(result).toEqual(mockBike);
    });

    test("should return null when id not found", async () => {
      (BikeModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await bikeRepository.getBikeById("000000000000000000000000");

      expect(result).toBeNull();
    });
  });

  // ── getBikeByName ──────────────────────────────────────────────
  describe("getBikeByName", () => {
    test("should return bike when name exists", async () => {
      (BikeModel.findOne as jest.Mock).mockResolvedValue(mockBike);

      const result = await bikeRepository.getBikeByName("CBR 600");

      expect(BikeModel.findOne).toHaveBeenCalledWith({ name: "CBR 600" });
      expect(result).toEqual(mockBike);
    });

    test("should return null when name not found", async () => {
      (BikeModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await bikeRepository.getBikeByName("Ghost Bike");

      expect(result).toBeNull();
    });
  });

  // ── getAllBike ─────────────────────────────────────────────────
  describe("getAllBike", () => {
    test("should return paginated bikes", async () => {
      const mockBikes = [mockBike];
      const limitMock = jest.fn().mockResolvedValue(mockBikes);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      (BikeModel.find as jest.Mock) = jest.fn().mockReturnValue({ skip: skipMock });
      (BikeModel.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await bikeRepository.getAllBike(1, 10);

      expect(result.bikes).toEqual(mockBikes);
      expect(result.total).toBe(1);
      expect(skipMock).toHaveBeenCalledWith(0); // (1-1)*10
      expect(limitMock).toHaveBeenCalledWith(10);
    });

    test("should apply search filter by name and brand", async () => {
      const limitMock = jest.fn().mockResolvedValue([mockBike]);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      const findMock = jest.fn().mockReturnValue({ skip: skipMock });
      (BikeModel.find as jest.Mock) = findMock;
      (BikeModel.countDocuments as jest.Mock).mockResolvedValue(1);

      await bikeRepository.getAllBike(1, 10, "Honda");

      const filterArg = findMock.mock.calls[0][0];
      expect(filterArg.$or).toBeDefined();
      expect(filterArg.$or[0].name.$regex).toBe("Honda");
      expect(filterArg.$or[1].brand.$regex).toBe("Honda");
    });

    test("should search by engineCC when search is a number", async () => {
      const limitMock = jest.fn().mockResolvedValue([mockBike]);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      const findMock = jest.fn().mockReturnValue({ skip: skipMock });
      (BikeModel.find as jest.Mock) = findMock;
      (BikeModel.countDocuments as jest.Mock).mockResolvedValue(1);

      await bikeRepository.getAllBike(1, 10, "600");

      const filterArg = findMock.mock.calls[0][0];
      const hasEngineCC = filterArg.$or.some((f: any) => f.engineCC === 600);
      expect(hasEngineCC).toBe(true);
    });

    test("should return empty array when no bikes found", async () => {
      const limitMock = jest.fn().mockResolvedValue([]);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      (BikeModel.find as jest.Mock) = jest.fn().mockReturnValue({ skip: skipMock });
      (BikeModel.countDocuments as jest.Mock).mockResolvedValue(0);

      const result = await bikeRepository.getAllBike(1, 10);

      expect(result.bikes).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  // ── createBike ─────────────────────────────────────────────────
  describe("createBike", () => {
    test("should create and return new bike", async () => {
      const saveMock = jest.fn().mockResolvedValue(mockBike);
      (BikeModel as any).mockImplementation(() => ({ save: saveMock }));

      const result = await bikeRepository.createBike(mockBike);

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockBike);
    });
  });

  // ── updateBike ─────────────────────────────────────────────────
  describe("updateBike", () => {
    test("should return updated bike", async () => {
      const updatedBike = { ...mockBike, price: "16000" };
      (BikeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedBike);

      const result = await bikeRepository.updateBike(mockBike._id, { price: "16000" });

      expect(BikeModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockBike._id, { price: "16000" }, { new: true }
      );
      expect(result?.price).toBe("16000");
    });

    test("should return null when bike not found", async () => {
      (BikeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await bikeRepository.updateBike("000000000000000000000000", {});

      expect(result).toBeNull();
    });
  });

  // ── deleteBike ─────────────────────────────────────────────────
  describe("deleteBike", () => {
    test("should return true when bike deleted", async () => {
      (BikeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockBike);

      const result = await bikeRepository.deleteBike(mockBike._id);

      expect(BikeModel.findByIdAndDelete).toHaveBeenCalledWith(mockBike._id);
      expect(result).toBe(true);
    });

    test("should return false when bike not found", async () => {
      (BikeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await bikeRepository.deleteBike("000000000000000000000000");

      expect(result).toBe(false);
    });
  });
});