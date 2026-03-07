import { IBooking } from "../models/booking.model";
import { BookingRepository } from "../repositories/booking.repository";
import { BookingSchema } from "../types/booking.type";
import { DLModel } from "../models/driving.license.model";
import { NotificationServices } from "./notification.services";

type CreateBookingPayload = {
    bike: string;
    user: string;
    bookingDate?: Date;
    returnDate?: Date;
};

export class BookingServices {
    private repo = new BookingRepository();
    private notificationService = new NotificationServices();

    // get all
    async getAllBooking(): Promise<IBooking[]> {
        return await this.repo.getAllBooking();
    }

    // get by id
    async getBookingById(id: string): Promise<IBooking> {
        const booking = await this.repo.getBookingByID(id);
        if (!booking) throw new Error("Booking not found");
        return booking;
    }

    // create
    async createBooking(useData: unknown, userId: string): Promise<IBooking> {
        const dl = await DLModel.findOne({ user: userId });
        if (!dl) {
            throw new Error("User must have a driving license to book a bike");
        }

        const parsed = BookingSchema.safeParse(useData);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((e) => e.message).join(",");
            throw new Error(`validation failed :${errors} `);
        }

        const payload: CreateBookingPayload = {
            ...parsed.data,
            user: userId,
        };

        const booking = await this.repo.createBooking(payload); // ✅ only called once

        await this.notificationService.createNotification({
            userId,
            title: "Booking Confirmed! 🎉",
            message: `You booked a bike from ${booking.bookingDate?.toDateString()?? "N/A"} to ${booking.returnDate?.toDateString()?? "N/A"}`,
            type: "booking_confirmed",
            bookingId: booking._id.toString(),
        });

        return booking; // ✅ return same booking, NOT a second one
    }

    // update
    async updateBooking(id: string, useData: unknown): Promise<IBooking> {
        const parsed = BookingSchema.partial().safeParse(useData);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((e) => e.message).join(",");
            throw new Error(`Validation failed: ${errors}`);
        }
        const updatedBooking = await this.repo.updateBooking(id, parsed.data);
        if (!updatedBooking) throw new Error("Booking not found");
        return updatedBooking;
    }

    // delete
    async deleteBooking(id: string): Promise<IBooking> {
        const deleted = await this.repo.deleteBooking(id);
        if (!deleted) throw new Error("Booking not found");
        return deleted;
    }
}