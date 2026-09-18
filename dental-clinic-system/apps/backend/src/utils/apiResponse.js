// دوال مساعدة لتوحيد شكل الاستجابات عبر كل الـ API

function success(res, data, message = 'تمت العملية بنجاح', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function error(res, message = 'حدث خطأ', statusCode = 400, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = { success, error };
