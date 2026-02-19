import z from "zod";

export const BookingSchema = z.object({
    bike: z.string().min(1, "Bike is required"),
    bookingDate: z.coerce.date().optional(),
    retrunDate: z.coerce.date().optional(), // ← fixed typo retrunDate → returnDate
});

export type BookingType = z.infer<typeof BookingSchema>;