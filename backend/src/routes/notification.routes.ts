import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import  {authorizationMiddleware} from "../middlewares/authorized.middleware"; // your existing middleware

const router = Router();
const controller = new NotificationController();

router.use(authorizationMiddleware);

router.get("/",              (req, res) => controller.getAll(req, res));
router.get("/unread-count",  (req, res) => controller.getUnreadCount(req, res));
router.patch("/read-all",    (req, res) => controller.markAllAsRead(req, res));
router.patch("/:id/read",    (req, res) => controller.markAsRead(req, res));

export default router;

// ─── PLUG INTO YOUR booking.services.ts ──────────────────────────────────────
//
// Import NotificationServices at the top of booking.services.ts:
//
//   import { NotificationServices } from "./notification.services";
//   const notificationService = new NotificationServices();
//
// Then inside createBooking(), after: return await this.repo.createBooking(payload);
//
//   const booking = await this.repo.createBooking(payload);
//
//   await notificationService.createNotification({
//     userId,
//     title: "Booking Confirmed! 🎉",
//     message: `You booked a bike from ${booking.bookingDate?.toDateString()} to ${booking.returnDate?.toDateString()}`,
//     type: "booking_confirmed",
//     bookingId: booking._id.toString(),
//   });
//
//   return booking;
//
// ─── REGISTER IN app.ts / server.ts ──────────────────────────────────────────
//
//   import notificationRoutes from "./routes/notification.routes";
//   app.use("/api/notifications", notificationRoutes);