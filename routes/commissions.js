const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const CommissionController = require('../controllers/CommissionController');

router.get('/', requireAuth, CommissionController.getAllCommissions);
router.get('/summary', requireAuth, CommissionController.getCommissionSummary);
router.get('/:id', requireAuth, CommissionController.getCommissionById);
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), CommissionController.createCommission);
router.delete('/:id', requireAuth, requireRole(['admin']), CommissionController.deleteCommission);

module.exports = router;
