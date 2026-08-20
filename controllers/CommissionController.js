const { CommissionTransaction, Employee, Partner, SalarySetting } = require('../models');
const { Op } = require('sequelize');
const { apiResponse } = require('../utils/response');

exports.getAllCommissions = async (req, res) => {
  const { partnerId, employeeId, period } = req.query;

  try {
    const where = {};
    if (partnerId) where.partnerId = partnerId;
    if (employeeId) where.employeeId = employeeId;
    if (period) where.period = period;

    const commissions = await CommissionTransaction.findAll({
      where,
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['firstName', 'lastName']
        },
        {
          model: Partner,
          as: 'partner',
          attributes: ['name']
        }
      ],
      order: [['transactionDate', 'DESC']]
    });

    return apiResponse(res, 200, 'Commissions retrieved successfully', commissions)
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.getCommissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const commission = await CommissionTransaction.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'phone']
        },
        {
          model: Partner,
          as: 'partner',
          attributes: ['id', 'name']
        },
        {
          association: 'salarySetting',
          attributes: ['grossSalary', 'commissionRate']
        }
      ]
    });

    if (!commission) return apiResponse(res, 404, 'Commission not found.')
		return apiResponse(res, 200, 'Commission retrieved.', commission )
  } catch (error) {
    console.error('Error fetching commission:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.createCommission = async (req, res) => {
  const { salarySettingId, employeeId, partnerId, amount, period, transactionDate } = req.body;

  if (!employeeId || !partnerId || !amount || !period || !transactionDate) {
    return apiResponse(res, 400, 'Missing required fields.');
  }

  try {
    const commission = await CommissionTransaction.create({
      salarySettingId,
      employeeId,
      partnerId,
      amount: parseFloat(amount),
      period,
      transactionDate
    });

		return apiResponse(res, 201, 'Commission created successfully.', commission)
  } catch (error) {
    console.error('Error creating commission:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

// Get commission summary for a partner or employee
exports.getCommissionSummary = async (req, res) => {
  const { partnerId, employeeId, startDate, endDate } = req.query;

  try {
    const where = {};

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate[Op.gte] = new Date(startDate);
      if (endDate) where.transactionDate[Op.lte] = new Date(endDate);
    }

    if (partnerId) where.partnerId = partnerId;
    if (employeeId) where.employeeId = employeeId;

    const commissions = await CommissionTransaction.findAll({
      where,
      attributes: [
        'period',
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'totalAmount'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['period'],
      raw: true
    });

    const totalAmount = commissions.reduce((sum, c) => sum + parseFloat(c.totalAmount || 0), 0);

		return apiResponse(res, 201, '',{
      summary: commissions,
      totalAmount: parseFloat(totalAmount.toFixed(2))
		})
  } catch (error) {
    console.error('Error fetching commission summary:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.deleteCommission = async (req, res) => {
  const { id } = req.params;

  try {
    const commission = await CommissionTransaction.findByPk(id);
    if (!commission) return apiResponse(res, 404, 'Commission not found.')

    await commission.destroy();
		return apiResponse(res, 201, 'Commission deleted successfully.')
  } catch (error) {
    console.error('Error deleting commission:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};
