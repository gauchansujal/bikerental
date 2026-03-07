import mongoose, { Schema, model, Document } from "mongoose";

export type NotificationType = {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "booking_confirmed" | "booking_cancelled" | "booking_updated" | "booking_reminder";
  is_read: boolean;
  booking?: mongoose.Types.ObjectId;
};

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["booking_confirmed", "booking_cancelled", "booking_updated", "booking_reminder"],
      required: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export interface INotification extends NotificationType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const NotificationModel = model<INotification>("Notification", NotificationSchema);