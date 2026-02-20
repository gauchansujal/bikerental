import { Request, Response } from "express";
import { BookingServices } from "../services/booking.services";

const service = new BookingServices();

export class BookingController {
  // Get All
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await service.getAllBooking();
      res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get By ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: "ID is required" });
        return;
      }
      const booking = await service.getBookingById(id);
      res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  // Create
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)._id.toString(); // ← fixed
      const booking = await service.createBooking(req.body, userId);
      res.status(201).json({ success: true, message: "bike booked successfully!", data: booking });
    } catch (error: any) {
        const isDLError = error.message.includes("driving license");
      res.status(400).json({ success: false, message: isDLError ? "Please provide a valid driving license" : error.message });
    }
  }

  // Update
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: "ID is required" });
        return;
      }
      const booking = await service.updateBooking(id, req.body);
      res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Delete
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: "ID is required" });
        return;
      }
      const booking = await service.deleteBooking(id);
      res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}