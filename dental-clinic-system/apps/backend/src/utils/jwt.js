const jwt = require('jsonwebtoken');

/**
 * توليد JWT Token لمستخدم بعد تسجيل الدخول
 * يحتوي التوكن على: id المستخدم، role (الدور)
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * التحقق من صحة التوكن وفك تشفيره
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
