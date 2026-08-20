const { Employee, User, ActivityLog } = require('../models');

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
    res.json({ success: true, employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
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

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.json({ success: true, employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.createEmployee = async (req, res) => {
  const { firstName, lastName, phone, origin, availability } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!firstName || !lastName) {
    return res.status(400).json({ success: false, message: 'First name and last name are required.' });
  }

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

    res.status(201).json({ success: true, message: 'Employee created successfully.', employee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, origin, availability } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

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

    res.json({ success: true, message: 'Employee updated successfully.', employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

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

    res.json({ success: true, message: 'Employee deleted successfully.' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
