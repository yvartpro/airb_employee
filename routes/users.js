const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const UserController = require('../controllers/UserController');

router.get('/', requireAuth, UserController.getAllUsers);
router.get('/:id', requireAuth, UserController.getUserById);
router.put('/:id', requireAuth, UserController.updateUser);
router.delete('/:id', requireAuth, requireRole(['admin']), UserController.deleteUser);

module.exports = router;
