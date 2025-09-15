const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const token = req.cookies.token;
  const data = token ? verifyToken(token) : null;
  if (!data) return res.status(401).json({ error: 'Unauthorized' });
  req.user = { id: data.id, email: data.email };
  next();
}

module.exports = { signToken, verifyToken, requireAuth };


