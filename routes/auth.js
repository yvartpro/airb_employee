const express = require('express');
const router = express.Router();
const { googleAuth, login, verify } = require('../controllers/AuthController');
const { requireAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate with Google
 *     tags:
 *       - Auth
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             required:
 *               - token
 *     responses:
 *       200:
 *         description: Successful authentication
 */
router.post('/google', googleAuth);
/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify authentication
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Authentication verified
 */
router.get('/verify', requireAuth, verify);

module.exports = router;
