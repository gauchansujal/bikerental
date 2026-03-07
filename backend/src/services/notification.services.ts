import { INotification } from "../models/notification.model";
import { NotificationRepository } from "../repositories/notification.repository";

type CreateNotificationPayload = {
  userId: string;
  title: string;
  message: string;
  type:
    | "booking_confirmed"
    | "booking_cancelled"
    | "booking_updated"
    | "booking_reminder";
  bookingId?: string;
};

export class NotificationServices {
  private repo = new NotificationRepository();

  // Get all notifications for logged-in user
  async getAllByUser(userId: string): Promise<INotification[]> {
    return await this.repo.getAllByUser(userId);
  }

  // Get single notification by id
  async getById(id: string): Promise<INotification> {
    const notification = await this.repo.getById(id);
    if (!notification) throw new Error("Notification not found");
    return notification;
  }

  // Called internally after booking is created/cancelled/updated
  async createNotification(payload: CreateNotificationPayload): Promise<INotification> {
    return await this.repo.create({
      user: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      booking: payload.bookingId,
    });
  }

  // Mark single notification as read
  async markAsRead(id: string, userId: string): Promise<INotification> {
    const notification = await this.repo.markAsRead(id, userId);
    if (!notification) throw new Error("Notification not found");
    return notification;
  }

  // Mark all as read
  async markAllAsRead(userId: string): Promise<void> {
    await this.repo.markAllAsRead(userId);
  }

  // Get unread count (for badge on Flutter side)
  async getUnreadCount(userId: string): Promise<number> {
    return await this.repo.getUnreadCount(userId);
  }
}