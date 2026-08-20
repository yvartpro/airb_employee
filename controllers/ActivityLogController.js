const { ActivityLog, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllActivityLogs = async (req, res) => {
  const { userId, entityType, action, startDate, endDate } = req.query;

  try {
    const where = {};
    
    if (userId) where.userId = userId;
    if (entityType) where.entityType = entityType;
    if (action) where.action = action;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const logs = await ActivityLog.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit) || 100
    });

    res.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.getActivityLogById = async (req, res) => {
  const { id } = req.params;
  try {
    const log = await ActivityLog.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email', 'role']
        }
      ]
    });

    if (!log) {
      return res.status(404).json({ success: false, message: 'Activity log not found.' });
    }
    res.json({ success: true, log });
  } catch (error) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.getUserActivityLogs = async (req, res) => {
  const { userId } = req.params;
  const { limit = 50 } = req.query;

  try {
    const logs = await ActivityLog.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.getEntityActivityLogs = async (req, res) => {
  const { entityType, entityId } = req.params;

  try {
    const logs = await ActivityLog.findAll({
      where: { entityType, entityId: parseInt(entityId) },
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching entity activity logs:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.getActivityStats = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const stats = await ActivityLog.findAll({
      where,
      attributes: [
        'action',
        'entityType',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['action', 'entityType'],
      raw: true
    });

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
