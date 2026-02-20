import z from "zod";

export const BookingSchema = z.object({
 user: z.string().optional(),
  bike: z.string().min(1, "Bike is required"),
  bookingDate: z.coerce.date().optional(),
  returnDate: z.coerce.date().optional(), // ✅ correct spelling
});

export type BookingType = z.infer<typeof BookingSchema>;