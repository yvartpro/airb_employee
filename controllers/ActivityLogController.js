const { ActivityLog, User } = require('../models');
const { Op } = require('sequelize');
const { apiResponse } = require('../utils/response');

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

    return apiResponse(res, 200, 'Activity logs fetched successfully.', logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return apiResponse(res, 500, 'Internal server error.');
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
        return apiResponse(res, 404, 'Activity log not found.');
    }
    return apiResponse(res, 200,"Activity log retrieved successfully.", log)
  } catch (error) {
    console.error('Error fetching activity log:', error);
    return apiResponse(res,500,'Internal server error.')
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

    return apiResponse(res, 200, "Logs retrieved successfully.", logs)
  } catch (error) {
    console.error('Error fetching user activity logs:', error)
    return apiResponse(res, 500, 'Internal server error.')
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
    return apiResponse(res, 200, "Logs retrieved successfully.", logs)

  } catch (error) {
    console.error('Error fetching entity activity logs:', error);
    return apiResponse(res, 500, 'Internal server error.')
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

    return apiResponse(res, 200, "Stats retrieved successfully.", stats)
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};
