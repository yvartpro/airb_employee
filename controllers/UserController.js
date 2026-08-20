const { User } = require('../models');
const { apiResponse } = require('../utils/response');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: [] }
    });
    return apiResponse(res, 200, 'Users retrieved successfully', users)
  } catch (error) {
    console.error('Error fetching users:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return apiResponse(res, 404,'User not found.')
    return apiResponse(res, 200, 'User retrieved', user)
  } catch (error) {
    console.error('Error fetching user:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, role, avatarUrl } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return apiResponse(res, 404,'User not found.')

    // Only admin can change roles
    if (role && role !== user.role && req.user.role !== 'admin') {
      return apiResponse(res, 403, 'Insufficient permissions.' )
    }

    await user.update({
      fullName: fullName || user.fullName,
      phone: phone || user.phone,
      role: role || user.role,
      avatarUrl: avatarUrl || user.avatarUrl
    });

    return apiResponse(res, 201, 'User updated successfully.', user)
  } catch (error) {
    console.error('Error updating user:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) return apiResponse(res, 404,'User not found.')

    await user.destroy();
    return apiResponse(res, 200, 'User deleted successfully.')
  } catch (error) {
    console.error('Error deleting user:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};
