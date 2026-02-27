const Activity = require('../models/Activity');

const logActivity = async (userId, actionType, description, relatedModel, relatedId) => {
  try {
    await Activity.create({
      user: userId,
      actionType,
      description,
      relatedModel,
      relatedId,
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = logActivity;
