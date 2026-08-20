const { OAuth2Client } = require('google-auth-library');
const { GOOGLE_CLIENT_ID } = require('./config');
const { saveUser } = require('./database');

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function googleAuth(req, res) {
  const { idToken } = req.body || {};

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: 'Missing idToken in request body.'
    });
  }

  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    return res.status(500).json({
      success: false,
      message: 'Google client ID is not configured. Set GOOGLE_CLIENT_ID in your environment.'
    });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub) {
      throw new Error('Invalid Google token payload.');
    }

    const user = {
      id: payload.sub,
      email: payload.email,
      fullName: payload.name || payload.email,
      avatarUrl: payload.picture || null
    };

    await saveUser(user);

    console.log(`User logged in: ${user.email}`);

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Auth error:', error.message || error);
    return res.status(401).json({
      success: false,
      message: 'Invalid Google token.'
    });
  }
}

const getUserById = async (id) => {
  const user = await saveUser.getUserById(id);
  if (!user) {
    throw new Error('User not found.');
  }
  return user;
};

const getAllUsers = async () => {
  return await saveUser.getUsers();
};

module.exports = {
  googleAuth,
    getUserById,
    getAllUsers
};
