const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: [] }
    });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, role, avatarUrl } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Only admin can change roles
    if (role && role !== user.role && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Insufficient permissions.' });
    }

    await user.update({
      fullName: fullName || user.fullName,
      phone: phone || user.phone,
      role: role || user.role,
      avatarUrl: avatarUrl || user.avatarUrl
    });

    res.json({ success: true, message: 'User updated successfully.', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
