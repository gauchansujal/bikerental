import { BookingRepository } from "../../../repositories/booking.repository";
import { BookingModel } from "../../../models/booking.model";

jest.mock("../../../models/booking.model");

const mockBooking = {
  _id: "booking123",
  user: "user123",
  bike: "bike123",
  bookingDate: new Date("2027-01-01"),
  returnDate: new Date("2027-01-10"),
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ✅ Helper to mock chainable .populate().populate()
const mockPopulate = (returnValue: unknown) => ({
  populate: jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue(returnValue),
  }),
});

describe("BookingRepository", () => {
  let repo: BookingRepository;

  beforeEach(() => {
    repo = new BookingRepository();
    jest.clearAllMocks();
  });

  // ─── getAllBooking ─────────────────────────────────────────────────────────

  describe("getAllBooking", () => {
    it("should return all bookings", async () => {
      (BookingModel.find as jest.Mock).mockReturnValue(
        mockPopulate([mockBooking])
      );

      const result = await repo.getAllBooking();

      expect(BookingModel.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockBooking]);
    });

    it("should return empty array when no bookings exist", async () => {
      (BookingModel.find as jest.Mock).mockReturnValue(
        mockPopulate([])
      );

      const result = await repo.getAllBooking();

      expect(BookingModel.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  // ─── getBookingByID ───────────────────────────────────────────────────────

  describe("getBookingByID", () => {
    it("should return a booking by id", async () => {
      (BookingModel.findById as jest.Mock).mockReturnValue(
        mockPopulate(mockBooking)
      );

      const result = await repo.getBookingByID("booking123");

      expect(BookingModel.findById).toHaveBeenCalledWith("booking123");
      expect(result).toEqual(mockBooking);
    });

    it("should return null when booking is not found", async () => {
      (BookingModel.findById as jest.Mock).mockReturnValue(
        mockPopulate(null)
      );

      const result = await repo.getBookingByID("nonexistent");

      expect(BookingModel.findById).toHaveBeenCalledWith("nonexistent");
      expect(result).toBeNull();
    });
  });

  // ─── createBooking ────────────────────────────────────────────────────────

  describe("createBooking", () => {
    it("should create and return a new booking", async () => {
      (BookingModel.create as jest.Mock).mockResolvedValue(mockBooking);

      const result = await repo.createBooking({
        user: "user123",
        bike: "bike123",
        bookingDate: new Date("2027-01-01"),
        returnDate: new Date("2027-01-10"),
      });

      expect(BookingModel.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBooking);
    });

    it("should throw if create fails", async () => {
      (BookingModel.create as jest.Mock).mockRejectedValue(new Error("DB error"));

      await expect(
        repo.createBooking({ user: "user123", bike: "bike123" })
      ).rejects.toThrow("DB error");
    });
  });

  // ─── updateBooking ────────────────────────────────────────────────────────

  describe("updateBooking", () => {
    it("should update and return the updated booking", async () => {
      const updated = { ...mockBooking, returnDate: new Date("2027-02-01") };
      (BookingModel.findByIdAndUpdate as jest.Mock).mockReturnValue(
        mockPopulate(updated)
      );

      const result = await repo.updateBooking("booking123", {
        returnDate: new Date("2027-02-01"),
      });

      expect(BookingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "booking123",
        { returnDate: new Date("2027-02-01") },
        { new: true }
      );
      expect(result).toEqual(updated);
    });

    it("should return null when booking to update is not found", async () => {
      (BookingModel.findByIdAndUpdate as jest.Mock).mockReturnValue(
        mockPopulate(null)
      );

      const result = await repo.updateBooking("nonexistent", {
        returnDate: new Date("2027-02-01"),
      });

      expect(BookingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "nonexistent",
        { returnDate: new Date("2027-02-01") },
        { new: true }
      );
      expect(result).toBeNull();
    });
  });

  // ─── deleteBooking ────────────────────────────────────────────────────────

  describe("deleteBooking", () => {
    it("should return deleted booking when found", async () => {
      (BookingModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockBooking);

      const result = await repo.deleteBooking("booking123");

      expect(BookingModel.findByIdAndDelete).toHaveBeenCalledWith("booking123");
      expect(result).toEqual(mockBooking);
    });

    it("should return null when booking to delete is not found", async () => {
      (BookingModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await repo.deleteBooking("nonexistent");

      expect(BookingModel.findByIdAndDelete).toHaveBeenCalledWith("nonexistent");
      expect(result).toBeNull();
    });
  });
});