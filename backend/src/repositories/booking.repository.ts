import { BookingModel, IBooking } from "../models/booking.model";
import { BookingType } from "../types/booking.type";

export interface IBookingRespository {
    getAllBooking(): Promise<IBooking[]>;
    getBookingByID(id: string): Promise<IBooking|null>;
    createBooking(useData:BookingType): Promise<IBooking>;
    updateBooking(id:string, useData: Partial<BookingType>): Promise<IBooking|null>;
    deleteBooking(id: string): Promise<IBooking | null>;   
};
export class BookingRepository implements IBookingRespository{
     async getAllBooking(): Promise<IBooking[]> {
    return await BookingModel.find()
    .populate("user")
    .populate("bike");
    }
     async getBookingByID(id: string): Promise<IBooking | null> {
       return await BookingModel.findById(id)
       .populate("user")
       .populate("bike");
    }
    async createBooking(useData: BookingType): Promise<IBooking> {
       return await BookingModel.create(useData);
    }
    async updateBooking(id: string, useData: Partial<BookingType>): Promise<IBooking | null> {
        return await BookingModel.findByIdAndUpdate(id, useData,{new: true})
        .populate("user")
        .populate("bike");

    }
    async deleteBooking(id: string): Promise<IBooking | null> {
       return await BookingModel.findByIdAndDelete(id);
    }

}
