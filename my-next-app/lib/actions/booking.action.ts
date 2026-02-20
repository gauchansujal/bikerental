import api from "../api/axios";
import { API } from "../api/endpoints";

export type Booking = {
  _id?: string;
  user: string;
  bike: string;
  bookingDate?: Date;
  returnDate?: Date;
};

export const createBooking = async (bikeId: string, returnDate: Date) => {
  const res = await api.post(API.BOOKING.CREATE, {
    bike: bikeId,        // matches model field name "bike"
    returnDate,          // matches model field name "returnDate"
    // "user" is taken from the auth token on the backend
  });
  return res.data;
};

export const fetchMyBookings = async (): Promise<Booking[]> => {
  try {
    const res = await api.get(API.BOOKING.GET_ALL);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching bookings:", err);
    throw err;
  }
};