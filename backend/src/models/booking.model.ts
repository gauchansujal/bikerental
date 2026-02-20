import mongoose, { Schema, model, Document } from "mongoose";
import { BookingType } from "../types/booking.type";

const BookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bike: {
      type: Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export interface IBooking extends BookingType,Document {
  _id: mongoose.Types.ObjectId;
  // user: mongoose.Types.ObjectId; // ObjectId in DB
  // bike: mongoose.Types.ObjectId; // ObjectId in DB
  // bookingDate?: Date;
  // returnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const BookingModel = model<IBooking>("Booking", BookingSchema);