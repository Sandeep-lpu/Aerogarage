import Notification from "../models/notification.model.js";

export const getNotifications = async (userId, limit = 50) => {
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ recipient: userId, read: false });
};

export const markAsRead = async (userId, notificationId) => {
  if (notificationId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );
  } else {
    // Mark all as read
    await Notification.updateMany({ recipient: userId, read: false }, { read: true });
    return { success: true };
  }
};

export const createNotification = async (recipientId, type, title, message, link = null) => {
  const notification = new Notification({
    recipient: recipientId,
    type,
    title,
    message,
    link,
  });
  return await notification.save();
};
