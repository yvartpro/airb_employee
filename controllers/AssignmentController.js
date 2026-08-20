const { Assignment, Employee, Partner, ActivityLog } = require('../models');

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        {
          model: Employee,
          attributes: ['id', 'firstName', 'lastName', 'photoUrl']
        },
        {
          model: Partner,
          attributes: ['id', 'name', 'status']
        }
      ]
    });
    res.json({ success: true, assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.getAssignmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findByPk(id, {
      include: [
        {
          model: Employee,
          attributes: ['id', 'firstName', 'lastName', 'phone', 'photoUrl']
        },
        {
          model: Partner,
          attributes: ['id', 'name', 'contactPhone', 'defaultCommissionRate']
        },
        {
          association: 'salarySettings',
          attributes: ['id', 'grossSalary', 'commissionRate', 'netSalary', 'effectiveMonth']
        }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }
    res.json({ success: true, assignment });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.createAssignment = async (req, res) => {
  const { employeeId, partnerId, contractType, startDate, durationMonths, renewable, endDate, status } = req.body;

  if (!employeeId || !partnerId || !contractType || !startDate) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  try {
    const assignment = await Assignment.create({
      employeeId,
      partnerId,
      contractType,
      startDate,
      durationMonths,
      renewable: renewable || false,
      endDate,
      status: status || 'actif'
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'creation',
      entityType: 'assignment',
      entityId: assignment.id,
      details: { employeeId, partnerId, contractType }
    });

    res.status(201).json({ success: true, message: 'Assignment created successfully.', assignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { contractType, startDate, durationMonths, renewable, endDate, status } = req.body;

  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    const oldData = assignment.toJSON();
    await assignment.update({
      contractType: contractType || assignment.contractType,
      startDate: startDate || assignment.startDate,
      durationMonths: durationMonths !== undefined ? durationMonths : assignment.durationMonths,
      renewable: renewable !== undefined ? renewable : assignment.renewable,
      endDate: endDate || assignment.endDate,
      status: status || assignment.status
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'modification',
      entityType: 'assignment',
      entityId: assignment.id,
      details: { oldData, newData: assignment.toJSON() }
    });

    res.json({ success: true, message: 'Assignment updated successfully.', assignment });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    const assignmentData = assignment.toJSON();
    await assignment.destroy();

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'suppression',
      entityType: 'assignment',
      entityId: id,
      details: assignmentData
    });

    res.json({ success: true, message: 'Assignment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
