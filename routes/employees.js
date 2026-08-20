const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const EmployeeController = require('../controllers/EmployeeController');

router.get('/', requireAuth, EmployeeController.getAllEmployees);
router.get('/:id', requireAuth, EmployeeController.getEmployeeById);
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), uploadSingle, EmployeeController.createEmployee);
router.put('/:id', requireAuth, requireRole(['admin', 'gestionnaire']), uploadSingle, EmployeeController.updateEmployee);
router.delete('/:id', requireAuth, requireRole(['admin']), EmployeeController.deleteEmployee);

module.exports = router;
