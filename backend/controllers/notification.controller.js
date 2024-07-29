import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notificationsForUser = await Notification.find({ to: userId }).populate({
      path: 'from',
      select: 'username profileImg',
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notificationsForUser);
  } catch (error) {
    console.log('Error in getNotifications controller: ', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: 'Notifications deleted' });
  } catch (error) {
    console.log('Error in deleteNotification controller: ', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;
    const notification = await Notification.findById({ _id: notificationId });

    if (userId.toString() !== notification.to.toString()) {
      res.status(400).json({ error: 'You are not authorized to delete this notification' });
    }

    if (!notification) {
      res.status(400).json({ error: 'Notification is not found' });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.log('Error in deleteNotification controller: ', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
