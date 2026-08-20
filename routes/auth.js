const express = require('express');
const router = express.Router();
const { googleAuth, login, verify } = require('../controllers/AuthController');
const { requireAuth } = require('../middleware/auth');

router.post('/google', googleAuth);
router.post('/login', login);
router.get('/verify', requireAuth, verify);

module.exports = router;
