const { Assignment, Employee, Partner, ActivityLog } = require('../models');
const { apiResponse } = require('../utils/response');

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
    return apiResponse(res, 200, "Assignments retrieved successfully.", assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return apiResponse(res, 500, 'Internal server error.')
    
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

    if (!assignment) return apiResponse(res, 404, "Assignment not found.")
    res.json({ success: true, assignment });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return apiResponse(res, 500, 'Internal server error.')
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

    return apiResponse(res, 201, "Assignment created successfully.", assignment)
  } catch (error) {
    console.error('Error creating assignment:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { contractType, startDate, durationMonths, renewable, endDate, status } = req.body;

  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) return apiResponse(res, 404, 'Assignment not found.')

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

    return apiResponse(res, 201, 'Assignment updated successfully.', assignment)
  } catch (error) {
    console.error('Error updating assignment:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) return apiResponse(res, 404, 'Assignment not found.')

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

    return apiResponse(res, 201, 'Assignment deleted successfully.')
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};
