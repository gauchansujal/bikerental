import z from "zod";

export const NotificationSchema = z.object({
  user: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum([
    "booking_confirmed",
    "booking_cancelled",
    "booking_updated",
    "booking_reminder",
  ]),
  is_read: z.boolean().optional(),
  booking: z.string().optional(),
});

export type NotificationType = z.infer<typeof NotificationSchema>;