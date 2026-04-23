import Notification from "../models/notification.model.js";

export const getNotificationsHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });

    return res.success({ notifications, unreadCount }, "Notifications fetched");
  } catch (error) {
    next(error);
  }
};

export const markAsReadHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    if (notificationId) {
      await Notification.updateOne(
        { _id: notificationId, recipient: userId },
        { $set: { read: true } },
      );
    } else {
      // Mark all as read
      await Notification.updateMany({ recipient: userId }, { $set: { read: true } });
    }

    return res.success(
      {},
      notificationId ? "Notification marked as read" : "All notifications marked as read",
    );
  } catch (error) {
    next(error);
  }
};
