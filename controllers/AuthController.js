const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { apiResponse } = require('../utils/response');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Auth
exports.googleAuth = async (req, res) => {
  const { idToken } = req.body || {};

  if (!idToken) return apiResponse(res, 400, 'Missing idToken in request body.')

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({
      success: false,
      message: 'Google client ID is not configured.'
    });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub) {
      throw new Error('Invalid Google token payload.');
    }

    // Find or create user
    let user = await User.findOne({ where: { email: payload.email } });
    
    if (!user) {
      user = await User.create({
        fullName: payload.name || payload.email,
        email: payload.email,
        avatarUrl: payload.picture || null,
        role: 'lecture_seule'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );

    console.log(`User logged in via Google: ${user.email}`);

    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Google Auth error:', error.message || error);
    return apiResponse(res, 401, 'Invalid Google token.')
  }
};

exports.verify = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return apiResponse(res, 404, 'User not found.')
    return apiResponse(
			res,
			200,
			{
				id: user.id,
				email: user.email,
				fullName: user.fullName,
				role: user.role,
				avatarUrl: user.avatarUrl
			}
		)
  } catch (error) {
    console.error('Verify error:', error);
		return apiResponse(res, 500, 'Internal server error.')
  }
};