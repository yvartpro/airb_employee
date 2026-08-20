const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const PartnerController = require('../controllers/PartnerController');

router.get('/', requireAuth, PartnerController.getAllPartners);
router.get('/:id', requireAuth, PartnerController.getPartnerById);
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), PartnerController.createPartner);
router.put('/:id', requireAuth, requireRole(['admin', 'gestionnaire']), PartnerController.updatePartner);
router.delete('/:id', requireAuth, requireRole(['admin']), PartnerController.deletePartner);

module.exports = router;
