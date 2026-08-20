const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const SalaryController = require('../controllers/SalaryController');

router.get('/', requireAuth, SalaryController.getAllSalarySettings);
router.get('/:id', requireAuth, SalaryController.getSalarySettingById);
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), SalaryController.createSalarySetting);
router.put('/:id', requireAuth, requireRole(['admin', 'gestionnaire']), SalaryController.updateSalarySetting);
router.delete('/:id', requireAuth, requireRole(['admin']), SalaryController.deleteSalarySetting);

module.exports = router;
