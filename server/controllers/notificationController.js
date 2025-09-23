import Notification from "../models/notification.js";

const sendNotification = async (req, res) => {
  try {
    const { receiver, title, message, data, type } = req.body;

    const newNotification = new Notification({
      sender: req.user._id, 
      receiver,
      title,
      message,
      data,
      type,
    });

    await newNotification.save();

    res.status(201).json({ success: true, message: 'Notification sent successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send notification', error: error.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};

const getNotificationsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const notifications = await Notification.find({
      receiver: req.user._id,
      type,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications by type', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notification', error: error.message });
  }
};

const getSalaryNoti = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
      type: 'salary',
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch salary notifications', error: error.message });
  }
};

const attendanceCheck = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
      type: 'attendance',
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendance notifications', error: error.message });
  }
};

const leaveNoti = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
      type: 'leave',
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leave notifications', error: error.message });
  }
};

export default {  sendNotification,  getAllNotifications,  getNotificationsByType,  markAsRead,  getSalaryNoti,  attendanceCheck,  leaveNoti,};
