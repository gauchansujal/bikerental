import { BookingServices } from "../../../services/booking.services";
import { BookingRepository } from "../../../repositories/booking.repository";
import { DLModel } from "../../../models/driving.license.model";

jest.mock("../../../repositories/booking.repository");
jest.mock("../../../models/driving.license.model");

const mockBooking = {
  _id: "booking123",
  user: "user123",
  bike: "bike123",
  bookingDate: new Date("2027-01-01"),
  returnDate: new Date("2027-01-10"),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const validInput = {
  bike: "bike123",
  bookingDate: new Date("2027-01-01"),
  returnDate: new Date("2027-01-10"),
};

describe("BookingServices", () => {
  let service: BookingServices;
  let repoMock: jest.Mocked<BookingRepository>;

  beforeEach(() => {
    service = new BookingServices();
    repoMock = (BookingRepository as jest.Mock).mock.instances[0];
    jest.clearAllMocks();
  });

  // ─── getAllBooking ─────────────────────────────────────────────────────────

  describe("getAllBooking", () => {
    it("should return all bookings", async () => {
      repoMock.getAllBooking = jest.fn().mockResolvedValue([mockBooking]);

      const result = await service.getAllBooking();

      expect(repoMock.getAllBooking).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockBooking]);
    });

    it("should return empty array when no bookings exist", async () => {
      repoMock.getAllBooking = jest.fn().mockResolvedValue([]);

      const result = await service.getAllBooking();

      expect(result).toEqual([]);
    });
  });

  // ─── getBookingById ───────────────────────────────────────────────────────

  describe("getBookingById", () => {
    it("should return a booking by id", async () => {
      repoMock.getBookingByID = jest.fn().mockResolvedValue(mockBooking);

      const result = await service.getBookingById("booking123");

      expect(repoMock.getBookingByID).toHaveBeenCalledWith("booking123");
      expect(result).toEqual(mockBooking);
    });

    it("should throw when booking is not found", async () => {
      repoMock.getBookingByID = jest.fn().mockResolvedValue(null);

      await expect(service.getBookingById("nonexistent")).rejects.toThrow(
        "Booking not found"
      );
    });
  });

  // ─── createBooking ────────────────────────────────────────────────────────

  describe("createBooking", () => {
    it("should create booking when user has driving license", async () => {
      (DLModel.findOne as jest.Mock).mockResolvedValue({ _id: "dl123" });
      repoMock.createBooking = jest.fn().mockResolvedValue(mockBooking);

      const result = await service.createBooking(validInput, "user123");

      expect(DLModel.findOne).toHaveBeenCalledWith({ user: "user123" });
      expect(repoMock.createBooking).toHaveBeenCalledWith({
        ...validInput,
        user: "user123",
      });
      expect(result).toEqual(mockBooking);
    });

    it("should throw when user has no driving license", async () => {
      (DLModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.createBooking(validInput, "user123")
      ).rejects.toThrow("User must have a driving licesnse to book a bike");
    });

    it("should throw when bike is missing", async () => {
      (DLModel.findOne as jest.Mock).mockResolvedValue({ _id: "dl123" });

      await expect(
        service.createBooking({ ...validInput, bike: "" }, "user123")
      ).rejects.toThrow("Bike is required");
    });

    it("should not call repo when validation fails", async () => {
      (DLModel.findOne as jest.Mock).mockResolvedValue({ _id: "dl123" });
      repoMock.createBooking = jest.fn();

      await expect(
        service.createBooking({ ...validInput, bike: "" }, "user123")
      ).rejects.toThrow();

      expect(repoMock.createBooking).not.toHaveBeenCalled();
    });

    it("should not call repo when user has no driving license", async () => {
      (DLModel.findOne as jest.Mock).mockResolvedValue(null);
      repoMock.createBooking = jest.fn();

      await expect(
        service.createBooking(validInput, "user123")
      ).rejects.toThrow();

      expect(repoMock.createBooking).not.toHaveBeenCalled();
    });
  });

  // ─── updateBooking ────────────────────────────────────────────────────────

  describe("updateBooking", () => {
    it("should update and return updated booking", async () => {
      const updated = { ...mockBooking, returnDate: new Date("2027-02-01") };
      repoMock.updateBooking = jest.fn().mockResolvedValue(updated);

      const result = await service.updateBooking("booking123", {
        returnDate: new Date("2027-02-01"),
      });

      expect(repoMock.updateBooking).toHaveBeenCalledWith("booking123", {
        returnDate: new Date("2027-02-01"),
      });
      expect(result).toEqual(updated);
    });

    it("should throw when booking to update is not found", async () => {
      repoMock.updateBooking = jest.fn().mockResolvedValue(null);

      await expect(
        service.updateBooking("nonexistent", { returnDate: new Date() })
      ).rejects.toThrow("Booking not found");
    });

    it("should throw when update data is invalid", async () => {
      await expect(
        service.updateBooking("booking123", { bookingDate: "invalid" as any })
      ).rejects.toThrow("Validation failed");
    });
  });

  // ─── deleteBooking ────────────────────────────────────────────────────────

  describe("deleteBooking", () => {
    it("should return deleted booking", async () => {
      repoMock.deleteBooking = jest.fn().mockResolvedValue(mockBooking);

      const result = await service.deleteBooking("booking123");

      expect(repoMock.deleteBooking).toHaveBeenCalledWith("booking123");
      expect(result).toEqual(mockBooking);
    });

    it("should throw when booking to delete is not found", async () => {
      repoMock.deleteBooking = jest.fn().mockResolvedValue(null);

      await expect(service.deleteBooking("nonexistent")).rejects.toThrow(
        "Booking not found"
      );
    });
  });
});