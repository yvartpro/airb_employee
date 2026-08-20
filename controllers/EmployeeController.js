const { Employee, User, ActivityLog } = require('../models');
const { apiResponse } = require('../utils/response');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email']
        }
      ]
    });
    return apiResponse(res, 200, 'Employees retrieved successfully', employees)
  } catch (error) {
    console.error('Error fetching employees:', error);
    return apiResponse(res, 5000, 'Internal server error.')
  }
};

exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email']
        },
        {
          association: 'assignments',
          attributes: ['id', 'partnerId', 'contractType', 'startDate', 'status']
        }
      ]
    });
    if (!employee) return apiResponse(res, 404,'Employee not found.')
    return apiResponse(res, 200, "Employee retrieved", employee)
  } catch (error) {
    console.error('Error fetching employee:', error);
    return apiResponse(res, 5000, 'Internal server error.')
  }
};

exports.createEmployee = async (req, res) => {
  const { firstName, lastName, phone, origin, availability } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!firstName || !lastName)return apiResponse(res, 401, 'First name and last name are required.')

  try {
    const employee = await Employee.create({
      firstName,
      lastName,
      phone,
      origin,
      photoUrl,
      availability: availability || 'disponible',
      createdBy: req.user.id
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'creation',
      entityType: 'employee',
      entityId: employee.id,
      details: { firstName, lastName }
    });
    return apiResponse(res, 201,'Employee created successfully.', employee)
  } catch (error) {
    console.error('Error creating employee:', error);
    return apiResponse(res, 5000, 'Internal server error.')
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, origin, availability } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) return apiResponse(res, 404,'Employee not found.')

    const oldData = employee.toJSON();
    await employee.update({
      firstName: firstName || employee.firstName,
      lastName: lastName || employee.lastName,
      phone: phone || employee.phone,
      origin: origin || employee.origin,
      availability: availability || employee.availability,
      ...(photoUrl && { photoUrl })
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'modification',
      entityType: 'employee',
      entityId: employee.id,
      details: { oldData, newData: employee.toJSON() }
    });

    return apiResponse(res, 200, 'Employee updated successfully.', employee)
  } catch (error) {
    console.error('Error updating employee:', error);
    return apiResponse(res, 5000, 'Internal server error.')
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) return apiResponse(res, 404, 'Employee not found.')

    const employeeData = employee.toJSON();
    await employee.destroy();

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'suppression',
      entityType: 'employee',
      entityId: id,
      details: employeeData
    });

    return apiResponse(res, 200, 'Employee deleted successfully.')
  } catch (error) {
    console.error('Error deleting employee:', error);
    return apiResponse(res, 5000, 'Internal server error.')
  }
};
