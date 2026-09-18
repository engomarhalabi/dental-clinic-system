const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/apiResponse');
const prisma = require('../config/prisma');

/**
 * Middleware يتحقق من وجود توكن صالح في الهيدر Authorization: Bearer <token>
 * إذا كان صالحاً، يضيف بيانات المستخدم (req.user) ويكمل للـ route التالي
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'غير مصرح - يرجى تسجيل الدخول', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // التأكد أن المستخدم ما زال موجوداً ومفعّلاً في قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, fullName: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return error(res, 'الحساب غير موجود أو غير مفعّل', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 'توكن غير صالح أو منتهي الصلاحية', 401);
  }
}

module.exports = authenticate;
