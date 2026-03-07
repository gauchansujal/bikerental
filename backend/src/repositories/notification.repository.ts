import { NotificationModel, INotification } from "../models/notification.model";
import { NotificationType } from "../types/notification.types";

export interface INotificationRepository {
  getAllByUser(userId: string): Promise<INotification[]>;
  getById(id: string): Promise<INotification | null>;
  create(data: NotificationType): Promise<INotification>;
  markAsRead(id: string, userId: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}

export class NotificationRepository implements INotificationRepository {
  async getAllByUser(userId: string): Promise<INotification[]> {
    return await NotificationModel.find({ user: userId })
      .populate("booking")
      .sort({ createdAt: -1 });
  }

  async getById(id: string): Promise<INotification | null> {
    return await NotificationModel.findById(id).populate("booking");
  }

  async create(data: NotificationType): Promise<INotification> {
    return await NotificationModel.create(data);
  }

  async markAsRead(id: string, userId: string): Promise<INotification | null> {
    return await NotificationModel.findOneAndUpdate(
      { _id: id, user: userId },
      { is_read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { user: userId, is_read: false },
      { is_read: true }
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({
      user: userId,
      is_read: false,
    });
  }
}