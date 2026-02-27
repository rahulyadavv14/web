const Notification = require('../models/Notification');

const createNotification = async (userId, message, type, relatedModel, relatedId) => {
  try {
    await Notification.create({
      user: userId,
      message,
      type,
      relatedModel,
      relatedId,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = createNotification;
