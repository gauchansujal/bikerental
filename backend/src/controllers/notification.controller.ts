import { Request, Response } from "express";
import { NotificationServices } from "../services/notification.services";

const service = new NotificationServices();

export class NotificationController {
  // Get all notifications for logged-in user
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)._id.toString();
      const notifications = await service.getAllByUser(userId);
      res.status(200).json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get unread count
  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)._id.toString();
      const count = await service.getUnreadCount(userId);
      res.status(200).json({ success: true, unread_count: count });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Mark single notification as read
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: "ID is required" });
        return;
      }
      const userId = (req.user as any)._id.toString();
      const notification = await service.markAsRead(id, userId);
      res.status(200).json({ success: true, data: notification });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  // Mark all notifications as read
  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)._id.toString();
      await service.markAllAsRead(userId);
      res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}