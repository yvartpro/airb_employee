const { SalarySetting, Assignment, Employee, Partner } = require('../models');

exports.getAllSalarySettings = async (req, res) => {
  try {
    const salarySettings = await SalarySetting.findAll({
      include: [
        {
          association: 'assignment',
          include: [
            {
              model: Employee,
              attributes: ['firstName', 'lastName']
            },
            {
              model: Partner,
              attributes: ['name']
            }
          ]
        }
      ]
    });
    res.json({ success: true, salarySettings });
  } catch (error) {
    console.error('Error fetching salary settings:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.getSalarySettingById = async (req, res) => {
  const { id } = req.params;
  try {
    const salarySetting = await SalarySetting.findByPk(id, {
      include: [
        {
          association: 'assignment',
          include: [
            {
              model: Employee,
              attributes: ['firstName', 'lastName', 'phone']
            },
            {
              model: Partner,
              attributes: ['name', 'defaultCommissionRate']
            }
          ]
        }
      ]
    });

    if (!salarySetting) {
      return res.status(404).json({ success: false, message: 'Salary setting not found.' });
    }
    res.json({ success: true, salarySetting });
  } catch (error) {
    console.error('Error fetching salary setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.createSalarySetting = async (req, res) => {
  const { assignmentId, grossSalary, commissionRate, effectiveMonth } = req.body;

  if (!assignmentId || !grossSalary || commissionRate === undefined || !effectiveMonth) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  try {
    // Calculate commission amount and net salary
    const commissionAmount = parseFloat(grossSalary) * (parseFloat(commissionRate) / 100);
    const netSalary = parseFloat(grossSalary) - commissionAmount;

    const salarySetting = await SalarySetting.create({
      assignmentId,
      grossSalary: parseFloat(grossSalary),
      commissionRate: parseFloat(commissionRate),
      commissionAmount: parseFloat(commissionAmount.toFixed(2)),
      netSalary: parseFloat(netSalary.toFixed(2)),
      effectiveMonth
    });

    res.status(201).json({ success: true, message: 'Salary setting created successfully.', salarySetting });
  } catch (error) {
    console.error('Error creating salary setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.updateSalarySetting = async (req, res) => {
  const { id } = req.params;
  const { grossSalary, commissionRate } = req.body;

  try {
    const salarySetting = await SalarySetting.findByPk(id);
    if (!salarySetting) {
      return res.status(404).json({ success: false, message: 'Salary setting not found.' });
    }

    const newGrossSalary = grossSalary !== undefined ? parseFloat(grossSalary) : salarySetting.grossSalary;
    const newCommissionRate = commissionRate !== undefined ? parseFloat(commissionRate) : salarySetting.commissionRate;

    const commissionAmount = newGrossSalary * (newCommissionRate / 100);
    const netSalary = newGrossSalary - commissionAmount;

    await salarySetting.update({
      grossSalary: newGrossSalary,
      commissionRate: newCommissionRate,
      commissionAmount: parseFloat(commissionAmount.toFixed(2)),
      netSalary: parseFloat(netSalary.toFixed(2))
    });

    res.json({ success: true, message: 'Salary setting updated successfully.', salarySetting });
  } catch (error) {
    console.error('Error updating salary setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.deleteSalarySetting = async (req, res) => {
  const { id } = req.params;

  try {
    const salarySetting = await SalarySetting.findByPk(id);
    if (!salarySetting) {
      return res.status(404).json({ success: false, message: 'Salary setting not found.' });
    }

    await salarySetting.destroy();
    res.json({ success: true, message: 'Salary setting deleted successfully.' });
  } catch (error) {
    console.error('Error deleting salary setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
