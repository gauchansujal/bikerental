import { error } from "node:console";
import { IBooking } from "../models/booking.model";
import { BookingRepository } from "../repositories/booking.repository";
import { BookingSchema } from "../types/booking.type";

type CreateBookingPayload = {
    bike: string;
    user: string;
    bookingDate?: Date;
    returnDate?: Date;
};

export class BookingServices{
    private repo = new BookingRepository();

    //get all
    async getAllBooking(): Promise<IBooking[]>{
        return await this.repo.getAllBooking();
    }

    // get by id 
    async getBookingById(id:string): Promise<IBooking>{
        const booking = await this.repo.getBookingByID(id);
        if(!booking) throw new Error("Booking not found");
        return booking;
    }

    //create 
    async createBooking(useData: unknown, userId: string): Promise<IBooking>{
        console.log("useData:", useData);   // ← add this line
    console.log("userId:", userId);     // ← add this line
        const parsed = BookingSchema.safeParse(useData);
        if(!parsed.success){
            const errors = parsed.error.issues.map((e)=> e.message).join(",");
            throw new Error(`validation failed :${errors} `);
        }

        const payload: CreateBookingPayload = {
            ...parsed.data,
            user: userId, // injected from auth, not from body
        };

        return await this.repo.createBooking(payload);
    }

    //update 
    async updateBooking(id:string, useData: unknown): Promise<IBooking>{
        const parsed = BookingSchema.partial().safeParse(useData);
        if(!parsed.success){
            const errors = parsed.error.issues.map((e)=>e.message).join(",");
            throw new Error(`Validation failed: ${errors}`);
        }
        const updateBooking = await this.repo.updateBooking(id, parsed.data);
        if(!updateBooking) throw new Error("Booking not found");
        return updateBooking;
    }

    //delete 
    async deleteBooking(id: string): Promise<IBooking>{
        const deleted = await this.repo.deleteBooking(id);
        if(!deleted) throw new Error("Booking not found");
        return deleted;
    }
}