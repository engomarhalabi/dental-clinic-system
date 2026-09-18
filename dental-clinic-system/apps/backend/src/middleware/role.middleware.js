const { error } = require('../utils/apiResponse');

/**
 * Middleware للتحقق أن دور المستخدم الحالي مسموح له بالوصول لهذا الـ route
 * الاستخدام: authorize('ADMIN', 'DENTIST')
 * يجب استخدامه بعد authenticate middleware دائماً
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'غير مصرح - يرجى تسجيل الدخول', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'ليس لديك صلاحية للقيام بهذا الإجراء', 403);
    }

    next();
  };
}

module.exports = authorize;
