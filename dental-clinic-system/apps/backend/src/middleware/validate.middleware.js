const { validationResult } = require('express-validator');
const { error } = require('../utils/apiResponse');

/**
 * يشغّل بعد سلسلة قواعد express-validator في أي route
 * ويرجع الأخطاء بشكل موحّد إذا كانت البيانات المدخلة غير صحيحة
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 'بيانات غير صحيحة', 422, errors.array());
  }
  next();
}

module.exports = validate;
